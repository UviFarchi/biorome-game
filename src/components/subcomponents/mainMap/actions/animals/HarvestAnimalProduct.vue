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
const today = computed(() => gameState.day)

const selectedAnimal = computed(() => tile.value?.animal)
const animalDef = computed(() =>
    selectedAnimal.value
        ? animals.animalTypes.find(a => a.type === selectedAnimal.value.type)
        : null
)
const animalProductKey = computed(() => animalDef.value?.product)
const animalProduct = computed(() => animalProductKey.value ? animals.products[animalProductKey.value] : null)

const currentStage = computed(() => selectedAnimal.value?.growthStage || '')
const allowedStages = computed(() => animalDef.value?.productStages || ['adult', 'old'])

const growthStageIndex = computed(() =>
    animalDef.value ? animalDef.value.growthStages.indexOf(currentStage.value) : -1
)
const baseYield = computed(() =>
    (animalDef.value && growthStageIndex.value >= 0)
        ? animalDef.value.yieldPerStage[growthStageIndex.value]
        : 0
)

// Placeholder for future yield modifiers
const yieldModifier = computed(() => 1)

const actualYield = computed(() =>
    Math.max(0, Math.floor(baseYield.value * yieldModifier.value))
)
const inProductStage = computed(() =>
    allowedStages.value.includes(currentStage.value)
)
const freq = computed(() => animalDef.value?.outputFrequency || 1)
const nextHarvest = computed(() => typeof selectedAnimal.value?.nextHarvest === 'number'
    ? selectedAnimal.value.nextHarvest
    : today.value)
const readyToHarvest = computed(() => today.value >= nextHarvest.value)
const harvestCooldown = computed(() => readyToHarvest.value ? 0 : nextHarvest.value - today.value)

function canHarvestAnimalProduct(animal, productKey, assemblies) {
  if (!animal || !productKey || !assemblies?.length) return []
  if (!allowedStages.value.includes(currentStage.value)) return []
  if (!readyToHarvest.value) return []
  const reqs = getRequirements('harvest', productKey)
  if (!reqs) return []
  return assemblies.filter(a =>
      a.actions > 0 &&
      assemblyMeetsRequirements(a, "harvest", productKey)
  )
}

const eligibleAssemblies = computed(() => {
  if (!animalProductKey.value || !tile.value.assemblies?.length) return []
  const assembliesWithActions = tile.value.assemblies.filter(a => a.actions > 0)
  return canHarvestAnimalProduct(
      selectedAnimal.value,
      animalProductKey.value,
      assembliesWithActions
  )
})

const deployableAssemblies = computed(() => {
  if (!animalProductKey.value) return []
  const validAssemblies = modules.activeAssemblies.filter(a => !a.deployed && a.actions > 0)
  return validAssemblies.filter(a =>
      assemblyMeetsRequirements(a, "harvest", animalProductKey.value)
  )
})

const requiredModules = computed(() => {
  if (!selectedAnimal.value || !animalProductKey.value) return []

  return getRequirements('harvest', animalProductKey.value)
})
const moduleMatches = computed(() => {
  if (!selectedAnimal.value) return []
  return getMatchingModuleNames(requiredModules.value, modules.availableModules)
})

const unmetConditions = computed(() => {
  const msgs = []
  if (!selectedAnimal.value) {
    msgs.push("No animal on this tile.")
  } else if (!animalProduct.value) {
    msgs.push("No product to harvest for this animal.")
  }
  if (!allowedStages.value.includes(currentStage.value) && animalProduct.value) {
    msgs.push("Animal is not at a harvestable stage.")
  }
  if (harvestCooldown.value > 0) {
    msgs.push(`Next harvest in ${harvestCooldown.value} day(s).`)
  }
  if (eligibleAssemblies.value.length === 0) {
    msgs.push("No eligible assemblies on this tile.")
  }
  return msgs
})

const selectedAssemblyIndex = ref(0)

function harvestProduct() {
  if (!readyToHarvest.value || !allowedStages.value.includes(currentStage.value)) return
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  assembly.actions--

  let existing = market.harvestedProducts.find(p => p.type === animalProductKey.value)
  if (existing) {
    existing.qty += actualYield.value
  } else {
    market.harvestedProducts.push({
      ...animalProduct.value,
      type: animalProductKey.value,
      qty: actualYield.value
    })
  }
  selectedAnimal.value.nextHarvest = today.value + freq.value
  props.setFeedbackMsg(
      `Harvested ${actualYield.value} ${animalProduct.value.label} (stage: ${currentStage.value})`
  )
}
</script>



<template>
  <div class="action-area">
    <h4>Harvest Animal Product</h4>
    <div v-if="!selectedAnimal">
      <span class="error-msg">No animal on this tile.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ animalProduct?.label }}</strong>
        <span v-if="animalProduct?.icon" class="product-icon">{{ animalProduct.icon }}</span>
      </div>
      <div>
        <p v-if="inProductStage && harvestCooldown === 0">
          Yield: {{ actualYield }} ({{ animalProduct?.label }})
        </p>
        <p v-else-if="!inProductStage">
          Not in a harvestable stage.
        </p>
        <p v-else-if="harvestCooldown > 0">
          Not ready. Next harvest in {{ harvestCooldown }} day<span v-if="harvestCooldown > 1">s</span>.
        </p>
      </div>

      <div v-if="unmetConditions.length">
        <ul class="feedback-msg">
          <li v-for="msg in unmetConditions" :key="msg">{{ msg }}</li>
        </ul>
      </div>
      <div v-else>
        <div v-if="eligibleAssemblies.length > 0">
          <label v-if="eligibleAssemblies.length > 1">
            Use assembly:
            <select v-model="selectedAssemblyIndex">
              <option v-for="(a, i) in eligibleAssemblies" :key="a.id" :value="i">
                {{ a.name || 'Assembly' }} (actions: {{ a.actions }})
              </option>
            </select>
          </label>
          <button class="harvest-btn" @click="harvestProduct">
            Harvest {{ animalProduct.label }}
          </button>
        </div>
        <div v-if="eligibleAssemblies.length === 0 && deployableAssemblies.length === 0 && requiredModules.length" class="error-msg">
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

requiredModules
.harvest-btn {
  margin-left: 1em;
  background: #aed581;
  border: none;
  border-radius: 6px;
  padding: 0.4em 1.2em;
  font-weight: bold;
  cursor: pointer;
}

.product-icon {
  margin-left: 0.6em;
  font-size: 1.2em;
}

select {
  margin-left: 0.7em;
}
</style>
