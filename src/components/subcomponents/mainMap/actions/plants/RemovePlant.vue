<script setup>
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import { plantsStore } from '/stores/plantsStore.js'
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
const plants = plantsStore()

const selectedPlant = computed(() => tile.value.plant)
const plantDef = computed(() => plants.plantTypes.find(a => a.type === selectedPlant.value.type)
)
const currentStage = computed(() => selectedPlant.value.growthStage)

const plantHarvestKey = computed(() => selectedPlant.value.type)

// Find assemblies on tile with actions that meet requirements
const eligibleAssemblies = computed(() => {
  const assembliesWithActions = (tile.value.assemblies || []).filter(a => a.actions > 0)
  return assembliesWithActions.filter(a =>
      assemblyMeetsRequirements(a, "harvest", plantHarvestKey.value)
  )
})

const deployableAssemblies = computed(() => {
  const validAssemblies = (modules.activeAssemblies || []).filter(a => !a.deployed && a.actions > 0)
  return validAssemblies.filter(a =>
      assemblyMeetsRequirements(a, "harvest", plantHarvestKey.value)
  )
})

const requiredModules = computed(() => getRequirements('harvest', plantHarvestKey.value) || [])
const moduleMatches = computed(() =>
    getMatchingModuleNames(requiredModules.value, modules.availableModules || [])
)

const unmetConditions = computed(() => {
  const msgs = []
  if (!selectedPlant.value) {
    msgs.push("No plant on this tile.")
  }
  if (eligibleAssemblies.value?.length === 0) {
    msgs.push("No eligible assemblies on this tile.")
  }
  return msgs
})

const selectedAssemblyIndex = ref(0)

function harvestPlant() {
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  assembly.actions--

  // What material are we getting from this plant?
  const materialKey = plantDef.value.plantMaterialKey
  console.log('materialKey: ' + materialKey)
  const materialName = materialKey?.charAt(0).toUpperCase() + materialKey?.slice(1)
  const label = `${materialName} (${plantDef.value.type})`

  if (materialKey === 'waste' || !materialKey) {
    gameState.waste += 1
    props.setFeedbackMsg(`Plant removed: ${plantDef.value.type} → Waste pile`)
  } else if (plants.products[materialKey]) {
    // Add the product version to market.harvestedProducts
    let existing = market.harvestedProducts?.find(p => p.type === materialKey && p.label === label)
  if (existing) {
    existing.qty += 1
  } else {
    if (!market.harvestedProducts) market.harvestedProducts = []
    market.harvestedProducts.push({
        type: materialKey,
        icon: plants.products[materialKey].icon,
      label,
        basePrice: plants.products[materialKey].basePrice,
        shelfLife: plants.products[materialKey].shelfLife,
      qty: 1
    })
  }
    props.setFeedbackMsg(`Harvested plant: ${label}`)
  } else {
    // No product found, treat as waste.
    gameState.waste += 1
    props.setFeedbackMsg(`Plant removed: ${plantDef.value.type} → Waste pile`)
  }

  tile.value.plant = null

}
</script>

<template>
  <div class="action-area">
    <h4>Remove Plant</h4>
    <div v-if="!selectedPlant">
      <span class="error-msg">No plant on this tile.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ plantDef?.icon }} {{ plantDef?.type }}</strong>
        <span v-if="plantDef?.growthStages && currentStage">({{ currentStage }})</span>
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
          <button class="harvest-btn" @click="harvestPlant">
            Remove {{ plantDef.type }}
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
