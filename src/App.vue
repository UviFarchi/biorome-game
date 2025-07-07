<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import StartingScreen from '@/components/StartingScreen.vue'
import MainMap from '@/components/MainMap.vue'
import AssemblyArea from '@/components/AssemblyArea.vue'
import MarketArea from "@/components/MarketArea.vue";
import { userStore } from '/stores/userStore.js'
import eventBus from '@/eventBus.js'

const user = userStore()
const currentScreen = ref(
    user.name && user.avatar && user.difficulty !== undefined ? 'main' : 'start'
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
    <AssemblyArea v-if="currentScreen === 'assembly'"/>
    <MarketArea v-if="currentScreen === 'market'"/>
  </main>
</template>
