<script setup>
import {assemblyMeetsRequirements, getRequirements, getMatchingModuleNames} from '@/rules/utils.js'
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import {modulesStore} from '/stores/modulesStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import {computed, ref} from 'vue'

const props = defineProps({
  isGate: Boolean,
  setFeedbackMsg: Function
})

const modules = modulesStore()
const tiles = tilesStore()
const selectedAnimal = tiles.selectedSubject.value.animal;
const tilesGrid = tiles.tiles

const validAnimalDestTiles = computed(() => {
  const restriction = selectedAnimal.collar?.restrictedTiles
  const out = []
  if (!restriction || !restriction.length) {
    for (let row = 0; row < tilesGrid.length; row++) {
      for (let col = 0; col < tilesGrid[0].length; col++) {
        if (!tilesGrid[row][col].animal) out.push({row, col})
      }
    }
    return out
  }
  return restriction.filter(({row, col}) => !tilesGrid[row][col].animal)
})


const hasAnimalMoved = ref(false);

const assemblies = computed(() => {
  if (props.isGate) {
    return modules.activeAssemblies.filter(assembly => !assembly.deployed && assemblyMeetsRequirements(assembly, "animal", "move"))
  } else {
    return (tiles.selectedSubject.value.assemblies || []).filter(assembly => assemblyMeetsRequirements(assembly, "animal", "move"))
  }
})

const selectedAssemblyIndex = ref(0)
const selectedTileIndex = ref(0)

const moveErrorsList = computed(() => {
  if (!hasAnimalMoved.value) {
    let errs = []
    if (validAnimalDestTiles.value.length === 0) errs.push('No available destination tiles.')
    if (assemblies.value.length === 0) {
      errs.push('No eligible assemblies: none meet requirements')
    }
    return errs
  }
  return []
})
const requiredModules = computed(() => getRequirements('animal', 'move'));
const moduleMatches = computed(() =>
    getMatchingModuleNames(requiredModules.value, modules.availableModules)
);
function moveAnimal() {
  const animal = selectedAnimal
  const assembly = assemblies.value[selectedAssemblyIndex.value]
  const dest = validAnimalDestTiles.value[selectedTileIndex.value]
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

  destTile.animal = {...animal}
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(assembly)
  props.setFeedbackMsg("Move Animal Instruction Received");
  hasAnimalMoved.value = true;
}
</script>

<template>
  <div>
    <div v-if="selectedAnimal">
      {{ selectedAnimal.type }}
      <button @click="moveAnimal" :disabled="hasAnimalMoved || moveErrorsList.length > 0">Move Animal</button>
      <span class="btn-error" v-if="!hasAnimalMoved">{{ moveErrorsList.join(', ') }}</span>
      <select id="destinationTiles" v-model="selectedTileIndex">
        <option v-for="(tile, i) in validAnimalDestTiles" :key="i" :value="i">
          {{ tile.row + 1 }},{{ tile.col + 1 }}
        </option>
      </select>
      <select id="assemblyToUse" v-model="selectedAssemblyIndex">
        <option v-for="(assembly, i) in assemblies" :key="assembly.id" :value="i">
          {{ assembly.name }}
        </option>
      </select>
      <ModuleRequirementsTable :matches="moduleMatches" />

    </div>
    <div v-else>
      No animal selected
    </div>
  </div>
</template>


<style scoped>

</style>