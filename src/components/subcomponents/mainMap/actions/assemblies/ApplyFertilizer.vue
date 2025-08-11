<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, ref, watch, onMounted } from 'vue'
import { assemblyMeetsRequirements } from '@/rules/utils.js'

const props = defineProps({
  assembly: Object
})

const tilesStoreInstance = tilesStore()
const modules = modulesStore()
const allTiles = computed(() => tilesStoreInstance.tiles.flat())
const tile = computed(() => tilesStoreInstance.selectedSubject.value)
const stationFertilizer = computed(() => tilesStoreInstance.gate.extras.filter(e => e.type === 'fertilizer').length)

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

// Preselect the tile if the assembly is on it
function preselectDestination() {
  if (destinationValues.value[props.assembly.id]) return
  if (props.assembly.deployed && tile.value && tile.value.row != null && tile.value.col != null && isOnThisTile(props.assembly)) {
    destinationValues.value[props.assembly.id] = `${tile.value.row},${tile.value.col}`
  } else {
    destinationValues.value[props.assembly.id] = ''
  }
}
onMounted(preselectDestination)
watch(() => [tile.value?.row, tile.value?.col, props.assembly.id], preselectDestination)

function canFertilize() {
  // Use whatever requirements you have; here it's sowing/fertilize
  return assemblyMeetsRequirements(props.assembly, 'sowing', 'fertilize')
}

function applyFertilizer() {
  const destVal = destinationValues.value[props.assembly.id]
  if (!props.assembly || !destVal) return

  // Must have fertilizer at the station
  const fertIdx = tilesStoreInstance.gate.extras.findIndex(e => e.type === 'fertilizer')
  if (fertIdx === -1) return

  // Station: just "recall" the assembly (no fertility boost, don't consume fertilizer)
  if (destVal === STATION_OPTION) {
    // Remove from current tile if deployed
    if (!isAtStation(props.assembly)) {
      // Remove from all tiles
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

  // Move (if needed), consume fertilizer, boost fertility
  const [row, col] = destVal.split(',').map(Number)
  if (row == null || col == null) return
  let destTile = tilesStoreInstance.tiles[row][col]

  // Remove from current tile if not already at destination
  if (!isAtStation(props.assembly)) {
    for (let r = 0; r < tilesStoreInstance.tiles.length; r++) {
      for (let c = 0; c < tilesStoreInstance.tiles[r].length; c++) {
        let idx = tilesStoreInstance.tiles[r][c].assemblies?.findIndex(a => a.id === props.assembly.id)
        if (idx !== -1 && idx !== undefined) {
          tilesStoreInstance.tiles[r][c].assemblies.splice(idx, 1)
        }
      }
    }
  } else {
    // Remove from activeAssemblies if coming from station
    const idx = modules.activeAssemblies.findIndex(a => a.id === props.assembly.id)
    if (idx !== -1) modules.activeAssemblies.splice(idx, 1)
  }

  destTile.assemblies = destTile.assemblies || []
  if (!destTile.assemblies.some(a => a.id === props.assembly.id)) {
    destTile.assemblies.push(props.assembly)
  }
  props.assembly.deployed = true
  props.assembly.moves = (props.assembly.moves || 1) - 1

  // Remove fertilizer from station
  tilesStoreInstance.gate.extras.splice(fertIdx, 1)
  // Increase fertility of target tile
  destTile.soil.fertility = (destTile.soil.fertility || 0) + 1

  destinationValues.value[props.assembly.id] = ''
}
</script>

<template>
  <div>
    <button
        @click="applyFertilizer"
        :disabled="!canFertilize() || stationFertilizer === 0 || !destinationValues[assembly.id]"
    >
      Apply Fertilizer
    </button>
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
    <span v-if="!canFertilize()" class="btn-error">
      Cannot fertilize: missing modules
    </span>
    <span v-if="canFertilize() && stationFertilizer === 0" class="btn-error">
      No fertilizer at station
    </span>
    <span v-if="assembly.moves < 1" class="btn-error">No moves left for this assembly</span>
  </div>
</template>

<style scoped>


</style>
