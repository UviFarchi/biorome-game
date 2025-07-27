<script setup>
import { ref, computed } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { validAnimalDestTiles, canMoveAnimal, getMissingModules } from '@/rules/utils.js'

const props = defineProps({
  selectedAnimal: Object,
  isGate: Boolean
})

const modules = modulesStore()
const tiles = tilesStore()
const tilesGrid = tiles.tiles

const availableTiles = computed(() => {
  if (!props.selectedAnimal) return []
  return validAnimalDestTiles(props.selectedAnimal, tilesGrid)
})

const assemblies = computed(() => {
  if (props.isGate) {
    return modules.activeAssemblies.filter(a => !a.deployed && canMoveAnimal(a))
  } else {
    return (tiles.selectedSubject.value.assemblies || []).filter(a => canMoveAnimal(a))
  }
})

const selectedAssemblyIndex = ref(0)
const selectedTileIndex = ref(0)

const moveErrorsList = computed(() => {
  let errs = []
  if (availableTiles.value.length === 0) errs.push('No available destination tiles.')
  if (assemblies.value.length === 0) {
    const reqs = modules.activeAssemblies.length
        ? getMissingModules(modules.activeAssemblies[0], "moveAnimal")
        : ['No suitable assembly']
    errs.push('No eligible assemblies: ' + reqs.join(', '))
  }
  return errs
})

function moveAnimal() {
  const animal = props.selectedAnimal
  const assembly = assemblies.value[selectedAssemblyIndex.value]
  const dest = availableTiles.value[selectedTileIndex.value]
  if (!dest || !assembly) return
  const destTile = tiles.tiles[dest.row][dest.col]
  if (assembly.actions < 1 || assembly.moves < 1) return

  if (props.isGate) {
    const idx = tiles.gate.animals.indexOf(animal)
    if (idx !== -1) tiles.gate.animals.splice(idx, 1)
    const asmIdx = modules.activeAssemblies.findIndex(a => a.id === assembly.id)
    if (asmIdx !== -1) modules.activeAssemblies.splice(asmIdx, 1)
  } else {
    const tile = tiles.selectedSubject.value
    tile.animal = null
    const aIdx = tile.assemblies.findIndex(a => a.id === assembly.id)
    if (aIdx !== -1) tile.assemblies.splice(aIdx, 1)
  }

  assembly.actions--
  assembly.moves--

  destTile.animal = { ...animal }
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(assembly)
}
</script>

<template>
  <div>
    <div v-if="props.selectedAnimal">
      {{ props.selectedAnimal.type }}
      <button @click="moveAnimal" :disabled="moveErrorsList.length > 0">Move Animal</button>
      <span class="btn-error">{{ moveErrorsList.join(', ') }}</span>
      <select id="destinationTiles" v-model="selectedTileIndex">
        <option v-for="(tile, i) in availableTiles" :key="i" :value="i">
          {{tile.row+1}},{{tile.col+1}}
        </option>
      </select>
      <select id="assemblyToUse" v-model="selectedAssemblyIndex">
        <option v-for="(assembly, i) in assemblies" :key="assembly.id" :value="i">
          {{assembly.name}}
        </option>
      </select>
    </div>
    <div v-else>
      No animal selected
    </div>
  </div>
</template>


<style scoped>

</style>