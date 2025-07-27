<script setup>
import { ref, computed } from 'vue'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { marketStore } from '/stores/marketStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import { gameStateStore } from "/stores/gameStateStore.js"
import eventBus from "@/eventBus.js"
import {
  assemblyMeetsRequirements,
  getMissingModules,
  canHarvestPlant,
  canHarvestAnimalProduct,
  canHarvestAnimal,
  canMoveAnimal,
  canSowPlant,
  assemblyIsCollar,
  validAnimalDestTiles
} from '@/rules/utils.js'

const tilesStoreInstance = tilesStore()
const gameState = gameStateStore()
const day = computed(() => gameState.day)
const tiles = tilesStoreInstance.tiles
const gate = tilesStoreInstance.gate
const flatTiles = computed(() => tiles.flat())
const modules = modulesStore()
const market = marketStore()
const animals = animalsStore()

// ------------------------------------------
// GATE DEPLOY MODAL + LOGIC
// ------------------------------------------
const gateDeployType = ref(null) // 'plant' or 'animal'
const gateDeployItem = ref(null)
const showGateDeployModal = ref(false)
const gateDeployRow = ref(null)
const gateDeployCol = ref(null)

const availableAssemblies = computed(() => modules.activeAssemblies.filter(a => !a.deployed))

// For planting, filter only suitable assemblies (not yet deployed)
function findPlantingAssembly(plantingType) {
  return availableAssemblies.value.find(a => canSowPlant(a, plantingType))
}
function findAnimalMoverAssembly() {
  return availableAssemblies.value.find(a => canMoveAnimal(a))
}

function getAvailableDeployTiles(type) {
  const out = []
  for (let row = 0; row < tiles.length; row++) {
    for (let col = 0; col < tiles[0].length; col++) {
      const tile = tiles[row][col]
      if (type === 'plant') {
        if (!tile.plant) out.push({ row, col })
      } else if (type === 'animal') {
        if (!tile.animal) out.push({ row, col })
      }
    }
  }
  return out
}

function openGateDeployModal(item, type) {
  gateDeployType.value = type
  gateDeployItem.value = item
  showGateDeployModal.value = true
  const destTiles = getAvailableDeployTiles(type)
  if (destTiles.length) {
    gateDeployRow.value = destTiles[0].row + 1
    gateDeployCol.value = destTiles[0].col + 1
  }
}

// ------------------------------------------
// SHARED REQUIREMENTS MODAL LOGIC
// ------------------------------------------
const showRequirementsModal = ref(false)
const requirementsModalTitle = ref('')
const requirementsModalDescription = ref('')
const requirementsModalList = ref([])

function showRequirements(type, itemName, missingList) {
  showRequirementsModal.value = true
  requirementsModalTitle.value = `Can't ${type} ${itemName}`
  requirementsModalDescription.value = `You need the following modules:`
  requirementsModalList.value = missingList
}
function closeRequirementsModal() {
  showRequirementsModal.value = false
  requirementsModalTitle.value = ''
  requirementsModalDescription.value = ''
  requirementsModalList.value = []
}

// ------------------------------------------
// DEPLOY FROM GATE (enforces requirements)
// ------------------------------------------
function confirmGateDeploy() {
  const row = Number(gateDeployRow.value) - 1
  const col = Number(gateDeployCol.value) - 1
  const destTile = tiles[row][col]
  if (gateDeployType.value === 'plant') {
    // Find a suitable not-yet-deployed assembly for sowing
    const assembly = findPlantingAssembly(gateDeployItem.value.plantingType)
    if (!assembly) {
      // Show requirements modal
      const missing = getMissingModules(
          { modules: [] },
          // We need the requirements for the planting type ('Seed' or 'Seedling')
          // That comes from your rules file
          // For this helper, canSowPlant(assembly, plantingType) means plantingRequirements[plantingType]
          // We'll have to replicate that logic here
          // So in utils.js you must export plantingRequirements or provide a getRequirementsForPlantingType helper
          // For now, just do it in the helper
          // Fallback, display a generic missing list
          ['transport', 'arm', gateDeployItem.value.plantingType === 'Seed' ? 'seeder' : 'cart', 'gripper']
      )
      showRequirements('plant', gateDeployItem.value.type, missing)
      showGateDeployModal.value = false
      return
    }
    // Deploy plant to field and auto-deploy the assembly
    destTile.plant = { ...gateDeployItem.value }
    destTile.assemblies = destTile.assemblies || []
    destTile.assemblies.push(assembly)
    assembly.deployed = true
    // Remove from gate
    const idx = gate.plants.findIndex(p => p === gateDeployItem.value)
    if (idx !== -1) gate.plants.splice(idx, 1)
    showGateDeployModal.value = false
  } else if (gateDeployType.value === 'animal') {
    // Find a suitable not-yet-deployed assembly for moving an animal
    const assembly = findAnimalMoverAssembly()
    if (!assembly) {
      const missing = getMissingModules({ modules: [] }, [
        { type: 'transport' },
        { type: 'arm' },
        { type: 'cart' },
        { type: 'alarm', subtype: 'electric' }
      ])
      showRequirements('move', gateDeployItem.value.type, missing)
      showGateDeployModal.value = false
      return
    }
    // Move animal to field and auto-deploy the assembly
    destTile.animal = { ...gateDeployItem.value }
    destTile.assemblies = destTile.assemblies || []
    destTile.assemblies.push(assembly)
    assembly.deployed = true
    // Remove from gate
    const idx = gate.animals.findIndex(a => a === gateDeployItem.value)
    if (idx !== -1) gate.animals.splice(idx, 1)
    showGateDeployModal.value = false
  }
  // Reset
  gateDeployType.value = null
  gateDeployItem.value = null
}

function closeGateDeployModal() {
  showGateDeployModal.value = false
  gateDeployType.value = null
  gateDeployItem.value = null
}

// ------------------------------------------
// TILE SELECTION MODAL AND INTERACTIONS
// ------------------------------------------
const selectedTile = ref(null)

function closeModal() {
  selectedTile.value = null
}

function recallAssembly(tile, assemblyId) {
  tile.assemblies = tile.assemblies || []
  const idx = tile.assemblies.findIndex(a => a.id === assemblyId)
  if (idx !== -1) {
    const assembly = tile.assemblies[idx]
    assembly.deployed = false
    tile.assemblies.splice(idx, 1)
  }
  closeModal()
}

// ------------------------------------------
// COLLAR (RESTRICTION) LOGIC
// ------------------------------------------
const showNoCollarAssemblyModal = ref(false)
const collarRestrictionMode = ref(false)
const restrictedTiles = ref([])
const collarAssemblyAssigned = ref(null)
const collarRestrictionAnimal = ref(null)

function getAvailableCollarAssembly() {
  return availableAssemblies.value.find(a => assemblyIsCollar(a))
}

function startCollarRestriction(animal) {
  if (animal.collar && animal.collar.assemblyId) {
    collarRestrictionMode.value = true
    restrictedTiles.value = animal.collar.restrictedTiles?.map(t => ({ ...t })) || []
    collarAssemblyAssigned.value = modules.activeAssemblies.find(a => a.id === animal.collar.assemblyId)
    collarRestrictionAnimal.value = animal
    return
  }
  const assembly = getAvailableCollarAssembly()
  if (!assembly) {
    showNoCollarAssemblyModal.value = true
    return
  }
  collarRestrictionMode.value = true
  restrictedTiles.value = []
  collarAssemblyAssigned.value = assembly
  collarRestrictionAnimal.value = animal
}

function toggleTileRestriction(row, col) {
  const idx = restrictedTiles.value.findIndex(t => t.row === row && t.col === col)
  if (idx >= 0) {
    restrictedTiles.value.splice(idx, 1)
  } else if (restrictedTiles.value.length < 3) {
    restrictedTiles.value.push({ row, col })
  }
}

function saveTileRestrictions() {
  const animal = collarRestrictionAnimal.value
  const assembly = collarAssemblyAssigned.value
  if (!animal) return

  if (!animal.collar || !animal.collar.assemblyId) {
    animal.collar = {
      restrictedTiles: restrictedTiles.value.map(t => ({ ...t })),
      assemblyId: assembly.id
    }
    assembly.deployed = true
    // Place the assembly on the animal's current tile
    const tile = findTileWithAnimal(animal)
    if (tile) {
      tile.assemblies = tile.assemblies || []
      tile.assemblies.push(assembly)
    }
  } else {
    animal.collar.restrictedTiles = restrictedTiles.value.map(t => ({ ...t }))
  }
  collarRestrictionMode.value = false
  collarAssemblyAssigned.value = null
  collarRestrictionAnimal.value = null
  restrictedTiles.value = []
}
function findTileWithAnimal(animal) {
  for (let row of tiles) {
    for (let tile of row) {
      if (tile.animal && tile.animal === animal) return tile
    }
  }
  return null
}
function cancelCollarRestriction() {
  collarRestrictionMode.value = false
  collarAssemblyAssigned.value = null
  collarRestrictionAnimal.value = null
  restrictedTiles.value = []
}
function returnCollarAssembly(animal) {
  if (!animal.collar || !animal.collar.assemblyId) return
  const tile = findTileWithAnimal(animal)
  if (tile && tile.assemblies) {
    const idx = tile.assemblies.findIndex(a => a.id === animal.collar.assemblyId)
    if (idx !== -1) tile.assemblies.splice(idx, 1)
  }
  const idxActive = modules.activeAssemblies.findIndex(a => a.id === animal.collar.assemblyId)
  if (idxActive !== -1) modules.activeAssemblies[idxActive].deployed = false
  animal.collar = null
}

// ------------------------------------------
// HARVEST, PLANT, AND MOVE LOGIC
// ------------------------------------------
const showMissingModal = ref(false)
const missingModules = ref([])
const missingProductType = ref('')
const lastHarvestAssemblyId = ref(null)

function getAnimalProduct(animal) {
  if (!animal) return null
  return animals.products.find(p => p.key === animal.product)
}

// Harvest plant
function openHarvestPlantModal(tile) {
  const suitable = (tile.assemblies || []).filter(a => canHarvestPlant(tile, a.id))
  if (suitable.length === 1) {
    harvestPlant(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) {
    const reqs = tile.plant ? getMissingModules({ modules: (tile.assemblies || []).flatMap(a => a.modules) }, [tile.plant.type]) : []
    showRequirements('harvest', tile.plant?.type || '', reqs)
    return
  }
  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'plant'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestPlant(tile, id)
}
function harvestPlant(tile, assemblyId) {
  const productType = tile.plant?.type
  const reqs = [] // Not needed, checked above
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestPlant(tile, assemblyId)) {
    showRequirements('harvest', productType, getMissingModules(assembly, reqs))
    return
  }
  if (assembly.actions <= 0) {
    showRequirements('harvest', productType, ['No actions left in this assembly'])
    return
  }
  const existing = market.harvestedProducts.find(p => p.type === productType)
  if (existing) {
    existing.qty += tile.plant.yield
  } else {
    market.harvestedProducts.push({
      ...tile.plant,
      qty: tile.plant.yield
    })
  }
  assembly.actions--
  tile.plant = null
  closeModal()
}

// Harvest animal product
function openHarvestAnimalProductModal(tile) {
  const key = getAnimalProduct(tile.animal)?.key
  const suitable = (tile.assemblies || []).filter(a => canHarvestAnimalProduct(tile, a.id, getAnimalProduct(tile.animal), day.value))
  if (suitable.length === 1) {
    harvestAnimalProduct(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) {
    const reqs = getAnimalProduct(tile.animal)
        ? getMissingModules({ modules: (tile.assemblies || []).flatMap(a => a.modules) }, [getAnimalProduct(tile.animal).key])
        : []
    showRequirements('harvest', getAnimalProduct(tile.animal)?.label || key || '', reqs)
    return
  }
  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'animalProduct'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestAnimalProduct(tile, id)
}
function harvestAnimalProduct(tile, assemblyId) {
  const product = getAnimalProduct(tile.animal)
  const reqs = [] // Already checked
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestAnimalProduct(tile, assemblyId, product, day.value)) {
    showRequirements('harvest', product?.label || product?.key, getMissingModules(assembly, reqs))
    return
  }
  if (assembly.actions <= 0) {
    showRequirements('harvest', product?.label || product?.key, ['No actions left in this assembly'])
    return
  }
  let existing = market.harvestedProducts.find(p => p.type === product.key)
  if (existing) {
    existing.qty += 1
  } else {
    market.harvestedProducts.push({
      ...product,
      qty: 1
    })
  }
  let freq = tile.animal.outputFrequency
  if (typeof freq === 'undefined') {
    const animalType = animals.animalTypes.find(a => a.type === tile.animal.type)
    freq = animalType?.outputFrequency || 1
  }
  assembly.actions--
  tile.animal.nextHarvest = day.value + freq
  closeModal()
}

// Harvest animal (butchering)
function openHarvestAnimalModal(tile) {
  const suitable = (tile.assemblies || []).filter(a => canHarvestAnimal(tile, a.id))
  if (suitable.length === 1) {
    harvestAnimal(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) {
    const reqs = getMissingModules({ modules: (tile.assemblies || []).flatMap(a => a.modules) }, [tile.animal?.type])
    showRequirements('harvest', tile.animal?.type || '', reqs)
    return
  }
  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'animal'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestAnimal(tile, id)
}
function harvestAnimal(tile, assemblyId) {
  const animalType = tile.animal.type
  const reqs = []
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestAnimal(tile, assemblyId)) {
    showRequirements('harvest', animalType, getMissingModules(assembly, reqs))
    return
  }
  if (assembly.actions <= 0) {
    showRequirements('harvest', animalType, ['No actions left in this assembly'])
    return
  }
  let existing = market.harvestedProducts.find(p => p.type === animalType)
  if (existing) {
    existing.qty += 1
  } else {
    market.harvestedProducts.push({
      ...tile.animal,
      qty: 1
    })
  }
  assembly.actions--
  tile.animal = null
  closeModal()
}

// ------------------------------------------
// MOVE ANIMAL LOGIC
// ------------------------------------------
const showMoveAnimalModal = ref(false)
const animalToMove = ref(null)
const originTile = ref(null)
const moveDestRow = ref(null)
const moveDestCol = ref(null)
const showMoverSelectionModal = ref(false)
const moverAssemblies = ref([])
const selectedMoverId = ref(null)

function openMoveAnimalModal(tile) {
  animalToMove.value = tile.animal
  originTile.value = tile
  moverAssemblies.value = (tile.assemblies || []).filter(
      a => a.deployed && canMoveAnimal(a)
  )
  if (moverAssemblies.value.length === 0) {
    showRequirements('move', animalToMove.value?.type, ['No suitable assembly with a Robotic Arm'])
    return
  }
  if (moverAssemblies.value.length === 1) {
    selectedMoverId.value = moverAssemblies.value[0].id
    showMoveAnimalModal.value = true
  } else {
    selectedMoverId.value = null
    showMoverSelectionModal.value = true
  }
  const animalTiles = validAnimalDestTiles(animalToMove.value, tiles)
  if (animalTiles.length) {
    moveDestRow.value = animalTiles[0].row + 1
    moveDestCol.value = animalTiles[0].col + 1
  }
}

function confirmMoverSelection() {
  if (!selectedMoverId.value) return
  showMoverSelectionModal.value = false
  showMoveAnimalModal.value = true
}

function closeMoveAnimalModal() {
  showMoveAnimalModal.value = false
  animalToMove.value = null
  originTile.value = null
  moveDestRow.value = null
  moveDestCol.value = null
}

function confirmMoveAnimal() {
  const row = Number(moveDestRow.value) - 1
  const col = Number(moveDestCol.value) - 1
  const destTile = tiles[row][col]
  if (destTile.animal) {
    showRequirements('move', animalToMove.value?.type, ['Destination tile already has an animal.'])
    return
  }
  destTile.animal = { ...animalToMove.value }
  destTile.assemblies = destTile.assemblies || []

  // Move collar assembly, if any
  if (animalToMove.value.collar && animalToMove.value.collar.assemblyId) {
    const idx = originTile.value.assemblies.findIndex(
        a => a.id === animalToMove.value.collar.assemblyId
    )
    if (idx !== -1) {
      const [collarAsm] = originTile.value.assemblies.splice(idx, 1)
      destTile.assemblies.push(collarAsm)
    }
  }

  // Move the selected mover assembly
  if (selectedMoverId.value) {
    const idx = originTile.value.assemblies.findIndex(
        a => a.id === selectedMoverId.value
    )
    if (idx !== -1) {
      const [movingAsm] = originTile.value.assemblies.splice(idx, 1)
      destTile.assemblies.push(movingAsm)
    }
  }

  originTile.value.animal = null
  showMoveAnimalModal.value = false
  animalToMove.value = null
  originTile.value = null
  moveDestRow.value = null
  moveDestCol.value = null
  selectedMoverId.value = null
}

// ------------------------------------------
// ASSEMBLY SELECTION MODAL (for multi-assembly situations)
// ------------------------------------------
const showAssemblySelectModal = ref(false)
const assemblySelectPurpose = ref(null) // 'plant', 'animalProduct', 'animal'
const assemblySelectTile = ref(null)
const assemblySelectAssemblies = ref([])
const assemblySelectCallback = ref(null)

function handleAssemblySelect(id) {
  if (assemblySelectCallback.value) {
    assemblySelectCallback.value(id)
  }
  showAssemblySelectModal.value = false
  assemblySelectPurpose.value = null
  assemblySelectTile.value = null
  assemblySelectAssemblies.value = []
  assemblySelectCallback.value = null
}
function closeAssemblySelectModal() {
  showAssemblySelectModal.value = false
  assemblySelectPurpose.value = null
  assemblySelectTile.value = null
  assemblySelectAssemblies.value = []
  assemblySelectCallback.value = null
}

</script>


<template>
  <div class="farm-wrapper">
    <!-- Farm Gate Bar -->
    <div class="gate-bar">
      <span class="gate-label">Farm Gate:</span>
      <span
          v-for="(a, i) in gate.animals"
          :key="'a-'+i"
          class="gate-icon"
          @click="openGateDeployModal(a, 'animal')"
          :title="`Click to deploy ${a.type}`"
      >{{ a.icon }}</span>
      <span
          v-for="(p, i) in gate.plants"
          :key="'p-'+i"
          class="gate-icon"
          @click="openGateDeployModal(p, 'plant')"
          :title="`Click to plant ${p.type}`"
      >{{ p.icon }}</span>
      <span v-if="!gate.animals.length && !gate.plants.length" style="color:#bbb; margin-left:1em;">(empty)</span>
    </div>

    <!-- Gate Deploy Modal -->
    <div v-if="showGateDeployModal" class="tile-modal-backdrop" @click.self="closeGateDeployModal">
      <div class="tile-modal">
        <h4>
          {{ gateDeployType === 'plant'
            ? `Plant ${gateDeployItem.type} (${gateDeployItem.plantingType})`
            : `Deploy ${gateDeployItem.type}` }}
        </h4>
        <div>
          <label>
            Destination:
            <select v-model="gateDeployRow">
              <option
                  v-for="tile in getAvailableDeployTiles(gateDeployType)"
                  :key="tile.row + '-' + tile.col"
                  :value="tile.row + 1"
              >Row {{ tile.row + 1 }}</option>
            </select>
            <select v-model="gateDeployCol">
              <option
                  v-for="tile in getAvailableDeployTiles(gateDeployType)"
                  :key="tile.row + '-' + tile.col"
                  :value="tile.col + 1"
              >Col {{ tile.col + 1 }}</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button @click="confirmGateDeploy">Confirm</button>
          <button @click="closeGateDeployModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Shared Requirements Modal (for any error or requirements issue) -->
    <div v-if="showRequirementsModal" class="tile-modal-backdrop" @click.self="closeRequirementsModal">
      <div class="tile-modal">
        <h4>{{ requirementsModalTitle }}</h4>
        <div v-if="requirementsModalDescription" style="margin-bottom:1em;">
          {{ requirementsModalDescription }}
        </div>
        <ul>
          <li v-for="req in requirementsModalList" :key="req">{{ req }}</li>
        </ul>
        <div class="modal-actions">
          <button @click="closeRequirementsModal">OK</button>
        </div>
      </div>
    </div>

    <!-- Field Grid -->
    <div class="fieldsGrid" v-bind="$attrs">
      <div
          v-for="tile in flatTiles"
          :key="`${tile.row},${tile.col}`"
          class="fieldTile"
          :class="{ active: selectedTile && selectedTile.row === tile.row && selectedTile.col === tile.col }"
          @click="selectedTile = tile"
          :title="[
          `Row: ${tile.row+1}, Col: ${tile.col+1}`,
          `Soil Health: ${tile.soil.health}`,
          `Water: ${tile.soil.water}`,
          `Fertility: ${tile.soil.fertility}`
        ].join('\n')"
      >
        <div class="tileContents">
          <span v-if="tile.plant" class="tilePlant">{{ tile.plant.icon }}</span>
          <span v-if="tile.animal" class="tileAnimal">{{ tile.animal.icon }}</span>
          <span
              v-for="a in tile.assemblies"
              :key="a.id"
              class="tileAssembly"
          >{{ a.icon || '🤖' }}</span>
        </div>
        <div class="tileStats">
          <span class="stat health" :style="{color: tile.soil.health < 60 ? '#d32f2f' : '#388e3c'}">
            ♥{{ tile.soil.health }}
          </span>
          <span class="stat water">💧{{ tile.soil.water }}</span>
          <span class="stat fertility">🌱{{ tile.soil.fertility }}</span>
        </div>
      </div>
    </div>

    <!-- Tile details modal -->
    <div v-if="selectedTile" class="tile-modal-backdrop" @click.self="closeModal">
      <div class="tile-modal">
        <h3>
          Tile ({{ selectedTile.row + 1 }}, {{ selectedTile.col + 1 }})
        </h3>
        <div>
          <strong>Soil:</strong>
          ♥{{ selectedTile.soil.health }} |
          💧{{ selectedTile.soil.water }} |
          🌱{{ selectedTile.soil.fertility }}
        </div>

        <!-- Plant Section -->
        <div v-if="selectedTile.plant" style="margin-top: 0.7em;">
          <strong>Plant:</strong>
          <span class="tilePlant">{{ selectedTile.plant.icon }}</span>
          {{ selectedTile.plant.type }} ({{ selectedTile.plant.growthStage }})
          <button
              class="harvest-btn"
              :disabled="!(
              (selectedTile.plant.growthStage === 'Mature' || selectedTile.plant.growthStage === 'Overripe') &&
              selectedTile.assemblies.some(a =>
                canHarvestPlant(selectedTile, a.id) && a.actions > 0
              )
            )"
              @click="openHarvestPlantModal(selectedTile)"
          >
            Harvest
          </button>
          <span
              v-if="selectedTile.assemblies.length > 0 &&
              !selectedTile.assemblies.some(a =>
                canHarvestPlant(selectedTile, a.id) && a.actions > 0
              )"
              class="harvest-msg"
          >(No actions left in suitable assemblies)</span>
          <span v-if="selectedTile.assemblies.length === 0" class="harvest-msg">(No assemblies deployed)</span>
          <span
              v-else-if="!selectedTile.assemblies.some(a => canHarvestPlant(selectedTile, a.id))"
              class="harvest-msg"
          >
            (Missing required modules)
          </span>
          <span
              v-if="selectedTile.plant.growthStage !== 'Mature' && selectedTile.plant.growthStage !== 'Overripe'"
              class="harvest-msg"
          >(Not ready for harvest)</span>
        </div>
        <div v-else style="margin-top: 0.7em;">
          <strong>No plant</strong>
        </div>

        <!-- Animal Section -->
        <div v-if="selectedTile.animal" style="margin-top: 0.7em;">
          <strong>Animal:</strong>
          <span class="tileAnimal">{{ selectedTile.animal.icon }}</span>
          {{ selectedTile.animal.type }} (Mood: {{ selectedTile.animal.mood ?? '-' }})
          <span v-if="selectedTile.animal.collar" style="font-size:0.97em;">
            — <em>Collar: Restricted to {{ selectedTile.animal.collar.restrictedTiles.length }} tiles</em>
          </span>
          <!-- Collar restriction picker -->
          <div v-if="collarRestrictionMode">
            <div>
              Click up to 3 tiles to restrict where the animal can be.
              <br>
              <span v-if="restrictedTiles.length">Selected:
                <span v-for="t in restrictedTiles" :key="t.row+'-'+t.col">
                  [{{ t.row + 1 }},{{ t.col + 1 }}]
                </span>
              </span>
            </div>
            <div class="fieldsGrid" style="margin: 0.6em 0;">
              <div
                  v-for="tile in flatTiles"
                  :key="`${tile.row},${tile.col}`"
                  class="fieldTile"
                  :class="{
                  restricted: restrictedTiles.some(t => t.row === tile.row && t.col === tile.col)
                }"
                  @click="toggleTileRestriction(tile.row, tile.col)"
                  style="cursor: pointer;"
              >
                <div class="tileContents">
                  <span v-if="tile.plant" class="tilePlant">{{ tile.plant.icon }}</span>
                  <span v-if="tile.animal" class="tileAnimal">{{ tile.animal.icon }}</span>
                  <span v-for="a in tile.assemblies" :key="a.id" class="tileAssembly">{{ a.icon || '🤖' }}</span>
                </div>
                <div class="tileStats">
                  <span class="stat health" :style="{color: tile.soil.health < 60 ? '#d32f2f' : '#388e3c'}">
                    ♥{{ tile.soil.health }}
                  </span>
                  <span class="stat water">💧{{ tile.soil.water }}</span>
                  <span class="stat fertility">🌱{{ tile.soil.fertility }}</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 1em;">
              <button
                  :disabled="restrictedTiles.length === 0"
                  @click="saveTileRestrictions"
              >Save Restriction</button>
              <button @click="cancelCollarRestriction" style="margin-left: 1em;">Cancel</button>
            </div>
            <div v-if="showNoCollarAssemblyModal" class="tile-modal-backdrop"
                 @click.self="showNoCollarAssemblyModal = false">
              <div class="tile-modal">
                <h4>No Collar Assembly Available</h4>
                <div>
                  You don't have any available collar assemblies. Would you like to go to the Assembly Area to build one?
                </div>
                <div class="modal-actions">
                  <button @click="() => { showNoCollarAssemblyModal = false; eventBus.emit('nav', 'assembly') }">Go to Assembly Area</button>
                  <button @click="() => showNoCollarAssemblyModal = false">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Only show animal actions if not in restriction picker -->
          <div v-else>
            <!-- Move Animal row -->
            <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.6em;">
              <button
                  class="move-animal-btn"
                  :disabled="!selectedTile.assemblies.some(a => a.deployed && canMoveAnimal(a))"
                  @click="selectedTile.assemblies.some(a => a.deployed && canMoveAnimal(a)) ? openMoveAnimalModal(selectedTile) : null"
              >Move Animal</button>
              <span v-if="!selectedTile.assemblies.some(a => a.deployed && canMoveAnimal(a))" class="move-animal-msg">
                Requires a deployed assembly with a Robotic Arm in this tile
              </span>
              <button
                  class="collar-restrict-btn"
                  v-if="!selectedTile.animal.collar"
                  @click="startCollarRestriction(selectedTile.animal)"
                  style="margin-left: 0.7em;"
              >Set Collar Restriction</button>
              <button
                  class="collar-restrict-btn"
                  v-else
                  @click="returnCollarAssembly(selectedTile.animal)"
                  style="margin-left: 0.7em; background: #e0e0e0; color: #333;"
              >Return Collar Assembly</button>
            </div>

            <!-- Animal Product Harvest Button -->
            <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.6em;">
              <div v-if="getAnimalProduct(selectedTile.animal)">
                <button
                    class="animal-product-btn"
                    :disabled="!selectedTile.assemblies.some(a =>
                    canHarvestAnimalProduct(selectedTile, a.id, getAnimalProduct(selectedTile.animal), day) &&
                    a.actions > 0
                  ) ||
                  (selectedTile.animal && selectedTile.animal.nextHarvest > gameState.day)"
                    @click="openHarvestAnimalProductModal(selectedTile)"
                >
                  Harvest {{ getAnimalProduct(selectedTile.animal)?.label || selectedTile.animal.product }}
                  <span>{{ getAnimalProduct(selectedTile.animal)?.icon || '' }}</span>
                </button>
                <span
                    v-if="selectedTile.assemblies.length > 0 &&
                    !selectedTile.assemblies.some(a =>
                      canHarvestAnimalProduct(selectedTile, a.id, getAnimalProduct(selectedTile.animal), day) &&
                      a.actions > 0
                    )"
                    class="harvest-msg"
                >(No actions left in suitable assemblies)</span>
                <span v-if="selectedTile.assemblies.length === 0" class="harvest-msg">(No assemblies deployed)</span>
                <span
                    v-else-if="!selectedTile.assemblies.some(a => canHarvestAnimalProduct(selectedTile, a.id, getAnimalProduct(selectedTile.animal), day))"
                    class="harvest-msg"
                >(Missing required modules)</span>
              </div>
            </div>

            <!-- Harvest Animal Button -->
            <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.2em;">
              <button
                  class="animal-harvest-btn"
                  :disabled="!selectedTile.assemblies.some(a =>
                  canHarvestAnimal(selectedTile, a.id) && a.actions > 0
                )"
                  @click="openHarvestAnimalModal(selectedTile)"
              >
                Harvest Animal
              </button>
              <span
                  v-if="selectedTile.assemblies.length > 0 &&
                  !selectedTile.assemblies.some(a =>
                    canHarvestAnimal(selectedTile, a.id) && a.actions > 0
                  )"
                  class="harvest-msg"
              >(No actions left in suitable assemblies)</span>
              <span v-if="selectedTile.assemblies.length === 0" class="harvest-msg">(No assemblies deployed)</span>
              <span
                  v-else-if="!selectedTile.assemblies.some(a => canHarvestAnimal(selectedTile, a.id))"
                  class="harvest-msg"
              >(Missing required modules)</span>
              <div
                  v-if="selectedTile.animal && getAnimalProduct(selectedTile.animal) && selectedTile.animal.nextHarvest > gameState.day"
                  class="harvest-msg"
              >
                Next {{ getAnimalProduct(selectedTile.animal)?.label || selectedTile.animal.product }} ready in
                {{ selectedTile.animal.nextHarvest - gameState.day }} day(s)
              </div>
            </div>
          </div>
        </div>
        <div v-else style="margin-top: 0.7em;">
          <strong>No animal</strong>
        </div>

        <!-- Assemblies Section -->
        <div v-if="selectedTile.assemblies && selectedTile.assemblies.length">
          <strong>Assemblies:</strong>
          <div v-for="a in selectedTile.assemblies" :key="a.id" class="assembly-block">
            <span class="tileAssembly">{{ a.icon || '🤖' }}</span>
            <span>{{ a.name || 'Assembly' }}</span>
            Modules:
            <span v-for="mod in a.modules" :key="mod.name">{{ mod.name }}</span>
            <button @click="recallAssembly(selectedTile, a.id)">Recall</button>
          </div>
        </div>
        <div v-else style="margin-top: 0.7em;">
          <strong>No assemblies</strong>
        </div>
        <button @click="closeModal" class="close-btn">Close</button>
      </div>
    </div>

    <!-- Assembly Selection Modal for Move/Harvest -->
    <div v-if="showAssemblySelectModal" class="tile-modal-backdrop" @click.self="closeAssemblySelectModal">
      <div class="tile-modal">
        <h4>
          Choose Assembly to
          <span v-if="assemblySelectPurpose === 'plant'">Harvest Plant</span>
          <span v-else-if="assemblySelectPurpose === 'animalProduct'">Harvest Animal Product</span>
          <span v-else-if="assemblySelectPurpose === 'animal'">Harvest Animal</span>
        </h4>
        <ul>
          <li v-for="a in assemblySelectAssemblies" :key="a.id">
            <button @click="a.actions > 0 ? handleAssemblySelect(a.id) : null" :disabled="a.actions <= 0">
              {{ a.name || 'Assembly' }}
              <span v-if="a.modules.length">— Modules: {{ a.modules.map(m => m.name).join(', ') }}</span>
              <span v-if="a.actions <= 0" style="color:#c62828; margin-left:1em;">(No actions left)</span>
            </button>
          </li>
        </ul>
        <button class="close-btn" @click="closeAssemblySelectModal">Cancel</button>
      </div>
    </div>

    <!-- Move Animal Modal -->
    <div v-if="showMoveAnimalModal" class="tile-modal-backdrop" @click.self="closeMoveAnimalModal">
      <div class="tile-modal">
        <h4>Move Animal ({{ animalToMove.type }})</h4>
        <label>
          Destination:
          <select v-model="moveDestRow">
            <option
                v-for="tile in validAnimalDestTiles(animalToMove, tiles)"
                :key="tile.row + '-' + tile.col"
                :value="tile.row + 1"
            >Row {{ tile.row + 1 }}</option>
          </select>
          <select v-model="moveDestCol">
            <option
                v-for="tile in validAnimalDestTiles(animalToMove, tiles)"
                :key="tile.row + '-' + tile.col"
                :value="tile.col + 1"
            >Col {{ tile.col + 1 }}</option>
          </select>
        </label>
        <div class="modal-actions">
          <button @click="confirmMoveAnimal">Move</button>
          <button @click="closeMoveAnimalModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.farm-wrapper{
  display: flex;
  flex-direction: column;
  position: relative;
}
.gate-bar {
  display: flex;
  align-items: center;
  padding: 0.3em 1em;
  background: #c8e6c9;
  font-size: 1.22em;
  gap: 0.6em;
  flex-shrink:0;
  border-bottom: 1px solid #1b5e20;
flex-direction: row;
  min-height: 2.2em;
  max-height: 2.4em;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  line-height: 2.4em;
}
.gate-label {
  font-weight: bold;
  color: black;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.gate-icon {
  font-size: 1.4em;
  cursor: pointer;
  margin-right: 0.25em;
  transition: filter 0.15s;
}
.gate-icon:hover {
  filter: brightness(0.8);
}
.fieldsGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 8px;
  width: 90%;
  height: 90%;
  background: #c8e6c9;
  padding: 2.5% 5%;
  justify-self:right ;

}

.fieldTile {
  background: #fff;
  border-radius: 7px;
  border: 2px solid #aed581;
  min-width: 50px;
  min-height: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.05em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 #0000;
}

.tileContents {
  display: flex;
  gap: 0.1em;
}

.tilePlant, .tileAnimal, .tileAssembly {
  font-size: 1.3em;
}

.tileStats {
  display: flex;
  gap: 0.3em;
  margin-top: 1px;
  font-size: 0.85em;
  opacity: 0.82;
}

.stat.health {
  font-weight: bold;
}

.tile-modal-backdrop {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-modal {
  background: #fff;
  border-radius: 13px;
  box-shadow: 0 4px 32px #0003;
  padding: 2.1em 2.4em;
  min-width: 290px;
  max-width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  font-size: 1.11em;
  line-height: 1.45;
  position: relative;
}

.assembly-block {
  background: #fafafa;
  margin: 0.5em 0 0.5em 0;
  padding: 0.6em 0.9em;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 0 1px 4px #0001;
  font-size: 1em;
}

.close-btn {
  margin-top: 1.4em;
  background: #b2dfdb;
  border: none;
  border-radius: 7px;
  padding: 0.5em 1.2em;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
}

.close-btn:hover {
  background: #00796b;
  color: #fff;
}

.fieldTile.active {
  box-shadow: 0 0 8px 3px #ffd60099;
  border-color: #ffd600;
}

.fieldTile.restricted {
  box-shadow: 0 0 0 3px #00bcd4, 0 0 8px 3px #ffd60099;
  border-color: #00bcd4;
}

.collar-restrict-btn {
  background: #ffd600;
  color: #333;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.99em;
  padding: 0.45em 1.4em;
  cursor: pointer;
}

.collar-restrict-btn:hover {
  background: #ffb300;
}

.move-animal-row {
  display: flex;
  align-items: center;
  gap: 0.7em;
  margin-top: 0.6em;
}

.move-animal-btn.disabled,
.move-animal-btn:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}

.move-animal-btn {
  background: #b2dfdb;
  border: none;
  border-radius: 7px;
  padding: 0.4em 1em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0;
  margin-top: 0.3em;
}

.move-animal-btn:not(.disabled):hover {
  background: #00bcd4;
  color: #fff;
}

.move-animal-msg {
  color: #c62828;
  font-size: 0.97em;
  font-style: italic;
}

.harvest-msg {
  margin-left: 0.7em;
  color: #c62828;
  font-size: 0.96em;
  font-style: italic;
}

.harvest-btn {
  margin-left: 0.7em;
  background: #ffd600;
  color: #333;
  font-weight: bold;
  border: none;
  border-radius: 7px;
  padding: 0.2em 0.9em;
  cursor: pointer;
  font-size: 0.95em;
}

.harvest-btn:hover {
  background: #ffb300;
}

.harvest-btn:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}


</style>
