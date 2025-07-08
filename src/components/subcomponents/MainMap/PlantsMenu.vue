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

// Modal state
const showDeployModal = ref(false)
const deployingPlant = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)

// For 6x6 grid
const fieldRows = tiles.tiles.length
const fieldCols = tiles.tiles[0].length
const rowOptions = computed(() => Array.from({length: fieldRows}, (_, i) => i + 1))
const colOptions = computed(() => Array.from({length: fieldCols}, (_, i) => i + 1))

// Helper: returns list of available tiles for planting (no plant, has a deployed assembly with Planter module)
const availableTiles = computed(() => {
  let result = []
  for (let row = 0; row < fieldRows; row++) {
    for (let col = 0; col < fieldCols; col++) {
      const tile = tiles.tiles[row][col]
      // Only show empty tiles (no plant)
      if (!tile.plant && tile.assembly && tile.assembly.deployed) {
        // Require that one of the assembly's modules is a "Planter"
        if (tile.assembly.modules.some(mod => mod.name.toLowerCase().includes('planter'))) {
          result.push({row, col})
        }
      }
    }
  }
  return result
})

// Modal logic
function openDeployModal(plant) {
  deployingPlant.value = plant
  // Default select first available, if any
  if (availableTiles.value.length > 0) {
    selectedRow.value = availableTiles.value[0].row + 1
    selectedCol.value = availableTiles.value[0].col + 1
    showDeployModal.value = true
  } else {
    alert("No available tiles for planting (need empty tile with planter assembly)")
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
  if (!tile.plant && tile.assembly && tile.assembly.deployed && tile.assembly.modules.some(mod => mod.name.toLowerCase().includes('planter'))) {
    // Check user has enough gold
    if (user.gold < deployingPlant.value.cost) {
      alert("Not enough gold!")
      return
    }
    // Assign plant to tile (shallow copy so growthStage can advance independently)
    tile.plant = {
      ...deployingPlant.value,
      growthStage: deployingPlant.value.growthStages[0] // Start at seedling
    }
    user.gold -= deployingPlant.value.cost
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
        <span class="verticalMenu-cost">{{ plant.cost }}💰</span>
        <button class="deployBtn" @click="openDeployModal(plant)">
          Deploy
        </button>
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay">
      <div class="modal">
        <h4>Deploy {{ deployingPlant.type }} ({{ deployingPlant.icon }})</h4>
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
  flex-direction: row;
  align-items: center;
  gap: 0.8em;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 4px #0001;
  padding: 0.4em 0.8em;
  min-height: 45px;
}
.verticalMenu-icon {
  font-size: 1.8em;
}
.verticalMenu-type {
  font-weight: bold;
  font-size: 1.1em;
}
.deployBtn {
  margin-left: auto;
  padding: 0.2em 1em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
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
