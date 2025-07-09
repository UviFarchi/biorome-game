<script setup>
import { ref, computed } from 'vue'
import { animalsStore } from '/stores/animalsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { userStore } from '/stores/userStore.js'
import eventBus from "@/eventBus.js"

const animals = animalsStore()
const tiles = tilesStore()
const modules = modulesStore()
const user = userStore()

// Collar assembly requirements
const requiredCollarModules = [
  "Animal Collar",
  "Battery Pack",
  "Audio Alarm",
  "Mild Shocker",
  "GPS Module"
]

const availableCollarAssemblies = computed(() => {
  return (modules.activeAssemblies ?? []).filter(a => {
    if (a.deployed) return false
    const moduleNames = (a.modules || []).map(m => m.name)
    return requiredCollarModules.every(req => moduleNames.includes(req))
  })
})

// For requirements modal: try to show closest assembly (or empty if none)
const firstAssemblyMissing = computed(() => {
  const a = (modules.activeAssemblies ?? []).find(a => !a.deployed)
  if (!a) return requiredCollarModules
  const moduleNames = (a.modules || []).map(m => m.name)
  return requiredCollarModules.filter(req => !moduleNames.includes(req))
})

const showDeployModal = ref(false)
const showRequirementsModal = ref(false)
const deployingAnimal = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)
const useCollar = ref(false)
const restrictedTiles = ref([])

const fieldRows = tiles.tiles.length
const fieldCols = tiles.tiles[0].length
const rowOptions = computed(() => Array.from({length: fieldRows}, (_, i) => i + 1))
const colOptions = computed(() => Array.from({length: fieldCols}, (_, i) => i + 1))

const availableTiles = computed(() => {
  let result = []
  for (let row = 0; row < fieldRows; row++) {
    for (let col = 0; col < fieldCols; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.animal) result.push({ row, col })
    }
  }
  return result
})

function toggleTileRestriction(row, col) {
  const idx = restrictedTiles.value.findIndex(t => t.row === row && t.col === col)
  if (idx !== -1) {
    restrictedTiles.value.splice(idx, 1)
  } else if (restrictedTiles.value.length < 3) {
    restrictedTiles.value.push({ row, col })
  }
}

function openDeployModal(animal) {
  deployingAnimal.value = animal
  useCollar.value = false
  restrictedTiles.value = []
  if (availableTiles.value.length > 0) {
    selectedRow.value = availableTiles.value[0].row + 1
    selectedCol.value = availableTiles.value[0].col + 1
    showDeployModal.value = true
  } else {
    alert("No available tiles for animals.")
  }
}

function closeDeployModal() {
  showDeployModal.value = false
  deployingAnimal.value = null
  selectedRow.value = null
  selectedCol.value = null
  useCollar.value = false
  restrictedTiles.value = []
}

function confirmDeploy() {
  if (!deployingAnimal.value) return
  const row = Number(selectedRow.value) - 1
  const col = Number(selectedCol.value) - 1
  const tile = tiles.tiles[row][col]
  if (!tile.animal) {
    if (user.gold < deployingAnimal.value.cost) {
      alert("Not enough gold!")
      return
    }
    // If using collar, assign first available assembly (if exists)
    if (useCollar.value) {
      const collar = availableCollarAssemblies.value[0]
      if (!collar) {
        alert("No collar assembly available!")
        return
      }
      collar.deployed = true
      tile.assembly = collar
    }
    tile.animal = {
      ...deployingAnimal.value,
      mood: 100,
      collar: useCollar.value
          ? { restrictedTiles: [...restrictedTiles.value] }
          : null
    }
    user.gold -= deployingAnimal.value.cost
    closeDeployModal()
  } else {
    alert("Tile already has an animal.")
  }
}


// Handle requirements modal—user wants to build a collar
function goToAssemblyArea() {
  closeDeployModal()
  showRequirementsModal.value = false
  setTimeout(() => {
    eventBus.emit('nav', 'assembly')
  }, 100)
}

function closeRequirementsModal() {
  showRequirementsModal.value = false
}
</script>

<template>
  <div class="verticalMenuArea">
    <h3>Available Animals</h3>
    <div class="verticalMenuScroll">
      <div
          v-for="animal in animals.animalTypes"
          :key="animal.type"
          class="verticalMenuCard"
      >
        <span class="verticalMenu-icon">{{ animal.icon }}</span>
        <span class="verticalMenu-type">{{ animal.type }}</span>
        <span class="verticalMenu-cost">{{ animal.cost }}💰</span>
        <button class="deployBtn" @click="openDeployModal(animal)">
          Deploy
        </button>
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay">
      <div class="modal">
        <h4>Deploy {{ deployingAnimal.type }} ({{ deployingAnimal.icon }})</h4>
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
        <div class="collarSection">
          <label>
            <input type="checkbox" v-model="useCollar" />
            Use collar?
          </label>
          <div v-if="useCollar">
            <div v-if="availableCollarAssemblies.length > 0" style="color: #388e3c;">
              Collar assembly ready (will be assigned automatically).
            </div>
            <div v-else>
              <div style="color:#e53935; margin-bottom:0.5em;">
                No available collar assemblies.
              </div>
              <div>Required modules:</div>
              {{requiredCollarModules}}
              <button class="deployBtn" style="margin-top:0.5em;" @click="goToAssemblyArea">
                Go to Assembly Area to Build
              </button>
            </div>
            <div>
              <div style="margin-top: 0.8em;">Select up to 3 tiles (restriction):</div>
              <div class="tileSelectGrid">
                <button
                    v-for="cell in fieldRows * fieldCols"
                    :key="cell"
                    :class="[
            'tileBtn',
            restrictedTiles.some(t =>
              t.row === Math.floor((cell - 1) / fieldCols) &&
              t.col === (cell - 1) % fieldCols
            ) ? 'selected' : ''
          ]"
                    @click.prevent="
            toggleTileRestriction(
              Math.floor((cell - 1) / fieldCols),
              (cell - 1) % fieldCols
            )
          "
                >
                  {{ Math.floor((cell - 1) / fieldCols) + 1 }},{{ ((cell - 1) % fieldCols) + 1 }}
                </button>
              </div>
              <div class="hint">(Tiles must be contiguous, otherwise the animal won't be able to move among them.)</div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="confirmDeploy">OK</button>
          <button @click="closeDeployModal">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Requirements Modal -->
    <div v-if="showRequirementsModal" class="modal-overlay">
      <div class="modal">
        <h4>No collar assembly available</h4>
        <div>Required modules:</div>
        <ul>
          <li v-for="mod in firstAssemblyMissing" :key="mod">{{ mod }}</li>
        </ul>
        <div class="modal-actions">
          <button @click="goToAssemblyArea">Go to Assembly Area</button>
          <button @click="closeRequirementsModal">Cancel</button>
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
  margin: 0 1rem 0 0;
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
  background: rgba(0, 0, 0, 0.35);
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

.collarSection {
  margin: 1em 0 0.6em 0;
  background: #e0f2f1;
  padding: 0.5em 1em;
  border-radius: 8px;
}

.tileSelectGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2em;
  margin-top: 0.3em;
}

.tileBtn {
  background: #e1f5fe;
  border: 1px solid #00bcd4;
  border-radius: 5px;
  padding: 0.4em 0.7em;
  font-size: 0.96em;
  margin: 2px;
  cursor: pointer;
}



.hint {
  font-size: 0.93em;
  color: #888;
  margin-top: 0.3em;
}
</style>
