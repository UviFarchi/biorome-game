<script setup>
import {ref, computed} from 'vue'
import {animalsStore} from '/stores/animalsStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import {modulesStore} from '/stores/modulesStore.js'
import {userStore} from '/stores/userStore.js'

const animals = animalsStore()
const tiles = tilesStore()
const modules = modulesStore()
const user = userStore()

// Collar count from modulesStore
const availableCollars = computed(() => {
  const collar = modules.availableModules.find(m => m.type === 'Animal Collar')
  return collar ? collar.count : 0
})

// Modal state
const showDeployModal = ref(false)
const deployingAnimal = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)
const useCollar = ref(false)
const restrictedTiles = ref([]) // Array of {row, col}

const fieldRows = tiles.tiles.length
const fieldCols = tiles.tiles[0].length
const rowOptions = computed(() => Array.from({length: fieldRows}, (_, i) => i + 1))
const colOptions = computed(() => Array.from({length: fieldCols}, (_, i) => i + 1))

// Helper: all available tiles for animal deployment (no animal present)
const availableTiles = computed(() => {
  let result = []
  for (let row = 0; row < fieldRows; row++) {
    for (let col = 0; col < fieldCols; col++) {
      const tile = tiles.tiles[row][col]
      if (!tile.animal) result.push({row, col})
    }
  }
  return result
})


function toggleTileRestriction(row, col) {
  const idx = restrictedTiles.value.findIndex(t => t.row === row && t.col === col)
  if (idx !== -1) {
    restrictedTiles.value.splice(idx, 1)
  } else if (restrictedTiles.value.length < 3) {
    restrictedTiles.value.push({row, col})
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
    // Check user gold
    if (user.gold < deployingAnimal.value.cost) {
      alert("Not enough gold!")
      return
    }
    // Check collar availability
    if (useCollar.value && availableCollars.value < 1) {
      alert("No collars available!")
      return
    }
    // Deploy animal (copy template)
    tile.animal = {
      ...deployingAnimal.value,
      mood: 100, // Reset mood on deploy
      collar: useCollar.value ? {restrictedTiles: [...restrictedTiles.value]} : null
    }
    user.gold -= deployingAnimal.value.cost
    // Reduce collar count if used
    if (useCollar.value) {
      const collar = modules.availableModules.find(m => m.type === 'Animal Collar')
      if (collar) collar.count--
    }
    closeDeployModal()
  } else {
    alert("Tile already has an animal.")
  }
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
        <div class="collarSection" v-if="availableCollars > 0">
          <label>
            <input type="checkbox" v-model="useCollar" />
            Use collar? ({{ availableCollars }} available)
          </label>
          <div v-if="useCollar">
            <div>Select up to 3 tiles (for restriction):</div>
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
        <div class="modal-actions">
          <button @click="confirmDeploy">OK</button>
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
  margin: 0 1rem 0 0;
  min-width: 170px;
  max-width: 220px;
  height: 60vh;
  display: flex;
  flex-direction: column;
  float: left;
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

.tileBtn.selected {
  background: #00bcd4;
  color: #fff;
}

.hint {
  font-size: 0.93em;
  color: #888;
  margin-top: 0.3em;
}
</style>
