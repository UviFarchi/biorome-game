<script setup>
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import { animalsStore } from '/stores/animalsStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import { marketStore } from '/stores/marketStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { assemblyMeetsRequirements, getMatchingModuleNames, getRequirements } from '@/rules/utils.js'
import { computed, ref } from 'vue'

const props = defineProps({
  setFeedbackMsg: Function
})

const tiles = tilesStore()
const tile = tiles.selectedSubject
const modules = modulesStore()
const market = marketStore()
const gameState = gameStateStore()
const animals = animalsStore()

const selectedAnimal = computed(() => tile.value.animal)
const animalDef = computed(() =>
    animals.animalTypes.find(a => a.type === selectedAnimal.value.type)
)
const currentStage = computed(() => selectedAnimal.value.growthStage)

const animalHarvestKey = computed(() => selectedAnimal.value.type)
console.log(animalHarvestKey)
const eligibleAssemblies = computed(() => {
  const assembliesWithActions = (tile.value.assemblies || []).filter(a => a.actions > 0)
  return assembliesWithActions.filter(a =>
      assemblyMeetsRequirements(a, "harvest", animalHarvestKey.value)
  )
})

const deployableAssemblies = computed(() => {
  const validAssemblies = (modules.activeAssemblies || []).filter(a => !a.deployed && a.actions > 0)
  return validAssemblies.filter(a =>
      assemblyMeetsRequirements(a, "harvest", animalHarvestKey.value)
  )
})

const requiredModules = computed(() => getRequirements('harvest', animalHarvestKey.value) || [])
const moduleMatches = computed(() =>
    getMatchingModuleNames(requiredModules.value, modules.availableModules || [])
)

const unmetConditions = computed(() => {
  const msgs = []
  if (!selectedAnimal.value) {
    msgs.push("No animal on this tile.")
  }
  if (eligibleAssemblies.value?.length === 0) {
    msgs.push("No eligible assemblies on this tile.")
  }
  return msgs
})

const selectedAssemblyIndex = ref(0)

function harvestAnimal() {
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  assembly.actions--

// Get current stage index for the animal
  const growthStageIndex = animalDef.value.growthStages.indexOf(selectedAnimal.value.growthStage)
  const label = animalDef.value.type.charAt(0).toUpperCase() + animalDef.value.type.slice(1) +
      (selectedAnimal.value.growthStage ? ` (${selectedAnimal.value.growthStage})` : '')

// Move animal to harvestedProducts as a product
  let existing = market.harvestedProducts?.find(a => a.type === animalHarvestKey.value && a.label === label)
  if (existing) {
    existing.qty += 1
  } else {
    if (!market.harvestedProducts) market.harvestedProducts = []
    market.harvestedProducts.push({
      type: animalHarvestKey.value,
      icon: animalDef.value.icon,
      label,
      basePrice: animalDef.value.pricesPerStage[growthStageIndex],
      shelfLife: 5,
      qty: 1
    })
  }
  props.setFeedbackMsg(
      `Harvested animal: ${label}`
  )

  tile.value.animal = null

}
</script>

<template>
  <div class="action-area">
    <h4>Take Animal to Market</h4>
    <div v-if="!selectedAnimal">
      <span class="error-msg">No animal on this tile.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ animalDef?.icon }} {{ animalDef?.type }}</strong>
        <span v-if="animalDef?.growthStages && currentStage">({{ currentStage }})</span>
      </div>
      <div v-if="unmetConditions?.length">
        <ul class="feedback-msg">
          <li v-for="msg in unmetConditions" :key="msg">{{ msg }}</li>
        </ul>
      </div>
      <div v-else>
        <div v-if="eligibleAssemblies?.length > 0">
          <label v-if="eligibleAssemblies?.length > 1">
            Use assembly:
            <select v-model="selectedAssemblyIndex">
              <option v-for="(a, i) in eligibleAssemblies" :key="a.id" :value="i">
                {{ a.name || 'Assembly' }} (actions: {{ a.actions }})
              </option>
            </select>
          </label>
          <button class="harvest-btn" @click="harvestAnimal">
            Harvest {{ animalDef.type }}
          </button>
        </div>
        <div v-if="eligibleAssemblies?.length === 0 && deployableAssemblies.length === 0 && requiredModules.length" class="error-msg">
          Required modules:
          <ul>
            <li v-for="mod in requiredModules" :key="mod">
              {{ mod.type }}<span v-if="mod.subtype"> ({{ mod.subtype }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="deployableAssemblies.length">
      <p>You have deployable assemblies that could do this job:</p>
      <ul>
        <li v-for="assembly in deployableAssemblies" :key="assembly.id">
          {{ assembly.name || 'Assembly' }} (modules: {{ assembly.modules.length }})
        </li>
      </ul>
    </div>
    <ModuleRequirementsTable :matches="moduleMatches" />
  </div>
</template>

<style scoped>
.error-msg {
  color: #c62828;
  font-size: 1em;
  margin-top: 0.5em;
}
.harvest-btn {
  margin-left: 1em;
  background: #aed581;
  border: none;
  border-radius: 6px;
  padding: 0.4em 1.2em;
  font-weight: bold;
  cursor: pointer;
}
</style>
