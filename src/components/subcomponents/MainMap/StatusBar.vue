<script setup>
import {computed, ref} from 'vue'
import {gameStateStore} from '/stores/gameStateStore.js'
// Store instances
const gameState = gameStateStore()
import eventBus from "@/eventBus.js";


// Real date for day 1
const startDate = ref(new Date(gameState.startDate))

// Day number (current turn): If game.day is 0, it's Day 1
const dayNum = computed(() => (gameState.day ?? 0) + 1)

// Calculate in-game date by adding dayNum - 1 to startDate
const inGameDate = computed(() => {
  const date = new Date(startDate.value)
  date.setDate(date.getDate() + (dayNum.value - 1))
  return date
})


const date = computed(() =>
    inGameDate.value.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})
)


const season = computed(() => {
  const month = inGameDate.value.getMonth() + 1
  if (month === 12 || month === 1 || month === 2) return {label:'Winter', icon: "❄️"}
  if (month >= 3 && month <= 5) return {label:'Spring', icon:'🌸'}
  if (month >= 6 && month <= 8) return {label:'Summer', icon:'☀️'}
  if (month >= 9 && month <= 11) return {label:'Autumn', icon:'🍂'}
  return 'Unknown'
})

const weather = computed(() => {
  const t = gameState.temperature
  const r = gameState.rainfall
  const c = gameState.cloudCover

  // ORDER MATTERS!!!
  if (t < -5 && r === 0 && c > 0.4) return { label: "Freezing Fog", icon: "🌫️" }
  if (t < 2 && r > 2) return { label: "Snowy", icon: "❄️" }
  if (t < 2 && r > 0) return { label: "Sleet", icon: "🌨️" }
  if (t < 5 && r === 0 && c > 0.6) return { label: "Frosty", icon: "🧊" }
  if (r > 20) return { label: "Heavy Rain", icon: "🌧️" }
  if (r > 5) return { label: "Rainy", icon: "🌦️" }
  if (r > 0 && c > 0.5) return { label: "Showers", icon: "🌦️" }
  if (c > 0.85 && t > 0) return { label: "Overcast", icon: "☁️" }
  if (c > 0.6) return { label: "Cloudy", icon: "☁️" }
  if (t > 32 && r === 0) return { label: "Scorching", icon: "🔥" }
  if (t > 27 && r === 0 && c < 0.2) return { label: "Hot", icon: "🌞" }
  if (t > 22 && r === 0 && c < 0.4) return { label: "Sunny", icon: "☀️" }
  if (t < 5 && r === 0 && c < 0.2) return { label: "Frosty", icon: "🧊" }
  if (c < 0.2 && r === 0) return { label: "Clear", icon: "🌄" }
  if (c > 0.3 && c < 0.7 && r === 0) return { label: "Partly Cloudy", icon: "🌤️" }
  // Default fallback
  return { label: "Mild", icon: "🌤️" }
})

const weatherTooltip = computed(() =>
    `Weather affects soil, plants, and animals
Temp: ${gameState.temperature}°C
Rain: ${gameState.rainfall}mm
Cloud: ${Math.round(gameState.cloudCover * 100)}%`
)

// Player info
const userName = computed(() => gameState.userName)
const userAvatar = computed(() => gameState.userAvatar)

// Gold
const gold = computed(() => gameState.gold)
</script>

<template>
  <div id="statusBarWrapper">
    <div id="gameLogo" class="statusBarCell" @click="eventBus.emit('nav', 'start')">
      <img src="../../../assets/logo.png" alt="Biorome, the game"/>
    </div>
    <div id="player" title="Your name and avatar" class="statusBarCell">
      {{ userName }} {{ userAvatar }}
    </div>
    <div id="day" title="Current day in your game" class="statusBarCell">
      📅{{ date }}
    </div>
    <div id="season" title="Season affects plant growth and villager requests" class="statusBarCell">
      {{ season.icon }}{{season.label}}
    </div>
    <div id="weather" :title="weatherTooltip" class="statusBarCell">
      {{ weather.icon }}{{ weather.label }}
    </div>
    <div id="gold" title="Gold: Earned from orders, spend to add plants/animals" class="statusBarCell">
      💰{{ gold }}
    </div>
    <button class="assemblyAreaButton" @click="eventBus.emit('nav', 'assembly')">
      Go to Assembly Area
    </button>
    <button class="MarketAreaButton" @click="eventBus.emit('nav', 'market')">
      Go to Market Area
    </button>
  </div>
</template>

<style scoped>
#statusBarWrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  margin: 0;
  max-height: 30px;
}

#gameLogo img {
  max-height: 50px;
}

.statusBarCell {
  display: flex;
  font-weight: bold;
  border: 1px solid black;
  margin: 0;
  flex: 2;
  align-content: center;
  justify-content: center;
}
</style>
