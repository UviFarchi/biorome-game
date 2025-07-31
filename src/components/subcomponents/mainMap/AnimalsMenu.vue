<script setup>
import eventBus from '@/eventBus.js'
import HarvestProduct from '@/components/subcomponents/mainMap/actions/animals/HarvestAnimalProduct.vue'
import MoveAnimal from '@/components/subcomponents/mainMap/actions/animals/Move.vue'
import SetCollar from '@/components/subcomponents/mainMap/actions/animals/SetCollar.vue'
import { animalsStore } from '/stores/animalsStore.js'
import { gameStateStore } from "../../../../stores/gameStateStore.js"
import { tilesStore } from '/stores/tilesStore.js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const animals = animalsStore()
const tiles = tilesStore()
const gameState = gameStateStore();

const isGate = computed(() => !tiles.selectedSubject.value.hasOwnProperty('row'))
const mode = ref('normal')
const feedbackMsg = ref([])

function setFeedbackMsg(msg) { feedbackMsg.value.push(msg) }

function buy(animal) {
  tiles.gate.animals.push({...animal, dateDeployed: gameState.day})
  gameState.gold -= animal.cost
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
</script>

<template>
  <div class="menu-panel">
    <div class="scroll-area">
      <template v-if="mode === 'normal'">
        <div
            v-for="animal in animals.animalTypes"
            :key="animal.type"
            class="card card--horizontal"
        >
          <span class="verticalMenu-icon">{{ animal.icon }}</span>
          <span class="verticalMenu-type">{{ animal.type }}</span>
          <span class="verticalMenu-cost">{{ animal.cost }}💰</span>
          <button class="btn btn--buy" :disabled="gameState.gold < animal.cost" @click="buy(animal)">
            Buy
          </button>
        </div>
      </template>
      <template v-else-if="mode === 'action'">
        <div v-if="tiles.selectedSubject.value.animal">
          <div v-if="feedbackMsg.length > 0" class="feedback-msg">
            <span v-for="msg in feedbackMsg">{{msg}}</span>
          </div>
          <MoveAnimal class="action-area" :is-gate="isGate" :set-feedback-msg="setFeedbackMsg"/>
          <SetCollar class="action-area" :set-feedback-msg="setFeedbackMsg"/>
          <HarvestProduct class="action-area" v-if="!isGate" :set-feedback-msg="setFeedbackMsg"/>
        </div>
        <div v-else>
          No animal in this tile
        </div>
      </template>
    </div>
  </div>
</template>


<style scoped>
.verticalMenuCard {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8em;
  padding: 0.4em 0.8em;
  min-height: 45px;
}

.verticalMenu-icon {
  font-size: 1.8em;
}

.verticalMenu-type {
  font-weight: bold;
  font-size: 1.1em;
}

.buyBtn {
  margin-left: auto;
  padding: 0.2em 1em;
}
.feedback-msg {
  color: #388e3c;
  font-weight: bold;
  margin-top: 0.5em;
  transition: opacity 0.3s;
}
</style>
