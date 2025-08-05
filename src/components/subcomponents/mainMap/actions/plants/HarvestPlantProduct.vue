<script setup>
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import { gameStateStore } from '/stores/gameStateStore.js'
import { marketStore } from '/stores/marketStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { plantsStore } from '/stores/plantsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { assemblyMeetsRequirements, getRequirements, getMatchingModuleNames } from '@/rules/utils.js'
import { computed, ref } from 'vue'


const props = defineProps({
  setFeedbackMsg: Function
})

const tiles = tilesStore()
const tile = tiles.selectedSubject
const modules = modulesStore()
const plants = plantsStore()
const market = marketStore()
const gameState = gameStateStore()
const today = computed(() => gameState.day)

const plant = computed(() => tile.value?.plant)
const selectedPlant = tile.value.plant // no .value needed


const plantProductKey = computed(() => selectedPlant?.productKey)
const plantProduct = computed(() => plants.products[plantProductKey.value]) // This will throw if missing, which is what you want!

function canHarvestPlantProduct(plant, productKey, assemblies) {
  if (!plant || !productKey || !assemblies?.length) return []
  const reqs = getRequirements('harvest', productKey)
  if (!reqs) return []

  // Check if plant is at a harvestable stage
  const harvestStages = ['green fruit', 'ripe', 'overripe']
  const stage = plant.fruitStage || plant.growthStage || plant.stage
  const inStage = harvestStages.includes(stage)

  if (!inStage || !inHarvestWindow) return []

  return assemblies.filter(a =>
      a.actions > 0 &&
      assemblyMeetsRequirements(a, "harvest", productKey)
  )
}

const eligibleAssemblies = computed(() => {
  if (!plantProductKey.value || !tile.value.assemblies?.length) return []
  const assembliesWithActions = tile.value.assemblies.filter(a => a.actions > 0)
  return canHarvestPlantProduct(
      tile.value.plant,
      plantProductKey.value,
      assembliesWithActions,
      today.value
  )
})

const deployableAssemblies = computed(() => {
  if (!plantProductKey.value) return []
  const validAssemblies = modules.activeAssemblies.filter(a => !a.deployed && a.actions > 0)
  return validAssemblies.filter(a =>
      assemblyMeetsRequirements(a, "harvest", plantProductKey.value)
  )
})

// Harvest window, stage, and yield logic as before
const currentStage = computed(() => plant.value?.growthStage || plant.value?.stage || '')
const fruitStage = computed(() => plant.value?.fruitStage || currentStage.value)
const inHarvestWindow = computed(() => {
  if (!plant.value?.harvestWindows || !Array.isArray(plant.value.harvestWindows)) return true
  const simDate = new Date(gameState.startDate)
  simDate.setDate(simDate.getDate() + gameState.day)
  const m = simDate.getMonth() + 1
  const d = simDate.getDate()
  return plant.value.harvestWindows.some(window => {
    const { startMonth, startDay, endMonth, endDay } = window
    if (
        startMonth < endMonth ||
        (startMonth === endMonth && startDay <= endDay)
    ) {
      return (
          (m > startMonth || (m === startMonth && d >= startDay)) &&
          (m < endMonth || (m === endMonth && d <= endDay))
      )
    } else {
      // Window spans year-end
      return (
          (m > startMonth || (m === startMonth && d >= startDay)) ||
          (m < endMonth || (m === endMonth && d <= endDay))
      )
    }
  })
})

const allowedStages = ['green fruit', 'ripe', 'overripe']

const baseYield = computed(() => plant.value?.yield || 1)
const baseShelfLife = computed(() => plantProduct.value?.shelfLife || 1)
const yieldModifier = computed(() => {
  if (fruitStage.value === 'green fruit') return 0.7
  if (fruitStage.value === 'ripe') return 1
  if (fruitStage.value === 'overripe') return 0.5
  return 0
})
const shelfLifeModifier = computed(() => {
  if (fruitStage.value === 'green fruit') return 1.2
  if (fruitStage.value === 'ripe') return 1
  if (fruitStage.value === 'overripe') return 0.7
  return 1
})

const inHarvestStage = computed(() =>
    allowedStages.includes(fruitStage.value)
)

const actualYield = computed(() =>
    Math.max(1, Math.floor(baseYield.value * yieldModifier.value))
)
const actualShelfLife = computed(() =>
    Math.max(1, Math.round(baseShelfLife.value * shelfLifeModifier.value))
)

const selectedAssemblyIndex = ref(0)

function harvest() {
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  assembly.actions--


  let existing = market.harvestedProducts.find(p => p.key === plantProductKey.value)
  if (existing) {
    existing.qty += actualYield.value
  } else {
    market.harvestedProducts.push({
      ...plantProduct.value,
      qty: actualYield.value,
      shelfLife: actualShelfLife.value
    })
  }


  if (plant.value && plant.value.removedWhenHarvested) {
    tile.value.plant = null
    gameState.waste = (gameState.waste || 0) + 1
  } else if (plant.value && plant.value.fruitStage) {
    // Only reset fruitStage for perennials, etc.
    plant.value.fruitStage = 'vegetative'
  }

  props.setFeedbackMsg(
      `Harvested ${actualYield.value} ${plantProduct.value.label} (shelf life: ${actualShelfLife.value} days)`
  )
}

const requiredModules = computed(() => {
  if (!plant.value) return []
  return getRequirements('harvest', plantProductKey.value)
})
const moduleMatches = computed(() => {
  if (!plant.value) return []
  return getMatchingModuleNames(requiredModules.value, modules.availableModules)
});

const unmetConditions = computed(() => {
  const msgs = []
  if (!plant.value) msgs.push("No plant on this tile.")
  if (!plantProduct.value) msgs.push("No product defined for this plant.")
  if (!inHarvestStage.value) msgs.push("Plant is not at a harvestable stage.")
  if (!inHarvestWindow.value) msgs.push("Outside of harvest window.")
  // Only if all above are true, check for assemblies
  if (
    plant.value &&
    plantProduct.value &&
    inHarvestStage.value &&
    inHarvestWindow.value &&
    eligibleAssemblies.value.length === 0
  ) msgs.push("No eligible assemblies on this tile.")
  return msgs
})
</script>




<template>
  <div class="action-area">
    <h4>Harvest Plant Product</h4>
    <div v-if="!plant">
      <span class="error-msg">No plant sown on this tile.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ plantProduct?.label }}</strong>
        <span v-if="plantProduct?.icon" class="product-icon">{{ plantProduct.icon }}</span>
      </div>
      <div>
        <p>Plant stage: <b>{{ currentStage }}</b></p>
        <p>Fruit stage: <b>{{ fruitStage }}</b></p>
        <p v-if="fruitStage === 'green fruit'">
          Early harvest: Yield {{ actualYield }}, Shelf life {{ actualShelfLife }} (bonus).
        </p>
        <p v-else-if="fruitStage === 'ripe'">
          Normal harvest: Yield {{ actualYield }}, Shelf life {{ actualShelfLife }}.
        </p>
        <p v-else-if="fruitStage === 'overripe'">
          Late harvest: Yield {{ actualYield }}, Shelf life {{ actualShelfLife }} (reduced).
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
          <button class="harvest-btn" @click="harvest">
            Harvest
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
.requirements-list {
  background: #f3f9f9;
  border-radius: 6px;
  margin: 0.7em 0 1em 0;
  padding: 0.7em 1em;
}
.requirements-list ul { padding-left: 1.2em; }
.mod-name {
  background: #e0f7fa;
  color: #333;
  border-radius: 5px;
  padding: 0.13em 0.7em;
  margin-right: 0.2em;
  font-size: 0.98em;
}
.missing { color: #b22222; font-style: italic; }

</style>