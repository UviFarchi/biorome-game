<script setup>
import {ref, computed} from 'vue'
import {animalsStore} from '/stores/animalsStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import {userStore} from '/stores/userStore.js'
import {gameStateStore} from "../../../../stores/gameStateStore.js";

const animals = animalsStore()
const tiles = tilesStore()
const user = userStore()
const gameState = gameStateStore();
const showDeployModal = ref(false)
const deployingAnimal = ref(null)
const selectedRow = ref(null)
const selectedCol = ref(null)
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

    tile.animal = {
      ...deployingAnimal.value,
      mood: 100,
      dateDeployed: gameState.day
    }
    user.gold -= deployingAnimal.value.cost
    closeDeployModal()
  } else {
    alert("Tile already has an animal.")
  }
}
</script>

<template>
  <div class="verticalMenuArea">
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
  display: flex;
  flex-direction: column;
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

.deployBtn:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
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

</style>
