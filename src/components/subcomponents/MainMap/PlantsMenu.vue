<script setup>
import { ref, computed } from 'vue'
import { plantsStore } from '/stores/plantsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { userStore } from '/stores/userStore.js'

const plants = plantsStore()
const tiles = tilesStore()
const modules = modulesStore()
const user = userStore()

const showDeployModal = ref(false)
const deployingPlant = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)
const selectedPlantingType = ref('Seed') // default to Seed

const fieldRows = tiles.tiles.length
const fieldCols = tiles.tiles[0].length
const rowOptions = computed(() => Array.from({length: fieldRows}, (_, i) => i + 1))
const colOptions = computed(() => Array.from({length: fieldCols}, (_, i) => i + 1))

// Determine if an assembly is suitable for the planting type
function isAssemblySuitable(assembly, plantingType) {
  if (!assembly || !assembly.deployed) return false
  const names = (assembly.modules || []).map(m => m.name || m)
  // Accepts objects or strings
  const hasTransport = names.some(n => n.toLowerCase().includes('transport'))
  const hasRoboticArm = names.some(n => n.toLowerCase().includes('robotic arm'))
  if (plantingType === 'Seed') {
    return (
        hasTransport &&
        hasRoboticArm &&
        names.some(n => n.toLowerCase().includes('seeder')) &&
        names.some(n => n.toLowerCase().includes('hole-borer'))
    )
  } else if (plantingType === 'Seedling') {
    return (
        hasTransport &&
        hasRoboticArm &&
        names.some(n => n.toLowerCase().includes('cart')) &&
        names.some(n => n.toLowerCase().includes('gripper'))
    )
  }
  return false
}

// Returns all available tiles for this planting type
const availableTiles = computed(() => {
  let result = []
  for (let row = 0; row < fieldRows; row++) {
    for (let col = 0; col < fieldCols; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.plant && tile.assembly && isAssemblySuitable(tile.assembly, selectedPlantingType.value)) {
        result.push({row, col})
      }
    }
  }
  return result
})

// Modal logic
function openDeployModal(plant, plantingType) {
  deployingPlant.value = plant
  selectedPlantingType.value = plantingType
  if (availableTiles.value.length > 0) {
    selectedRow.value = availableTiles.value[0].row + 1
    selectedCol.value = availableTiles.value[0].col + 1
    showDeployModal.value = true
  } else {
    alert("No available tiles for planting (need matching assembly deployed)")
  }
}

function closeDeployModal() {
  showDeployModal.value = false
  deployingPlant.value = null
  selectedRow.value = null
  selectedCol.value = null
}

function confirmDeploy() {
  if (!deployingPlant.value) return
  const row = Number(selectedRow.value) - 1
  const col = Number(selectedCol.value) - 1
  const tile = tiles.tiles[row][col]
  if (!tile.plant && tile.assembly && isAssemblySuitable(tile.assembly, selectedPlantingType.value)) {
    // Check user has enough gold
    const cost = selectedPlantingType.value === 'Seed'
        ? deployingPlant.value.seedCost
        : deployingPlant.value.seedlingCost
    if (user.gold < cost) {
      alert("Not enough gold!")
      return
    }
    // Assign plant to tile
    tile.plant = {
      ...deployingPlant.value,
      plantingType: selectedPlantingType.value,
      growthStage: selectedPlantingType.value // Start at "Seed" or "Seedling"
    }
    user.gold -= cost
    closeDeployModal()
  } else {
    alert("Invalid tile selected.")
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
        <label>
          Planting type:
          <select v-model="selectedPlantingType">
            <option v-for="opt in deployingPlant.plantingOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </label>
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
