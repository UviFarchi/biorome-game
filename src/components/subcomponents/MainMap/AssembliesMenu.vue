<script setup>
import { ref, computed } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js' // <-- Add this import
import eventBus from "@/eventBus.js";

const modules = modulesStore()
const tiles = tilesStore()

const availableAssemblies = computed(() =>
    modules.activeAssemblies.filter(a => a.deployed === false)
)

const showDeployModal = ref(false)
const deployingAssemblyId = ref(null)
const selectedRow = ref(1)
const selectedCol = ref(1)

const fieldRows = 6
const fieldCols = 6
const rowOptions = computed(() => Array.from({length: fieldRows}, (_, i) => i + 1))
const colOptions = computed(() => Array.from({length: fieldCols}, (_, i) => i + 1))

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
        // --- Recall existing assembly if present
        const targetTile = tiles.tiles[row][col]
        if (targetTile.assembly) {
          const recalled = modules.activeAssemblies.find(a => a.id === targetTile.assembly.id)
          if (recalled) recalled.deployed = false
          targetTile.assembly = null
        }
        // --- Deploy the new assembly
        targetTile.assembly = assembly
        assembly.deployed = true
      }
    }
  }
  closeDeployModal()
}


</script>

<template>
  <div class="topMenuArea">
    <button class="assemblyAreaButton" @click="eventBus.emit('nav', 'assembly')">
      Go to Assembly Area
    </button>
    <h3>Available Assemblies</h3>
    <div class="assembliesScroll">
      <div
          v-for="assembly in availableAssemblies"
          :key="assembly.id"
          class="assemblyCard"
      >
        <ul class="modulesList">
          <li v-for="mod in assembly.modules" :key="mod.name">
            {{ mod.name }}
          </li>
        </ul>
        <button class="deployBtn" @click="openDeployModal(assembly.id)">
          Deploy
        </button>
      </div>
      <div v-if="availableAssemblies.length === 0" class="empty">
        No assemblies available yet.
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay">
      <div class="modal">
        <h4>Deploy Assembly</h4>
        <label>
          Row:
          <select v-model="selectedRow">
            <option v-for="row in rowOptions" :value="row" :key="row">
              {{ row }}
            </option>
          </select>
        </label>
        <label>
          Column:
          <select v-model="selectedCol">
            <option v-for="col in colOptions" :value="col" :key="col">
              {{ col }}
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

.assemblyAreaButton {
  margin-bottom: 0.5em;
  font-weight: bold;
  padding: 0.3em 1.3em;
  border-radius: 8px;
  border: none;
  background: #80deea;
  color: #2c2c2c;
  cursor: pointer;
  font-size: 1.02em;
}
.assemblyAreaButton:hover {
  background: #00bcd4;
  color: #fff;
}
.assembliesScroll {
  display: flex;
  flex-direction: row;
  gap: 1.2em;
  overflow-x: auto;
  padding-bottom: 0.5em;
  scrollbar-width: thin;
  scrollbar-color: #aaa #fafaff;
}
.assemblyCard {
  flex: 0 0 150px;
  background: #f2f2f2;
  border-radius: 8px;
  min-height: 80px;
  margin: 0.2rem 0;
  padding: 0.6rem 0.8rem;
  box-shadow: 0 1px 4px #0002;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.modulesList {
  margin: 0;
  padding-left: 1.2em;
}
.deployBtn {
  margin-top: 0.5em;
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
.empty {
  color: #888;
  font-style: italic;
  align-self: center;
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
