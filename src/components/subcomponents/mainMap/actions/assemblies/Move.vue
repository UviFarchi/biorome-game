<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps({
  assembly: Object
})

const tilesStoreInstance = tilesStore()
const modules = modulesStore()
const allTiles = computed(() => tilesStoreInstance.tiles.flat())
const tile = computed(() => tilesStoreInstance.selectedSubject.value)

const STATION_OPTION = 'station'
const destinationValues = ref({})

// Utility checks
function isAtStation(assembly) {
  return !assembly.deployed
}
function isOnThisTile(assembly) {
  if (!tile.value || !tile.value.assemblies) return false
  return tile.value.assemblies.some(a => a.id === assembly.id)
}
function isOnAnyTile(assembly) {
  return !!assembly.deployed
}

// Preselect current tile if applicable, else empty
function preselectDestination() {
  // Only set if unset
  if (destinationValues.value[props.assembly.id]) return
  if (tile.value && tile.value.row != null && tile.value.col != null) {
    destinationValues.value[props.assembly.id] = `${tile.value.row},${tile.value.col}`
  } else {
    destinationValues.value[props.assembly.id] = ''
  }
}
onMounted(preselectDestination)
watch(() => [tile.value?.row, tile.value?.col, props.assembly.id], preselectDestination)

function move() {
  const destVal = destinationValues.value[props.assembly.id]
  if (!props.assembly || !destVal) return

  // Moving to Station
  if (destVal === STATION_OPTION) {
    if (isOnAnyTile(props.assembly)) {
      for (let r = 0; r < tilesStoreInstance.tiles.length; r++) {
        for (let c = 0; c < tilesStoreInstance.tiles[r].length; c++) {
          let idx = tilesStoreInstance.tiles[r][c].assemblies?.findIndex(a => a.id === props.assembly.id)
          if (idx !== -1 && idx !== undefined) {
            tilesStoreInstance.tiles[r][c].assemblies.splice(idx, 1)
          }
        }
      }
      props.assembly.deployed = false
      modules.activeAssemblies.push(props.assembly)
    }
    destinationValues.value[props.assembly.id] = ''
    return
  }

  // Moving from station to tile
  if (isAtStation(props.assembly)) {
    const [row, col] = destVal.split(',').map(Number)
    if (row == null || col == null) return
    const idx = modules.activeAssemblies.findIndex(a => a.id === props.assembly.id)
    if (idx !== -1) modules.activeAssemblies.splice(idx, 1)
    const destTile = tilesStoreInstance.tiles[row][col]
    destTile.assemblies = destTile.assemblies || []
    destTile.assemblies.push(props.assembly)
    props.assembly.deployed = true
    props.assembly.moves = (props.assembly.moves || 1) - 1
    destinationValues.value[props.assembly.id] = ''
    return
  }

  // Moving from tile to another tile
  const [row, col] = destVal.split(',').map(Number)
  if (row == null || col == null) return
  for (let r = 0; r < tilesStoreInstance.tiles.length; r++) {
    for (let c = 0; c < tilesStoreInstance.tiles[r].length; c++) {
      let idx = tilesStoreInstance.tiles[r][c].assemblies?.findIndex(a => a.id === props.assembly.id)
      if (idx !== -1 && idx !== undefined) {
        tilesStoreInstance.tiles[r][c].assemblies.splice(idx, 1)
      }
    }
  }
  const destTile = tilesStoreInstance.tiles[row][col]
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(props.assembly)
  props.assembly.deployed = true
  props.assembly.moves = (props.assembly.moves || 1) - 1
  destinationValues.value[props.assembly.id] = ''
}
</script>

<template>
  <div>
    <button @click="move" :disabled="assembly.moves < 1 || !destinationValues[assembly.id]">Move</button>
    <select v-model="destinationValues[assembly.id]">
      <option :value="STATION_OPTION" :disabled="isAtStation(assembly)">Station</option>
      <option
          v-for="tileOption in allTiles"
          :key="tileOption.row + '-' + tileOption.col"
          :value="tileOption.row + ',' + tileOption.col"
          :disabled="isOnThisTile(assembly) && tileOption.row === tile.value?.row && tileOption.col === tile.value?.col"
      >
        {{ tileOption.row + 1 }},{{ tileOption.col + 1 }}
      </option>
    </select>
    <span v-if="assembly.moves < 1" class="btn-error">No moves left for this assembly</span>
  </div>
</template>

<style scoped>
</style>
