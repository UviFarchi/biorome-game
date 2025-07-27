<script setup>
import {animalsStore} from '/stores/animalsStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import {gameStateStore} from "../../../../stores/gameStateStore.js";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import eventBus from "@/eventBus.js";
import MoveAnimal from './Actions/Animals/Move.vue'
import SetCollar from './Actions/Animals/SetCollar.vue';
import HarvestProduct from "@/components/subcomponents/MainMap/Actions/Animals/HarvestProduct.vue";

const animals = animalsStore()
const tiles = tilesStore()
const gameState = gameStateStore();
const mode = ref('normal')
const selectedAnimal = computed(() => tiles.selectedSubject.value.animal)
const isGate = computed(() => !tiles.selectedSubject.value.hasOwnProperty('row'))

onMounted(() => {
  eventBus.on('menus-mode', changeMode)
})
onBeforeUnmount(() => {
  eventBus.off('menus-mode', changeMode)
})

function changeMode(e) {
  mode.value = e
}

function buy(animal) {
  tiles.gate.animals.push({...animal, mood: 100, dateDeployed: gameState.day})
  gameState.gold -= animal.cost
}
</script>

<template>
  <div class="verticalMenuArea">
    <div class="verticalMenuScroll">
      <template v-if="mode === 'normal'">
        <div
            v-for="animal in animals.animalTypes"
            :key="animal.type"
            class="verticalMenuCard"
        >
          <span class="verticalMenu-icon">{{ animal.icon }}</span>
          <span class="verticalMenu-type">{{ animal.type }}</span>
          <span class="verticalMenu-cost">{{ animal.cost }}💰</span>
          <button class="buyBtn" :disabled="gameState.gold < animal.cost" @click="buy(animal)">
            Buy
          </button>
        </div>
      </template>
      <template v-else-if="mode === 'action'">
        <MoveAnimal
            :selected-animal="selectedAnimal"
            :is-gate="isGate"
        />
        <SetCollar
            :selected-animal="selectedAnimal"/>

        <HarvestProduct v-if="!isGate"
            :selected-animal="selectedAnimal"
            :tile="tiles.selectedSubject"/>
      </template>
    </div>
  </div>
</template>


<style scoped>
.verticalMenuArea {
  border: 2px solid #b2dfdb;
  border-radius: 10px;
  background: #e0f7fa;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
}

.verticalMenuScroll {
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow-y: auto;
  flex: 1 1 auto;
  padding-right: 0.5em;
}

.verticalMenuCard {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8em;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 4px #0001;
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
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

.buyBtn:hover {
  background: #00bcd4;
  color: #fff;
}

.buyBtn:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}
</style>
