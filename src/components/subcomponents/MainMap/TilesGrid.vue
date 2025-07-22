<script setup>
import {ref, computed} from 'vue'
import {tilesStore} from '/stores/tilesStore.js'
import {modulesStore} from '/stores/modulesStore.js'
import {marketStore} from '/stores/marketStore.js'
import {animalsStore} from '/stores/animalsStore.js'
import {gameStateStore} from "../../../../stores/gameStateStore.js";
import eventBus from "@/eventBus.js"

const tilesStoreInstance = tilesStore()
const gameState = gameStateStore()
const day = gameState.day;
const tiles = tilesStoreInstance.tiles
const harvestRequirements = tilesStoreInstance.harvestRequirements;
const flatTiles = computed(() => tiles.flat())
const selectedTile = ref(null)
const modules = modulesStore()
const market = marketStore()
const animals = animalsStore()

// Collar assembly requirements (by module name)
const requiredCollarModules = [
  "Animal Collar",
  "Battery Pack",
  "Audio Alarm",
  "Mild Shocker",
  "GPS Module"
]
const showNoCollarAssemblyModal = ref(false)

// --- Collar restriction selection modal logic ---
const collarRestrictionMode = ref(false)
const restrictedTiles = ref([])
const collarAssemblyAssigned = ref(null) // The assembly we're using for this collar (if any)
const collarRestrictionAnimal = ref(null) // The animal being restricted (if any)

function getAvailableCollarAssembly() {
  return (modules.activeAssemblies ?? []).find(a => {
    if (a.deployed) return false
    const moduleNames = (a.modules || []).map(m => m.name)
    return requiredCollarModules.every(req => moduleNames.includes(req))
  })
}

// Start collar restriction selection mode for an animal
function startCollarRestriction(animal) {
  // If animal already has a collar, allow reprogramming with its current assembly
  if (animal.collar && animal.collar.assemblyId) {
    collarRestrictionMode.value = true
    restrictedTiles.value = animal.collar.restrictedTiles?.map(t => ({...t})) || []
    collarAssemblyAssigned.value = modules.activeAssemblies.find(a => a.id === animal.collar.assemblyId)
    collarRestrictionAnimal.value = animal
    return
  }
  // Otherwise, check for available collar assembly to assign
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
    restrictedTiles.value.push({row, col})
  }
}

// Save restrictions (assign assembly if needed, mark it as deployed, assign to animal)
function saveTileRestrictions() {
  const animal = collarRestrictionAnimal.value
  const assembly = collarAssemblyAssigned.value
  if (!animal) return

  if (!animal.collar || !animal.collar.assemblyId) {
    animal.collar = {
      restrictedTiles: restrictedTiles.value.map(t => ({...t})),
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
    animal.collar.restrictedTiles = restrictedTiles.value.map(t => ({...t}))
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

// Cancel selection/reset state
function cancelCollarRestriction() {
  collarRestrictionMode.value = false
  collarAssemblyAssigned.value = null
  collarRestrictionAnimal.value = null
  restrictedTiles.value = []
}

// Remove collar and return assembly to pool
function returnCollarAssembly(animal) {
  if (!animal.collar || !animal.collar.assemblyId) return
  // Remove from tile.assemblies
  const tile = findTileWithAnimal(animal)
  if (tile && tile.assemblies) {
    const idx = tile.assemblies.findIndex(a => a.id === animal.collar.assemblyId)
    if (idx !== -1) tile.assemblies.splice(idx, 1)
  }
  // Return to pool
  const idxActive = modules.activeAssemblies.findIndex(a => a.id === animal.collar.assemblyId)
  if (idxActive !== -1) modules.activeAssemblies[idxActive].deployed = false
  animal.collar = null
}

// --- HARVEST REQUIREMENT CHECK HELPERS ---
function assemblyMeetsRequirements(assembly, requirements) {
  if (!assembly || !assembly.modules) return false;
  return requirements.every(req =>
      assembly.modules.some(m =>
          (!req.type || m.type === req.type) &&
          (!req.subtype || m.subtype === req.subtype) &&
          (!req.name || m.name === req.name)
      )
  );
}

function getMissingModules(assembly, requirements) {
  if (!assembly || !assembly.modules) {
    return requirements.map(req => req.name || req.type || JSON.stringify(req));
  }
  return requirements
      .filter(req =>
          !assembly.modules.some(m =>
              (!req.type || m.type === req.type) &&
              (!req.subtype || m.subtype === req.subtype) &&
              (!req.name || m.name === req.name)
          )
      )
      .map(req => req.name || req.type || JSON.stringify(req));
}

// Modal to show missing modules
const showMissingModal = ref(false)
const missingModules = ref([])
const missingProductType = ref('')
const lastHarvestAssemblyId = ref(null) // which assembly to use for harvest

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


// Plant Harvest Helpers
function plantIsRipe(tile) {
  return tile.plant && (tile.plant.growthStage === 'Mature' || tile.plant.growthStage === 'Overripe')
}

function canHarvestPlant(tile, assemblyId) {
  if (!plantIsRipe(tile) || !tile.assemblies || !tile.assemblies.length) return false
  const productType = tile.plant?.type
  const reqs = harvestRequirements[productType]
  if (!reqs) return false
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  return assembly && assemblyMeetsRequirements(assembly, reqs)
}

function harvestPlant(tile, assemblyId) {
  const productType = tile.plant?.type
  const reqs = harvestRequirements[productType]
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestPlant(tile, assemblyId)) {
    missingModules.value = getMissingModules(assembly, reqs || [])
    missingProductType.value = productType
    showMissingModal.value = true
    lastHarvestAssemblyId.value = assemblyId
    return
  }
  if (assembly.actions <= 0) {
    alert('No actions left in this assembly for today.')
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


// Animal Harvest/Product helpers
function getAnimalProduct(animal) {
  if (!animal) return null
  return animals.products.find(p => p.key === animal.product)
}

function canHarvestProduct(tile, assemblyId) {
  if (!tile.animal || !tile.assemblies) return false
  const product = getAnimalProduct(tile.animal)
  if (!product) return false
  const reqs = harvestRequirements[product.key]
  if (!reqs) return false
  const today = day
  if (typeof tile.animal.nextHarvest === "undefined") tile.animal.nextHarvest = today
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  return assembly && assemblyMeetsRequirements(assembly, reqs) && today >= tile.animal.nextHarvest
}

function harvestAnimalProduct(tile, assemblyId) {
  const product = getAnimalProduct(tile.animal)
  const reqs = harvestRequirements[product?.key]
  const today = gameState.day
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestProduct(tile, assemblyId)) {
    missingModules.value = getMissingModules(assembly, reqs || [])
    missingProductType.value = product?.key
    showMissingModal.value = true
    lastHarvestAssemblyId.value = assemblyId
    return
  }
  if (assembly.actions <= 0) {
    alert('No actions left in this assembly for today.')
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
  tile.animal.nextHarvest = today + freq
}


// Harvest Animal (butchering)
function canHarvestAnimal(tile, assemblyId) {
  if (!tile.animal || !tile.assemblies) return false
  const animalType = tile.animal.type
  const reqs = harvestRequirements[animalType]
  if (!reqs) return false
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  return assembly && assemblyMeetsRequirements(assembly, reqs)
}

function harvestAnimal(tile, assemblyId) {
  const animalType = tile.animal.type
  const reqs = harvestRequirements[animalType]
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  if (!canHarvestAnimal(tile, assemblyId)) {
    missingModules.value = getMissingModules(assembly, reqs || [])
    missingProductType.value = animalType
    showMissingModal.value = true
    lastHarvestAssemblyId.value = assemblyId
    return
  }
  if (assembly.actions <= 0) {
    alert('No actions left in this assembly for today.')
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


// --- Move Animal ---
const showMoveAnimalModal = ref(false)
const animalToMove = ref(null)
const originTile = ref(null)
const moveDestRow = ref(null)
const moveDestCol = ref(null)
const showMoverSelectionModal = ref(false)
const moverAssemblies = ref([])  // Assemblies that can move the animal
const selectedMoverId = ref(null)

const validAnimalDestTiles = computed(() => {
  if (!originTile.value) return []
  const restriction = originTile.value.animal?.collar?.restrictedTiles
  if (!restriction || restriction.length === 0) {
    const out = []
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[0].length; col++) {
        if (!tiles[row][col].animal) {
          out.push({row, col})
        }
      }
    }
    return out
  }
  return restriction.filter(({row, col}) => !tiles[row][col].animal)
})

const canMoveAnimal = computed(() => {
  if (!selectedTile.value || !selectedTile.value.animal || !selectedTile.value.assemblies) return false
  return selectedTile.value.assemblies.some(a => a.deployed && a.modules.some(m => m.type === 'arm'))
})

function openMoveAnimalModal(tile) {
  animalToMove.value = tile.animal
  originTile.value = tile
  moverAssemblies.value = (tile.assemblies || []).filter(
      a => a.deployed && a.modules.some(m => m.type === 'arm')
  )
  if (moverAssemblies.value.length === 0) {
    alert("No suitable assembly with a Robotic Arm in this tile.")
    return
  }
  if (moverAssemblies.value.length === 1) {
    selectedMoverId.value = moverAssemblies.value[0].id
    showMoveAnimalModal.value = true
  } else {
    selectedMoverId.value = null
    showMoverSelectionModal.value = true
  }
  if (validAnimalDestTiles.value.length) {
    moveDestRow.value = validAnimalDestTiles.value[0].row + 1
    moveDestCol.value = validAnimalDestTiles.value[0].col + 1
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
    alert("Destination tile already has an animal.")
    return
  }
  destTile.animal = {...animalToMove.value}
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

const showAssemblySelectModal = ref(false)
const assemblySelectPurpose = ref(null) // 'plant', 'animalProduct', 'animal'
const assemblySelectTile = ref(null)
const assemblySelectAssemblies = ref([])
const assemblySelectCallback = ref(null)

function openHarvestPlantModal(tile) {
  const suitable = (tile.assemblies || []).filter(a =>
      assemblyMeetsRequirements(a, harvestRequirements[tile.plant?.type] || [])
  )
  if (suitable.length === 1) {
    harvestPlant(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) return // button will be disabled anyway

  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'plant'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestPlant(tile, id)
}

function openHarvestAnimalProductModal(tile) {
  const key = getAnimalProduct(tile.animal)?.key
  const suitable = (tile.assemblies || []).filter(a =>
      assemblyMeetsRequirements(a, harvestRequirements[key] || [])
  )
  if (suitable.length === 1) {
    harvestAnimalProduct(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) return

  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'animalProduct'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestAnimalProduct(tile, id)
}

function openHarvestAnimalModal(tile) {
  const suitable = (tile.assemblies || []).filter(a =>
      assemblyMeetsRequirements(a, harvestRequirements[tile.animal?.type] || [])
  )
  if (suitable.length === 1) {
    harvestAnimal(tile, suitable[0].id)
    return
  }
  if (suitable.length === 0) return

  showAssemblySelectModal.value = true
  assemblySelectPurpose.value = 'animal'
  assemblySelectTile.value = tile
  assemblySelectAssemblies.value = suitable
  assemblySelectCallback.value = id => harvestAnimal(tile, id)
}

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
  <div class="fieldsGrid" v-bind="$attrs" >
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
        assemblyMeetsRequirements(a, harvestRequirements[selectedTile.plant?.type] || []) &&
        a.actions > 0
      )
    )"
            @click="openHarvestPlantModal(selectedTile)"
        >
          Harvest
        </button>
        <span
            v-if="selectedTile.assemblies.length > 0 &&
         !selectedTile.assemblies.some(a =>
            assemblyMeetsRequirements(a, harvestRequirements[selectedTile.plant?.type] || []) &&
            a.actions > 0
          )"
            class="harvest-msg"
        >
  (No actions left in suitable assemblies)
</span>

        <span
            v-if="selectedTile.assemblies.length === 0"
            class="harvest-msg"
        >(No assemblies deployed)</span
        >
        <span
            v-else-if="!selectedTile.assemblies.some(a => assemblyMeetsRequirements(a, harvestRequirements[selectedTile.plant?.type] || []))"
            class="harvest-msg"
        >
      (Missing required modules:
      {{
            selectedTile.assemblies.length
                ? selectedTile.assemblies
                    .map(a =>
                        getMissingModules(a, harvestRequirements[selectedTile.plant?.type] || []).join(', ')
                    )
                    .join(' / ')
                : 'No assembly'
          }})
    </span>
        <span
            v-if="selectedTile.plant.growthStage !== 'Mature' && selectedTile.plant.growthStage !== 'Overripe'"
            class="harvest-msg"
        >(Not ready for harvest)</span
        >

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
            >Save Restriction
            </button>
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
                <button @click="() => { showNoCollarAssemblyModal = false; eventBus.emit('nav', 'assembly') }">Go to
                  Assembly Area
                </button>
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
                :disabled="!canMoveAnimal"
                @click="canMoveAnimal ? openMoveAnimalModal(selectedTile) : null"
            >Move Animal
            </button>
            <span v-if="!canMoveAnimal" class="move-animal-msg">
              Requires a deployed assembly with a Robotic Arm in this tile
            </span>
            <button
                class="collar-restrict-btn"
                v-if="!selectedTile.animal.collar"
                @click="startCollarRestriction(selectedTile.animal)"
                style="margin-left: 0.7em;"
            >Set Collar Restriction
            </button>
            <button
                class="collar-restrict-btn"
                v-else
                @click="returnCollarAssembly(selectedTile.animal)"
                style="margin-left: 0.7em; background: #e0e0e0; color: #333;"
            >Return Collar Assembly
            </button>
          </div>

          <!-- Animal Product Harvest Button -->
          <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.6em;">
            <div v-if="getAnimalProduct(selectedTile.animal)">
              <button
                  class="animal-product-btn"
                  :disabled="!selectedTile.assemblies.some(a =>
      assemblyMeetsRequirements(a, harvestRequirements[getAnimalProduct(selectedTile.animal)?.key] || []) &&
      a.actions > 0
    ) ||
    (selectedTile.animal && selectedTile.animal.nextHarvest > gameState.day)
  "
                  @click="openHarvestAnimalProductModal(selectedTile)"
              >
                Harvest {{ getAnimalProduct(selectedTile.animal)?.label || selectedTile.animal.product }}
                <span>{{ getAnimalProduct(selectedTile.animal)?.icon || '' }}</span>
              </button>
              <span
                  v-if="selectedTile.assemblies.length > 0 &&
         !selectedTile.assemblies.some(a =>
           assemblyMeetsRequirements(a, harvestRequirements[getAnimalProduct(selectedTile.animal)?.key] || []) &&
           a.actions > 0
         )"
                  class="harvest-msg"
              >
  (No actions left in suitable assemblies)
</span>


              <span v-if="selectedTile.assemblies.length === 0" class="harvest-msg">(No assemblies deployed)</span>
              <span
                  v-else-if="!selectedTile.assemblies.some(a => assemblyMeetsRequirements(a, harvestRequirements[getAnimalProduct(selectedTile.animal)?.key] || []))"
                  class="harvest-msg">
          (Missing required modules: {{
                  selectedTile.assemblies.length
                      ? selectedTile.assemblies.map(a => getMissingModules(a, harvestRequirements[getAnimalProduct(selectedTile.animal)?.key] || []).join(', ')).join(' / ')
                      : 'No assembly'
                }})
        </span>
            </div>
          </div>

          <!-- Harvest Animal Button -->
          <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.2em;">
            <button
                class="animal-harvest-btn"
                :disabled="!selectedTile.assemblies.some(a =>
    assemblyMeetsRequirements(a, harvestRequirements[selectedTile.animal?.type] || []) &&
    a.actions > 0
  )"
                @click="openHarvestAnimalModal(selectedTile)"
            >
              Harvest Animal
            </button>
            <span
                v-if="selectedTile.assemblies.length > 0 &&
         !selectedTile.assemblies.some(a =>
           assemblyMeetsRequirements(a, harvestRequirements[selectedTile.animal?.type] || []) &&
           a.actions > 0
         )"
                class="harvest-msg"
            >
  (No actions left in suitable assemblies)
</span>

            <span v-if="selectedTile.assemblies.length === 0" class="harvest-msg">(No assemblies deployed)</span>
            <span
                v-else-if="!selectedTile.assemblies.some(a => assemblyMeetsRequirements(a, harvestRequirements[selectedTile.animal?.type] || []))"
                class="harvest-msg">
        (Missing required modules: {{
                selectedTile.assemblies.length
                    ? selectedTile.assemblies.map(a => getMissingModules(a, harvestRequirements[selectedTile.animal?.type] || []).join(', ')).join(' / ')
                    : 'No assembly'
              }})
      </span>
            <div
                v-if="selectedTile.animal && getAnimalProduct(selectedTile.animal) && selectedTile.animal.nextHarvest > gameState.day"
                class="harvest-msg">
              Next {{ getAnimalProduct(selectedTile.animal)?.label || selectedTile.animal.product }} ready in
              {{ selectedTile.animal.nextHarvest - gameState.day }} day(s)
            </div>
          </div>
        </div>
      </div>
      <div v-else style="margin-top: 0.7em;">
        <strong>No animal</strong>
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

      <div v-else style="margin-top: 0.7em;">
        <strong>No assemblies</strong>
      </div>
      <button @click="closeModal" class="close-btn">Close</button>
    </div>
  </div>

  <!-- Assembly Selection Modal for Move -->
  <div v-if="showMoverSelectionModal" class="tile-modal-backdrop" @click.self="showMoverSelectionModal = false">
    <div class="tile-modal">
      <h4>Select Assembly to Move Animal</h4>
      <div>
        Choose which assembly should move the animal (must have a Robotic Arm):
      </div>
      <ul>
        <li v-for="asm in moverAssemblies" :key="asm.id">
          <label>
            <input type="radio" v-model="selectedMoverId" :value="asm.id"/>
            {{ asm.name || 'Assembly' }}
            — Modules:
            <span v-for="m in asm.modules" :key="m.name">{{ m.name }}</span>
          </label>
        </li>
      </ul>
      <div class="modal-actions">
        <button :disabled="!selectedMoverId" @click="confirmMoverSelection">OK</button>
        <button @click="() => { showMoverSelectionModal = false; selectedMoverId = null }">Cancel</button>
      </div>
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
              v-for="tile in validAnimalDestTiles"
              :key="tile.row + '-' + tile.col"
              :value="tile.row + 1"
          >Row {{ tile.row + 1 }}
          </option>
        </select>
        <select v-model="moveDestCol">
          <option
              v-for="tile in validAnimalDestTiles"
              :key="tile.row + '-' + tile.col"
              :value="tile.col + 1"
          >Col {{ tile.col + 1 }}
          </option>
        </select>
      </label>
      <div class="modal-actions">
        <button @click="confirmMoveAnimal">Move</button>
        <button @click="closeMoveAnimalModal">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Missing Modules Modal -->
  <div v-if="showMissingModal" class="tile-modal-backdrop" @click.self="() => showMissingModal.value = false">
    <div class="tile-modal">
      <h4>
        Can't harvest {{ missingProductType }}
      </h4>
      <div style="margin-bottom:1em;">
        <div>Missing modules in this assembly:</div>
        <ul>
          <li v-for="m in missingModules" :key="m">{{ m }}</li>
        </ul>
        <div style="margin-top: 0.7em;">
          Update this assembly in the Assembly Area, or deploy a new one with the correct modules.
        </div>
      </div>
      <button @click="() => showMissingModal.value = false" class="close-btn">OK</button>
    </div>
  </div>

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

</template>

<style scoped>
.fieldsGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 50px);
  gap: 8px;
  margin: 2em auto;
  width: 100%;
  background: #c8e6c9;
  padding: 1em;
  border-radius: 15px;
  box-shadow: 0 2px 10px #0001;
  float: left;
}

.fieldTile {
  background: #fff;
  border-radius: 7px;
  border: 2px solid #aed581;
  min-width: 50px;
  min-height: 50px;
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
