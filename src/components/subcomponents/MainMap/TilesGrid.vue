<script setup>
import { ref, computed } from 'vue'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { marketStore } from '/stores/marketStore.js'
import { animalsStore } from '/stores/animalsStore.js'

// Store refs
const tilesStoreInstance = tilesStore()
const tiles = tilesStoreInstance.tiles
const harvestRequirements = tilesStoreInstance.harvestRequirements;
const flatTiles = computed(() => tiles.flat())
const selectedTile = ref(null)
const modules = modulesStore()
const market = marketStore()
const animals = animalsStore()



// --- HARVEST REQUIREMENT CHECK HELPERS ---
function assemblyMeetsRequirements(assembly, requirements) {
  if (!assembly || !assembly.modules) return false;
  return requirements.every(req =>
      assembly.modules.some(m =>
          (!req.type || m.type === req.type) &&
          (!req.subtype || m.subtype === req.subtype) &&
          (!req.name || m.name === req.name)
      )
  )
}
function getMissingModules(assembly, requirements) {
  if (!assembly || !assembly.modules) {
    return requirements.map(req => req.name || req.type || JSON.stringify(req))
  }
  return requirements
      .filter(req =>
          !assembly.modules.some(m =>
              (!req.type || m.type === req.type) &&
              (!req.subtype || m.subtype === req.subtype) &&
              (!req.name || m.name === req.name)
          )
      )
      .map(req => req.name || req.type || JSON.stringify(req))
}

// Modal to show missing modules
const showMissingModal = ref(false)
const missingModules = ref([])
const missingProductType = ref('')

// --- UI/LOGIC HELPERS ---

function closeModal() { selectedTile.value = null }

function recallAssembly(tile) {
  if (tile.assembly) {
    const assemblyId = tile.assembly.id
    tile.assembly = null
    const assembly = modules.activeAssemblies.find(a => a.id === assemblyId)
    if (assembly) assembly.deployed = false
    closeModal()
  }
}

// Plant Harvest Helpers
function plantIsRipe(tile) {
  return tile.plant && (tile.plant.growthStage === 'Mature' || tile.plant.growthStage === 'Overripe')
}

function canHarvestPlant(tile) {
  if (!plantIsRipe(tile) || !tile.assembly) return false
  const productType = tile.plant?.type
  const reqs = harvestRequirements[productType]
  if (!reqs) return false // No rules defined
  return assemblyMeetsRequirements(tile.assembly, reqs)
}
// Return list of modules required for harvesting a plant that are missing
function missingPlantHarvestModules(tile) {
  const missing = []
  if (!tile.assembly) {
    missing.push('Collector module')
    return missing
  }
  const names = tile.assembly.modules.map(m => m.name || '')
  if (!names.some(n => n.includes('Collector'))) {
    missing.push('Collector module')
  }
  return missing
}
function harvestPlant(tile) {
  const productType = tile.plant?.type
  const reqs = harvestRequirements[productType]
  if (!canHarvestPlant(tile)) {
    // Show modal with missing modules
    missingModules.value = getMissingModules(tile.assembly, reqs)
    missingProductType.value = productType
    showMissingModal.value = true
    return
  }
  const existing = market.harvestedProducts.find(p => p.type === productType)
  if (existing) {
    existing.qty += tile.plant.yield
  } else {
    market.harvestedProducts.push({
      type: productType,
      icon: tile.plant.icon,
      qty: tile.plant.yield,
      shelfLife: tile.plant.shelfLife || 3, // fallback
    })
  }
  tile.plant = null
  closeModal()
}

// Animal Harvest/Product helpers
function getAnimalProduct(animal) {
  if (!animal) return null
  return animals.products.find(p => p.key === animal.product)
}
function canHarvestProduct(tile) {
  if (!tile.animal || !tile.assembly) return false
  const product = getAnimalProduct(tile.animal)
  if (!product) return false
  const reqs = harvestRequirements[product.key]
  if (!reqs) return false
  return assemblyMeetsRequirements(tile.assembly, reqs)
}
function harvestAnimalProduct(tile) {
  const product = getAnimalProduct(tile.animal)
  const reqs = harvestRequirements[product?.key]
  if (!canHarvestProduct(tile)) {
    // Show modal with missing modules
    missingModules.value = getMissingModules(tile.assembly, reqs)
    missingProductType.value = product?.key
    showMissingModal.value = true
    return
  }
  let existing = market.harvestedProducts.find(p => p.type === product.key)
  if (existing) {
    existing.qty += 1
  } else {
    market.harvestedProducts.push({
      type: product.key,
      icon: product.icon,
      qty: 1,
      shelfLife: product.shelfLife || 3,
    })
  }
}

// Harvest Animal (butchering)
function canHarvestAnimal(tile) {
  if (!tile.animal || !tile.assembly) return false
  const animalType = tile.animal.type
  const reqs = harvestRequirements[animalType]
  if (!reqs) return false
  return assemblyMeetsRequirements(tile.assembly, reqs)
}

function harvestAnimal(tile) {
  const animalType = tile.animal.type
  const reqs = harvestRequirements[animalType]
  if (!canHarvestAnimal(tile)) {
    // Show modal with missing modules
    missingModules.value = getMissingModules(tile.assembly, reqs)
    missingProductType.value = animalType
    showMissingModal.value = true
    return
  }
  tile.animal = null
  let existing = market.harvestedProducts.find(p => p.type === animalType)
  if (existing) {
    existing.qty += 1
  } else {
    market.harvestedProducts.push({
      type: animalType,
      icon: tile.animal.icon,
      qty: 1,
      shelfLife: 3,
    })
  }
  closeModal()
}

// --- Move Animal ---
const showMoveAnimalModal = ref(false)
const animalToMove = ref(null)
const originTile = ref(null)
const moveDestRow = ref(null)
const moveDestCol = ref(null)
const validAnimalDestTiles = computed(() => {
  const out = []
  for (let row = 0; row < tiles.length; row++) {
    for (let col = 0; col < tiles[0].length; col++) {
      if (!tiles[row][col].animal) {
        out.push({row, col})
      }
    }
  }
  return out
})
const canMoveAnimal = computed(() =>
    selectedTile.value &&
    selectedTile.value.animal &&
    selectedTile.value.assembly &&
    selectedTile.value.assembly.modules.some(m => m.type === 'arm')
)
function openMoveAnimalModal(tile) {
  animalToMove.value = tile.animal
  originTile.value = tile
  showMoveAnimalModal.value = true
  if (validAnimalDestTiles.value.length) {
    moveDestRow.value = validAnimalDestTiles.value[0].row + 1
    moveDestCol.value = validAnimalDestTiles.value[0].col + 1
  }
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
  destTile.animal = animalToMove.value
  originTile.value.animal = null
  closeMoveAnimalModal()
}
</script>


<template>
  <div class="fieldsGrid">
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
        <span v-if="tile.assembly" class="tileAssembly">{{ tile.assembly.icon || '🤖' }}</span>
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
            v-if="canHarvestPlant(selectedTile)"
            @click="harvestPlant(selectedTile)"
            class="harvest-btn"
        >Harvest</button>
        <span v-else class="harvest-msg">
          <span v-if="!plantIsRipe(selectedTile)">(Plant is not ripe for harvest)</span>
          <span v-else-if="!hasCollector(selectedTile)">
            (Missing: {{ missingPlantHarvestModules(selectedTile).join(', ') }})
          </span>
        </span>
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
        <!-- Move Animal row -->
        <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.6em;">
          <button
              class="move-animal-btn"
              :disabled="!canMoveAnimal"
              @click="canMoveAnimal ? openMoveAnimalModal(selectedTile) : null"
          >Move Animal</button>
          <span v-if="!canMoveAnimal" class="move-animal-msg">
            Requires an assembly with a Robotic Arm in this tile
          </span>
        </div>
        <!-- Harvest Product & Animal -->
        <div class="animal-actions-row" style="display: flex; gap: 0.7em; margin-top: 0.6em;">
          <button
              class="animal-product-btn"
              @click="harvestAnimalProduct(selectedTile)"
              :disabled="!canHarvestProduct(selectedTile)"
          >
            Harvest {{ getAnimalProduct(selectedTile.animal)?.label || selectedTile.animal.product }}
            <span>{{ getAnimalProduct(selectedTile.animal)?.icon || '' }}</span>
          </button>
          <button
              class="animal-harvest-btn"
              @click="harvestAnimal(selectedTile)"
              :disabled="!canHarvestAnimal(selectedTile)"
          >Harvest Animal</button>
        </div>
        <div v-if="!canHarvestProduct(selectedTile)" class="harvest-msg">
          Missing required modules: <em>Check details</em>
        </div>
      </div>
      <div v-else style="margin-top: 0.7em;">
        <strong>No animal</strong>
      </div>

      <!-- Assembly Section -->
      <div v-if="selectedTile.assembly">
        <strong>Assembly:</strong>
        <span class="tileAssembly">{{ selectedTile.assembly.icon || '🤖' }}</span>
        Modules:
        <span v-for="mod in selectedTile.assembly.modules" :key="mod.name">{{ mod.name }} </span>
        <button @click="recallAssembly(selectedTile)">Recall</button>
      </div>
      <div v-else style="margin-top: 0.7em;">
        <strong>No assembly</strong>
      </div>
      <button @click="closeModal" class="close-btn">Close</button>
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
          >Row {{ tile.row + 1 }}</option>
        </select>
        <select v-model="moveDestCol">
          <option
              v-for="tile in validAnimalDestTiles"
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
</template>


<style scoped>
.fieldsGrid {
  display: grid;
  grid-template-columns: repeat(6, 50px);
  grid-template-rows: repeat(6, 50px);
  gap: 8px;
  margin: 2em auto;
  max-width: 340px;
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

</style>
