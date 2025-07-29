<script setup>
import { ref, computed } from 'vue'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { plantsStore } from '/stores/plantsStore.js'
import { marketStore } from '/stores/marketStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import { canHarvestPlant, getRequiredModules } from '@/rules/utils.js'

const props = defineProps({
  setFeedbackMsg: Function
})

const tiles = tilesStore()
const tile = tiles.selectedSubject
const modules = modulesStore()
const plants = plantsStore()
const market = marketStore()
const gameState = gameStateStore()

const plant = tile.value?.plant
const today = computed(() => gameState.day)
const productEntry = computed(() => plant ? plants.plantProducts[plant.productKey] : null)

const currentStage = computed(() => plant?.growthStage || plant?.stage || '')
const fruitStage = computed(() => plant?.fruitStage || currentStage.value)
const allowedStages = ['green fruit', 'ripe', 'overripe']

// Eligible assemblies on tile
const eligibleAssemblies = computed(() => {
  if (!plant || !productEntry.value) return []
  const assembliesWithActions = tile.value?.assemblies?.filter(a => a.actions > 0) || []
  return assembliesWithActions.filter(asm => canHarvestPlant(plant, productEntry.value, asm, today.value))
})

// Deployable assemblies in pool
const deployableAssemblies = computed(() => {
  if (!plant || !productEntry.value) return []
  const pool = modules.activeAssemblies.filter(a => !a.deployed && a.actions > 0)
  return pool.filter(asm => canHarvestPlant(plant, productEntry.value, asm, today.value))
})

// Missing module requirements
const requiredModules = computed(() => {
  if (eligibleAssemblies.value.length > 0) return []
  return getRequiredModules("harvest", productEntry.value ? productEntry.value.key : '')
})

const selectedAssemblyIndex = ref(0)

// Yield and shelf life modifiers
const baseYield = computed(() => plant?.yield || 1)
const baseShelfLife = computed(() => productEntry.value?.shelfLife || 1)
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
const inHarvestWindow = computed(() => {
  if (!plant?.harvestWindows) return true
  let startDay = 1
  let daysInYear = 365
  let dayOfYear = (new Date(gameState.startDate)).setDate(today.value)
  let now = new Date(dayOfYear)
  let m = now.getMonth() + 1
  let d = now.getDate()
  return plant.harvestWindows.some(w => {
    const start = w.month * 100 + w.day
    const curr = m * 100 + d
    const end = (w.endMonth || w.month) * 100 + (w.endDay || w.day)
    return curr >= start && curr <= end
  })
})

// Feedback for unmet conditions
const unmetConditions = computed(() => {
  const msgs = []
  if (!plant) msgs.push("No plant on this tile.")
  if (!productEntry.value) msgs.push("No product defined for this plant.")
  if (!inHarvestStage.value) msgs.push("Plant is not at a harvestable stage.")
  if (!inHarvestWindow.value) msgs.push("Outside of harvest window.")
  if (eligibleAssemblies.value.length === 0)
    msgs.push("No eligible assemblies on this tile.")
  return msgs
})

const actualYield = computed(() =>
    Math.max(1, Math.floor(baseYield.value * yieldModifier.value))
)
const actualShelfLife = computed(() =>
    Math.max(1, Math.round(baseShelfLife.value * shelfLifeModifier.value))
)

function harvest() {
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  assembly.actions--

  // Harvest the fruit/product only
  let existing = market.harvestedProducts.find(p => p.key === productEntry.value.key)
  if (existing) {
    existing.qty += actualYield.value
  } else {
    market.harvestedProducts.push({
      ...productEntry.value,
      qty: actualYield.value,
      shelfLife: actualShelfLife.value
    })
  }
  // Reset fruit stage for perennials or progress for annuals
  if (plant && plant.fruitStage) {
    plant.fruitStage = 'unripe'
  }
  props.setFeedbackMsg(
      `Harvested ${actualYield.value} ${productEntry.value.label} (shelf life: ${actualShelfLife.value} days)`
  )
}
</script>

<template>
  <div class="plant-action-section">
    <h4>Harvest Plant Product</h4>
    <div v-if="!plant">
      <span class="error-msg">No plant on this tile.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ productEntry?.label }}</strong>
        <span v-if="productEntry?.icon" class="product-icon">{{ productEntry.icon }}</span>
      </div>
      <div>
        <p>Current stage: <b>{{ fruitStage }}</b></p>
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
        <div v-if="deployableAssemblies.length">
          <p>You have deployable assemblies that could do this job:</p>
          <ul>
            <li v-for="assembly in deployableAssemblies" :key="assembly.id">
              {{ assembly.name || 'Assembly' }} (modules: {{ assembly.modules.length }})
            </li>
          </ul>
        </div>
        <div v-else-if="!eligibleAssemblies.length" class="error-msg">
          No eligible assemblies. Required modules:
          <ul>
            <li v-for="mod in requiredModules" :key="mod">{{ mod }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>

</style>