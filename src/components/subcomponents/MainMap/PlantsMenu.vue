<script setup>
import { ref } from 'vue'
import { plantsStore } from '/stores/plantsStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'

const plants = plantsStore()
const tiles = tilesStore()
const gameState = gameStateStore()

function buy(plant, plantingType) {
  // Get cost based on planting type
  const cost =
      plantingType === 'Seed'
          ? plant.seedCost
          : plant.seedlingCost

  if (gameState.gold < cost) {
    alert('Not enough gold!')
    return
  }

  // Add to gate (like animals)
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
  <div class="verticalMenuArea">
    <div class="verticalMenuScroll">
      <div
          v-for="plant in plants.plantTypes"
          :key="plant.type"
          class="verticalMenuCard"
      >
        <span class="verticalMenu-icon">{{ plant.icon }}</span>
        <span class="verticalMenu-type">{{ plant.type }}</span>
        <div class="deploy-buttons">
          <button
              class="buyBtn"
              @click="buy(plant, 'Seed')"
          >
            Seed — {{ plant.seedCost }}💰
          </button>
          <button
              class="buyBtn"
              @click="buy(plant, 'Seedling')"
          >
            Seedling — {{ plant.seedlingCost }}💰
          </button>
        </div>
      </div>
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
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 4px #0001;
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
  flex-direction: column;
  gap: 0.4em;
  width: 100%;
  align-items: stretch;
  margin-top: 0.7em;
}
.buyBtn {
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #222;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.14s;
}
.buyBtn:hover {
  background: #00bcd4;
  color: #fff;
}
</style>
