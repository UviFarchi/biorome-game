<script setup>
import { ref, computed } from 'vue'
import { plantsStore } from '/stores/plantsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { userStore } from '/stores/userStore.js'
import eventBus from "@/eventBus.js"

const plants = plantsStore()
const tiles = tilesStore()
const modules = modulesStore()
const user = userStore()

const showDeployModal = ref(false)
const showRequirementsModal = ref(false)
const showAssemblyChoiceModal = ref(false)
const deployingPlant = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)
const selectedPlantingType = ref('Seed') // default to Seed
const missingRequirements = ref([])
const selectedAssemblyToDeploy = ref(null)

// Helper: Check assembly for SEED
function assemblyCanPlantSeed(assembly) {
  if (!assembly) return false
  const types = (assembly.modules || []).map(m => m.type)
  const subtypes = (assembly.modules || []).map(m => m.subtype)
  return (
      types.includes('transport') &&
      types.includes('arm') &&
      subtypes.includes('seeder') &&
      subtypes.includes('borer')
  )
}
// Helper: Check assembly for SEEDLING
function assemblyCanPlantSeedling(assembly) {
  if (!assembly) return false
  const types = (assembly.modules || []).map(m => m.type)
  const subtypes = (assembly.modules || []).map(m => m.subtype)
  return (
      types.includes('transport') &&
      types.includes('arm') &&
      types.includes('cart') &&
      subtypes.includes('gripper')
  )
}

// Suitable assemblies (NOT DEPLOYED) in the pool
const availableAssembliesForPlanting = computed(() =>
    modules.activeAssemblies.filter(a => !a.deployed && (
        (selectedPlantingType.value === 'Seed' && assemblyCanPlantSeed(a)) ||
        (selectedPlantingType.value === 'Seedling' && assemblyCanPlantSeedling(a))
    ))
)

// Find tiles with suitable deployed assemblies
const availableTiles = computed(() => {
  let result = []
  for (let row = 0; row < tiles.tiles.length; row++) {
    for (let col = 0; col < tiles.tiles[0].length; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.plant && tile.assembly && tile.assembly.deployed) {
        if (
            (selectedPlantingType.value === 'Seed' && assemblyCanPlantSeed(tile.assembly)) ||
            (selectedPlantingType.value === 'Seedling' && assemblyCanPlantSeedling(tile.assembly))
        ) {
          result.push({ row, col })
        }
      }
    }
  }
  return result
})

// List missing requirements for modal
function getMissingRequirements(assembly, plantingType) {
  const reqs = []
  if (!assembly) return reqs
  const types = (assembly.modules || []).map(m => m.type)
  const subtypes = (assembly.modules || []).map(m => m.subtype)
  if (!types.includes('transport')) reqs.push('Transport module')
  if (!types.includes('arm')) reqs.push('Robotic arm')
  if (plantingType === 'Seed') {
    if (!subtypes.includes('seeder')) reqs.push('Seeder tool')
    if (!subtypes.includes('borer')) reqs.push('Hole-borer tool')
  } else if (plantingType === 'Seedling') {
    if (!types.includes('cart')) reqs.push('Cart')
    if (!subtypes.includes('gripper')) reqs.push('Gripper tool')
  }
  return reqs
}

// Handle "Deploy" button click on a plant/type
function openDeployModal(plant, plantingType) {
  deployingPlant.value = plant
  selectedPlantingType.value = plantingType

  // 1. Any suitable deployed assembly?
  let deployedMatch = false
  for (let row = 0; row < tiles.tiles.length; row++) {
    for (let col = 0; col < tiles.tiles[0].length; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.plant && tile.assembly && tile.assembly.deployed) {
        if (
            (plantingType === 'Seed' && assemblyCanPlantSeed(tile.assembly)) ||
            (plantingType === 'Seedling' && assemblyCanPlantSeedling(tile.assembly))
        ) {
          deployedMatch = true
        }
      }
    }
  }
  if (deployedMatch && availableTiles.value.length > 0) {
    selectedRow.value = availableTiles.value[0]?.row + 1
    selectedCol.value = availableTiles.value[0]?.col + 1
    showDeployModal.value = true
    return
  }

  // 2. No deployed, but suitable assembly in pool? (not deployed)
  if (availableAssembliesForPlanting.value.length > 0) {
    // If only one, just deploy it
    if (availableAssembliesForPlanting.value.length === 1) {
      deployAssemblyToTile(availableAssembliesForPlanting.value[0])
    } else {
      showAssemblyChoiceModal.value = true
    }
    return
  }

  // 3. No matching assembly at all, show requirements and Assembly Area link
  let anyInPool = modules.activeAssemblies.length > 0
  if (anyInPool) {
    missingRequirements.value = getMissingRequirements(modules.activeAssemblies[0], plantingType)
  } else {
    missingRequirements.value = [
      'Transport module',
      'Robotic arm',
      ...(plantingType === 'Seed'
          ? ['Seeder tool', 'Hole-borer tool']
          : ['Cart', 'Gripper tool'])
    ]
  }
  showRequirementsModal.value = true
}

// Actually deploy the chosen assembly to the first available tile (empty + no assembly)
function deployAssemblyToTile(assembly) {
  let placed = false
  for (let row = 0; row < tiles.tiles.length; row++) {
    for (let col = 0; col < tiles.tiles[0].length; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.plant && !tile.assembly) {
        tile.assembly = assembly
        assembly.deployed = true
        placed = true
        break
      }
    }
    if (placed) break
  }
  showAssemblyChoiceModal.value = false
  // Continue as normal, now with a suitable deployed assembly!
  openDeployModal(deployingPlant.value, selectedPlantingType.value)
}

// When user selects one from the modal
function handleSelectAssembly(assembly) {
  deployAssemblyToTile(assembly)
}

// Modal closes
function closeDeployModal() {
  showDeployModal.value = false
  deployingPlant.value = null
  selectedRow.value = null
  selectedCol.value = null
}
function closeRequirementsModal() {
  showRequirementsModal.value = false
  deployingPlant.value = null
}
function closeAssemblyChoiceModal() {
  showAssemblyChoiceModal.value = false
  deployingPlant.value = null
}

function goToAssemblyArea() {
  closeRequirementsModal()
  eventBus.emit('nav', 'assembly')
}

// Confirm planting on selected tile
function confirmDeploy() {
  if (!deployingPlant.value) return
  const row = Number(selectedRow.value) - 1
  const col = Number(selectedCol.value) - 1
  const tile = tiles.tiles[row][col]
  let suitable =
      (selectedPlantingType.value === 'Seed' && assemblyCanPlantSeed(tile.assembly)) ||
      (selectedPlantingType.value === 'Seedling' && assemblyCanPlantSeedling(tile.assembly))
  if (!tile.plant && tile.assembly && suitable) {
    const cost =
        selectedPlantingType.value === 'Seed'
            ? deployingPlant.value.seedCost
            : deployingPlant.value.seedlingCost
    if (user.gold < cost) {
      alert('Not enough gold!')
      return
    }
    tile.plant = {
      ...deployingPlant.value,
      plantingType: selectedPlantingType.value,
      growthStage: selectedPlantingType.value // "Seed" or "Seedling"
    }
    user.gold -= cost
    closeDeployModal()
  } else {
    // Should not reach here
    alert('Invalid tile selected.')
  }
}
</script>

<template>
  <div class="verticalMenuArea">
    <h3>Available Plants</h3>
    <div class="verticalMenuScroll">
      <div
          v-for="plant in plants.plantTypes"
          :key="plant.type"
          class="verticalMenuCard"
      >
        <span class="verticalMenu-icon">{{ plant.icon }}</span>
        <span class="verticalMenu-type">{{ plant.type }}</span>
        <div class="deploy-buttons">
          <button
              class="deployBtn"
              @click="openDeployModal(plant, 'Seed')"
          >
            Seed — {{ plant.seedCost }}💰
          </button>
          <button
              class="deployBtn"
              @click="openDeployModal(plant, 'Seedling')"
          >
            Seedling — {{ plant.seedlingCost }}💰
          </button>
        </div>
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay">
      <div class="modal">
        <h4>Deploy {{ deployingPlant.type }} ({{ deployingPlant.icon }})</h4>
        <div style="margin-bottom: 0.6em;">
          Planting type: <b>{{ selectedPlantingType }}</b>
        </div>
        <label>
          Tile:
          <select v-model="selectedRow">
            <option v-for="tile in availableTiles" :key="tile.row + '-' + tile.col" :value="tile.row + 1">
              Row {{ tile.row + 1 }}
            </option>
          </select>
          <select v-model="selectedCol">
            <option v-for="tile in availableTiles" :key="tile.row + '-' + tile.col" :value="tile.col + 1">
              Col {{ tile.col + 1 }}
            </option>
          </select>
        </label>
        <div class="modal-actions">
          <button @click="confirmDeploy">Confirm</button>
          <button @click="closeDeployModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Assembly Selection Modal -->
    <div v-if="showAssemblyChoiceModal" class="modal-overlay">
      <div class="modal">
        <h4>Select Assembly to Deploy for Planting</h4>
        <div
            v-for="assembly in availableAssembliesForPlanting"
            :key="assembly.id"
            class="assembly-option"
        >
          <div>
            <b>{{ assembly.name }}</b>
            <ul>
              <li v-for="mod in assembly.modules" :key="mod.name">{{ mod.name }}</li>
            </ul>
          </div>
          <button @click="handleSelectAssembly(assembly)">Deploy This</button>
        </div>
        <div class="modal-actions">
          <button @click="closeAssemblyChoiceModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Requirements Modal -->
    <div v-if="showRequirementsModal" class="modal-overlay">
      <div class="modal">
        <h4>No suitable assembly available for {{ deployingPlant?.type }} ({{ selectedPlantingType }})</h4>
        <div style="margin: 0.6em 0 1em 0;">
          <div>Required modules:</div>
          <ul>
            <li v-for="item in missingRequirements" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button @click="closeRequirementsModal">OK</button>
          <button @click="goToAssemblyArea">Go to Assembly Area</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.verticalMenuArea {
  border: 2px solid #b2dfdb;
  border-radius: 10px;
  background: #e0f7fa;
  padding: 1rem 0.5rem;
  margin: 0 0 0 1rem;
  min-width: 170px;
  max-width: 220px;
  height: 60vh;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
}
.verticalMenuScroll {
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow-y: auto;
  flex: 1 1 auto;
  padding-right: 0.5em;
}
.verticalMenuCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 4px #0001;
  padding: 0.7em 0.8em 0.8em 0.8em;
  min-height: 125px;
  position: relative;
  justify-content: space-between;
}
.verticalMenu-icon {
  font-size: 2em;
}
.verticalMenu-type {
  font-weight: bold;
  font-size: 1.12em;
}
.deploy-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  width: 100%;
  align-items: stretch;
  margin-top: 0.7em;
}
.deployBtn {
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #222;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.14s;
}
.deployBtn:hover {
  background: #00bcd4;
  color: #fff;
}
.assembly-option {
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 1px 4px #0001;
  margin: 0.8em 0;
  padding: 0.7em 1em;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.2em;
}
.assembly-option ul {
  margin: 0.5em 0 0 1.3em;
  font-size: 0.97em;
}
.assembly-option button {
  padding: 0.4em 1.3em;
  border-radius: 7px;
  background: #ffd600;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.assembly-option button:hover {
  background: #ffb300;
  color: #333;
}

.modal-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  padding: 2em 1.5em;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0002;
  min-width: 250px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 0.7em;
}
</style>
