<script setup>
import {ref, computed} from 'vue'
import {modulesStore} from '/stores/modulesStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import {validPlantDestTiles, canSowPlant, getMissingModules} from '@/rules/utils.js'

const props = defineProps({
  setFeedbackMsg: Function
})

const modules = modulesStore()
const tiles = tilesStore()
const selectedPlant = tiles.selectedSubject.value.plant;
const tilesGrid = tiles.tiles
const availableTiles = computed(() => {
  if (!selectedPlant) return []
  return validPlantDestTiles(selectedPlant, tilesGrid)
})

const hasPlantBeenSown = ref(false);
const assemblies = computed(() => {
  return modules.activeAssemblies.filter(assembly => !assembly.deployed && canSowPlant(assembly, selectedPlant.plantingType))

})

const selectedAssemblyIndex = ref(0)
const selectedTileIndex = ref(0)

const sowErrorsList = computed(() => {
  if (!hasPlantBeenSown.value) {
    let errs = []
    if (availableTiles.value.length === 0) errs.push('No available destination tiles.')
    if (assemblies.value.length === 0) {
      const reqs = modules.activeAssemblies.length
          ? getMissingModules(modules.activeAssemblies[0], "sowing", selectedPlant.plantingType)
          : ['No suitable assembly']
      errs.push('No eligible assemblies: ' + reqs.join(', '))
    }
    return errs
  }
})

function sowPlant() {
  const plant = selectedPlant
  const assembly = assemblies.value[selectedAssemblyIndex.value]
  const dest = availableTiles.value[selectedTileIndex.value]
  if (!dest || !assembly) return
  const destTile = tiles.tiles[dest.row][dest.col]
  if (assembly.actions < 1 || assembly.moves < 1) return
  const idx = tiles.gate.plants.indexOf(plant)
  if (idx !== -1) tiles.gate.plants.splice(idx, 1)
  const asmIdx = modules.activeAssemblies.findIndex(a => a.id === assembly.id)
  if (asmIdx !== -1) modules.activeAssemblies.splice(asmIdx, 1)

  assembly.actions--
  assembly.moves--

  destTile.plant = {...plant}
  destTile.assemblies = destTile.assemblies || []
  destTile.assemblies.push(assembly)
  props.setFeedbackMsg("Sow Plant Instruction Received");
  hasPlantBeenSown.value = true;
}
</script>

<template>
  <div>
    <div v-if="selectedPlant">
      {{ selectedPlant.type }}
      <button @click="sowPlant" :disabled="hasPlantBeenSown || sowErrorsList.length > 0">Sow Plant</button>
      <span class="btn-error" v-if="!hasPlantBeenSown">{{ sowErrorsList.join(', ') }}</span>
      <select id="destinationTiles" v-model="selectedTileIndex">
        <option v-for="(tile, i) in availableTiles" :key="i" :value="i">
          {{ tile.row + 1 }},{{ tile.col + 1 }}
        </option>
      </select>
      <select id="assemblyToUse" v-model="selectedAssemblyIndex">
        <option v-for="(assembly, i) in assemblies" :key="assembly.id" :value="i">
          {{ assembly.name }}
        </option>
      </select>
    </div>
    <div v-else>
      No plant selected
    </div>
  </div>
</template>


<style scoped>

</style>