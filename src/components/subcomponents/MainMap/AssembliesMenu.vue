<script setup>
import { ref, computed } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'

const modules = modulesStore()
const tiles = tilesStore()

const availableAssemblies = computed(() =>
    modules.activeAssemblies.filter(a => a.deployed === false)
)

const showDeployModal = ref(false)
const deployingAssemblyId = ref(null)
const selectedRow = ref(1)
const selectedCol = ref(1)

const currentAssembly = computed(() =>
    modules.activeAssemblies.find(a => a.id === deployingAssemblyId.value)
)

const fieldRows = tiles.tiles.length
const fieldCols = tiles.tiles[0].length
const rowOptions = computed(() => Array.from({ length: fieldRows }, (_, i) => i + 1))
const colOptions = computed(() => Array.from({ length: fieldCols }, (_, i) => i + 1))

function openDeployModal(id) {
  deployingAssemblyId.value = id
  selectedRow.value = rowOptions.value[0]
  selectedCol.value = colOptions.value[0]
  showDeployModal.value = true
}
function closeDeployModal() {
  showDeployModal.value = false
  deployingAssemblyId.value = null
  selectedRow.value = null
  selectedCol.value = null
}
function confirmDeploy() {
  if (deployingAssemblyId.value != null) {
    const idx = modules.activeAssemblies.findIndex(a => a.id === deployingAssemblyId.value)
    if (idx !== -1) {
      const assembly = modules.activeAssemblies[idx]
      const row = Number(selectedRow.value) - 1
      const col = Number(selectedCol.value) - 1
      if (
          row >= 0 && row < tiles.tiles.length &&
          col >= 0 && col < tiles.tiles[0].length
      ) {
        const targetTile = tiles.tiles[row][col]
        targetTile.assemblies = targetTile.assemblies || []
        targetTile.assemblies.push(assembly)
        assembly.deployed = true
        assembly.moves--
      }
    }
  }
  closeDeployModal()
}
</script>

<template>
  <div>
    <div class="assembliesScroll">
      <div
          v-for="assembly in availableAssemblies"
          :key="assembly.id"
          class="assemblyCard"
          :class="{ 'out-of-moves': assembly.moves === 0 }"
      >
        <div class="cardHeader">
          <span
              class="assemblyName"
              :title="assembly.name"
          >
            {{ assembly.name || 'Assembly' }}
          </span>
          <button
              class="buyBtn"
              @click="openDeployModal(assembly.id)"
          >
            Deploy
          </button>
        </div>
      </div>
      <div v-if="availableAssemblies.length === 0" class="empty">
        No assemblies available yet.
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay" @click.self="closeDeployModal">
      <div class="modal">
        <h4>Deploy Assembly</h4>
        <div v-if="currentAssembly">
          <div class="modal-assembly-name">{{ currentAssembly.name }}</div>
          <div class="modal-section">
            <span class="mod-label">Modules:</span>
            <span
                v-for="mod in currentAssembly.modules"
                :key="mod.type"
                class="moduleName"
            >{{ mod.type }}</span>
          </div>
          <div class="modal-section">
            <span>Actions left: <b>{{ currentAssembly.actions }}</b></span>
            <span style="margin-left: 1.2em;">Moves left: <b>{{ currentAssembly.moves }}</b></span>
          </div>
          <div v-if="currentAssembly.moves === 0" class="deploy-warning">
            No moves left for this assembly today.
          </div>
        </div>
        <div class="modal-section">
          <label>
            Row:
            <select v-model="selectedRow">
              <option v-for="row in rowOptions" :value="row" :key="row">{{ row }}</option>
            </select>
          </label>
          <label>
            Column:
            <select v-model="selectedCol">
              <option v-for="col in colOptions" :value="col" :key="col">{{ col }}</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button
              @click="confirmDeploy"
              :disabled="!currentAssembly || currentAssembly.moves === 0"
          >Confirm</button>
          <button @click="closeDeployModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.assembliesScroll {
  display: flex;
  flex-direction: row;
  gap: 0.8em;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  padding-bottom: 0.2em;
}
.assemblyCard {
  background: #f9fbe7;
  border-radius: 8px;
  padding: 0.5em 1em;
  min-width: 185px;
  max-width: 185px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
  position: relative;
}
.assemblyCard.out-of-moves {
  background: #eee;

  pointer-events: auto;
}
.cardHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  width: 100%;
  user-select: none;
}
.assemblyName {
  font-weight: bold;
  text-align: center;
  overflow-wrap: anywhere;
  max-height: 3.5em;
  line-height: 1.13em;
  font-size: 1.08em;
  margin-bottom: 0.15em;
}
.buyBtn {
  margin-top: 0.2em;
  padding: 0.21em 1em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  position: absolute;
  bottom: 5px;
}
.buyBtn:hover {
  background: #00bcd4;
  color: #fff;
}
.buyBtn:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}
.empty {
  color: #888;
  font-style: italic;
  align-self: center;
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
  padding: 2em 1.5em 1.5em 1.5em;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0002;
  min-width: 270px;
  max-width: 92vw;
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.15em;
}
.modal-assembly-name {
  font-weight: bold;
  font-size: 1.13em;
  color: #00796b;
  margin-bottom: 0.23em;
}
.modal-section {
  margin-bottom: 0.7em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7em;
}
.mod-label {
  color: #00796b;
  font-weight: 500;
  margin-right: 0.55em;
}
.moduleName {
  font-size: 0.98em;
  background: #e0f7fa;
  border-radius: 5px;
  padding: 0.13em 0.7em;
  color: #333;
  margin-right: 0.32em;
  margin-bottom: 0.18em;
}
.deploy-warning {
  color: #d32f2f;
  font-size: 0.95em;
  font-style: italic;
  margin-top: 0.23em;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 0.7em;
}
</style>
