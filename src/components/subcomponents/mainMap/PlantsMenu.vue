<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { plantsStore } from '/stores/plantsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import eventBus from '@/eventBus.js'

import SowPlant from '@/components/subcomponents/mainMap/actions/plants/Sow.vue'
import HarvestPlant from '@/components/subcomponents/mainMap/actions/plants/HarvestPlantProduct.vue'

const plants = plantsStore()
const tiles = tilesStore()
const gameState = gameStateStore()

const mode = ref('normal')
const isGate = computed(() => !tiles.selectedSubject.value.hasOwnProperty('row'))
const feedbackMsg = ref([])

function setFeedbackMsg(msg) {
  feedbackMsg.value.push(msg)
}

function changeMode(e) {
  mode.value = e
  feedbackMsg.value = []
}

onMounted(() => {
  eventBus.on('menus-mode', changeMode)
})

onBeforeUnmount(() => {
  eventBus.off('menus-mode', changeMode)
})

function buy(plant, plantingType) {
  const cost = plantingType === 'seed' ? plant.seedCost : plant.seedlingCost

  if (gameState.gold < cost) {
    alert('Not enough gold!')
    return
  }

  tiles.gate.plants = tiles.gate.plants || []
  tiles.gate.plants.push({
    ...plant,
    plantingType,
    growthStage: plantingType
  })
  gameState.gold -= cost
}
</script>

<template>
  <div class="menu-panel">
    <div class="scroll-area">
      <template v-if="mode === 'normal'">
        <template v-for="category in ['annuals', 'perennials']" :key="category">
          <div
              v-for="plant in plants.plantTypes[category]"
              :key="plant.type"
              class="card card--vertical"
          >
            <span class="verticalMenu-icon">{{ plant.icon }}</span>
            <span class="verticalMenu-type">{{ plant.type }}</span>
            <div class="deploy-buttons">
              <button class="btn btn--buy" @click="buy(plant, 'seed')">
                Seed: {{ plant.seedCost }}💰
              </button>
              <button class="btn btn--buy" @click="buy(plant, 'seedling')">
                Seedling: {{ plant.seedlingCost }}💰
              </button>
            </div>
          </div>
        </template>
      </template>

      <template v-else-if="mode === 'action'">
        <div v-if="isGate">
          <SowPlant class="action-area" :set-feedback-msg="setFeedbackMsg" />
        </div>
        <div v-else>
          <div v-if="feedbackMsg.length > 0" class="feedback-msg">
            <span v-for="msg in feedbackMsg" :key="msg">{{ msg }}</span>
          </div>
          <HarvestPlant class="action-area" :set-feedback-msg="setFeedbackMsg" />
        </div>
      </template>
    </div>
  </div>
</template>


<style scoped>
.verticalMenuCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  padding: 0.7em 0.8em 0.8em 0.8em;
  min-height: 125px;
  position: relative;
  justify-content: space-between;
}
.verticalMenu-icon {
  font-size: 2em;
}
.verticalMenu-type {
  font-weight: bold;
  font-size: 1.12em;
}
.deploy-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.4em;
  width: 100%;
  align-items: stretch;
  margin-top: 0.7em;
}
</style>
