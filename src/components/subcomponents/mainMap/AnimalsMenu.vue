<script setup>
import eventBus from '@/eventBus.js'
import HarvestProduct from '@/components/subcomponents/mainMap/actions/animals/HarvestAnimalProduct.vue'
import MoveAnimal from '@/components/subcomponents/mainMap/actions/animals/Move.vue'
import SetCollar from '@/components/subcomponents/mainMap/actions/animals/SetCollar.vue'
import { animalsStore } from '/stores/animalsStore.js'
import { gameStateStore } from "../../../../stores/gameStateStore.js"
import { tilesStore } from '/stores/tilesStore.js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import HarvestAnimal from "@/components/subcomponents/mainMap/actions/animals/RemoveAnimal.vue";

const animals = animalsStore()
const tiles = tilesStore()
const gameState = gameStateStore();

const isGate = computed(() => !tiles.selectedSubject.value.hasOwnProperty('row'))
const mode = ref('normal')
const feedbackMsg = ref([])

const openBuyMenu = ref(null)
function toggleBuyMenu(animalType) {
  openBuyMenu.value = openBuyMenu.value === animalType ? null : animalType
}

function buy(animal, stageIndex) {
  tiles.gate.animals.push({
    ...animal,
    dateDeployed: gameState.day,
    growthStage: animal.growthStages[stageIndex]
  })
  gameState.gold -= animal.pricesPerStage[stageIndex]
}

function setFeedbackMsg(msg) { feedbackMsg.value.push(msg) }

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
</script>
<template>
  <div class="menu-panel">
    <div class="scroll-area">
      <template v-if="mode === 'normal'">
        <div
            v-for="animal in animals.animalTypes"
            :key="animal.type"
            class="animal-card"
        >
          <span class="animal-icon">{{ animal.icon }}</span>
          <span class="animal-type">{{ animal.type }}</span>
          <button
              class="btn btn--buy"
              @click="toggleBuyMenu(animal.type)"
          >
            Buy
          </button>
          <div v-if="openBuyMenu === animal.type" class="buy-stage-panel">
            <div
                v-for="(stage, i) in animal.growthStages"
                :key="stage"
                class="stage-row"
            >
              <button
                  class="btn btn--stage"
                  :disabled="gameState.gold < animal.pricesPerStage[i]"
                  @click="buy(animal, i); openBuyMenu = null"
              >
                {{ stage }} ({{ animal.pricesPerStage[i] }}💰)
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="mode === 'action'">
        <div v-if="tiles.selectedSubject.value.animal">
          <div v-if="feedbackMsg.length > 0" class="feedback-msg">
            <span v-for="msg in feedbackMsg">{{ msg }}</span>
          </div>
          <MoveAnimal class="action-area" :is-gate="isGate" :set-feedback-msg="setFeedbackMsg"/>
          <SetCollar class="action-area" :is-gate="isGate" :set-feedback-msg="setFeedbackMsg"/>
          <HarvestProduct class="action-area" v-if="!isGate && tiles.selectedSubject.value.animal.product" :set-feedback-msg="setFeedbackMsg"/>
          <HarvestAnimal class="action-area" v-if="!isGate" :set-feedback-msg="setFeedbackMsg"></HarvestAnimal>
        </div>
        <div v-else>
          No animal in this tile
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.animal-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fcfcfc;
  border-radius: 9px;
  margin: 1em 0;
  padding: 1em 0.5em 0.6em 0.5em;
  box-shadow: 0 2px 6px #0001;
  position: relative;
  min-width: 170px;
  max-width: 210px;
}
.animal-icon {
  font-size: 2.1em;
  margin-bottom: 0.45em;
}
.animal-type {
  font-size: 1.12em;
  font-weight: 500;
  margin-bottom: 0.32em;
}
.btn.btn--buy {
  margin-bottom: 0.6em;
  background: #e0f7fa;
  color: #236;
  border: none;
  border-radius: 6px;
  padding: 0.4em 1.2em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 1px 4px #00bcd433;
  transition: background 0.18s;
}
.btn.btn--buy:hover {
  background: #b2ebf2;
}
.buy-stage-panel {
  width: 100%;
  margin-top: 0.5em;
  background: #fafad2;
  border-radius: 6px;
  padding: 0.4em 0.5em;
  box-shadow: 0 1px 5px 0 #0001;
}
.stage-row {
  margin-bottom: 0.23em;
}
.btn.btn--stage {
  width: 100%;
  text-align: left;
  background: #fffde7;
  border: 1px solid #dbeafe;
  color: #364;
  padding: 0.36em 0.95em;
  border-radius: 5px;
  font-size: 1em;
  margin-bottom: 0.1em;
  cursor: pointer;
  transition: background 0.14s;
}
.btn.btn--stage:disabled {
  background: #eee;
  color: #999;
  cursor: not-allowed;
}
.btn.btn--stage:hover:not(:disabled) {
  background: #e0ffe7;
}
</style>
