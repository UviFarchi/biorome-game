<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import StartingScreen from '@/components/StartingScreen.vue'
import MainMap from '@/components/MainMap.vue'
import AssemblyArea from '@/components/AssemblyArea.vue'
import MarketArea from "@/components/MarketArea.vue";
import { gameStateStore } from '/stores/gameStateStore.js'
import eventBus from '@/eventBus.js'

const gameState = gameStateStore()
const currentScreen = ref(
    gameState.userName && gameState.userAvatar && gameState.difficulty !== undefined ? 'main' : 'start'
)

function handleNav(e) {
  if (['start', 'main', 'assembly', 'market'].includes(e)) {
    currentScreen.value = e
  }
}

onMounted(() => {
  eventBus.on('nav', handleNav)
})

onBeforeUnmount(() => {
  eventBus.off('nav', handleNav)
})
</script>

  <template>
    <main>
      <StartingScreen v-if="currentScreen === 'start'"/>
      <MainMap v-if="currentScreen === 'main'"  />
      <AssemblyArea v-if="currentScreen === 'assembly'" />
      <MarketArea v-if="currentScreen === 'market'" :key="currentScreen"/>
    </main>
  </template>

  <style>
  html, body, #app {
    margin: 0;
    height: 100%;
    overflow: hidden;
  }

  main {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  </style>
