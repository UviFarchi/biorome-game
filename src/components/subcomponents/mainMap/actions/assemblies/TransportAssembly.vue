<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, ref, watch, onMounted } from 'vue'
import { canAssemblyMoveAlone } from '@/rules/utils.js'

const props = defineProps({
  assembly: Object
})

const modules = modulesStore()
const tilesStoreInstance = tilesStore()
const allTiles = computed(() => tilesStoreInstance.tiles.flat())
const tile = computed(() => tilesStoreInstance.selectedSubject.value)

const destinationValues = ref({})
const selectedAssemblies = ref({})

const transportableAssemblies = computed(() =>
  modules.activeAssemblies.filter(
    a => !a.deployed && !canAssemblyMoveAlone(a) && a.id !== props.assembly.id
  )
)

function preselectDestination() {
  if (destinationValues.value[props.assembly.id]) return
  if (tile.value && tile.value.row != null && tile.value.col != null) {
    destinationValues.value[props.assembly.id] = `${tile.value.row},${tile.value.col}`
  } else {
    destinationValues.value[props.assembly.id] = ''
  }
}
onMounted(preselectDestination)
watch(() => [tile.value?.row, tile.value?.col, props.assembly.id], preselectDestination)

function transport() {
  const destVal = destinationValues.value[props.assembly.id]
  const selectedId = selectedAssemblies.value[props.assembly.id]
  if (!props.assembly || !destVal || !selectedId) return

  const idx = modules.activeAssemblies.findIndex(a => a.id === selectedId)
  if (idx === -1) return
  const [cargo] = modules.activeAssemblies.splice(idx, 1)

  const [row, col] = destVal.split(',').map(Number)
  if (row == null || col == null) return
  const destTile = tilesStoreInstance.tiles[row][col]
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(cargo)
  cargo.deployed = true

  props.assembly.moves = (props.assembly.moves || 1) - 1

  destinationValues.value[props.assembly.id] = ''
  selectedAssemblies.value[props.assembly.id] = ''
}
</script>

<template>
  <div>
    <button
      @click="transport"
      :disabled="assembly.moves < 1 || !destinationValues[assembly.id] || !selectedAssemblies[assembly.id]"
    >Transport Assembly</button>
    <select v-model="selectedAssemblies[assembly.id]">
      <option disabled value="">Select Assembly</option>
      <option
        v-for="a in transportableAssemblies"
        :key="a.id"
        :value="a.id"
      >
        {{ a.name || a.id }}
      </option>
    </select>
    <select v-model="destinationValues[assembly.id]">
      <option disabled value="">Destination</option>
      <option
        v-for="tileOption in allTiles"
        :key="tileOption.row + '-' + tileOption.col"
        :value="tileOption.row + ',' + tileOption.col"
      >
        {{ tileOption.row + 1 }},{{ tileOption.col + 1 }}
      </option>
    </select>
    <span v-if="assembly.moves < 1" class="btn-error">No moves left for this assembly</span>
  </div>
</template>

<style scoped>
</style>
