<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, ref } from 'vue'

const tilesStoreInstance = tilesStore()
const allTiles = computed(() => tilesStoreInstance.tiles.flat())
const tile = computed(() => tilesStoreInstance.selectedSubject.value)
const modules = modulesStore()

// Each assembly gets its own destinationValue
const destinationValues = ref({})

const assemblies = computed(() => tile.value?.assemblies || [])

function move(assembly) {
  const destVal = destinationValues.value[assembly.id]
  if (!assembly || !tile.value || !destVal) return
  const [row, col] = destVal.split(',').map(Number)
  if (row == null || col == null) return

  // Remove from current tile
  const idx = tile.value.assemblies.findIndex(a => a.id === assembly.id)
  if (idx !== -1) tile.value.assemblies.splice(idx, 1)

  // Add to new tile
  const destTile = tilesStoreInstance.tiles[row][col]
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(assembly)
  assembly.moves = (assembly.moves || 1) - 1

  // Optionally clear the destination value for this assembly
  destinationValues.value[assembly.id] = ''
}

function recall(assembly) {
  const idx = tile.value.assemblies.findIndex(a => a.id === assembly.id)
  if (idx !== -1) tile.value.assemblies.splice(idx, 1)
  modules.activeAssemblies.push({ ...assembly, deployed: false })
}
</script>

<template>
  <div v-for="assembly in assemblies" :key="assembly.id" class="assembly-block">
    <span>{{ assembly.name || 'Assembly' }}</span>
    <button @click="recall(assembly)">Recall</button>
    <button @click="move(assembly)" :disabled="assembly.moves < 1">Move</button>
    <select v-model="destinationValues[assembly.id]">
      <option v-for="tileOption in allTiles"
              :key="tileOption.row + '-' + tileOption.col"
              :value="tileOption.row + ',' + tileOption.col">
        {{ tileOption.row + 1 }},{{ tileOption.col + 1 }}
      </option>
    </select>
    <span v-if="assembly.moves < 1" class="btn-error">No moves left for this assembly</span>
  </div>
</template>
<style scoped>
.assembly-block {
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
  box-shadow: 0 1px 4px rgba(60, 60, 60, 0.05);
  gap: 0.6em;
}

.assembly-block span {
  font-weight: bold;
  text-align: center;
  overflow-wrap: anywhere;
  max-height: 3.5em;
  line-height: 1.13em;
  font-size: 1.08em;
  margin-bottom: 0.15em;
}

.assembly-block button {
  padding: 0.21em 1em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  margin: 0.15em 0;
}

.assembly-block button:hover {
  background: #00bcd4;
  color: #fff;
}
.assembly-block button:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}

.assembly-block select {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 70px;
  margin-top: 0.1em;
}

.btn-error {
  color: #b22222;
  font-size: 0.95em;
  margin-left: 0.5em;
  font-weight: 500;
}

</style>