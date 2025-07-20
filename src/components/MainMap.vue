<script setup>
import {computed} from 'vue'
import StatusBar from '@/components/subcomponents/MainMap/StatusBar.vue';
import AssembliesMenu from "@/components/subcomponents/MainMap/AssembliesMenu.vue";
import HarvestedMenu from "@/components/subcomponents/MainMap/HarvestedMenu.vue";
import PlantsMenu from "@/components/subcomponents/MainMap/PlantsMenu.vue";
import AnimalsMenu from "@/components/subcomponents/MainMap/AnimalsMenu.vue";
import {modulesStore} from '/stores/modulesStore.js'
import {animalsStore} from '/stores/animalsStore.js'
import {plantsStore} from '/stores/plantsStore.js'
import {marketStore} from '/stores/marketStore.js'
import {gameStateStore} from '/stores/gameStateStore.js'
import {tilesStore} from "../../stores/tilesStore.js";
import TilesGrid from "@/components/subcomponents/MainMap/TilesGrid.vue";

const modules = modulesStore()
const animals = animalsStore();
const plants = plantsStore();
const villagers = marketStore();
const game = gameStateStore();
const tiles = tilesStore();
const acceptedOrdersDisplay = computed(() =>
    villagers.acceptedOrders.map(order => {
      const villager = villagers.villagers.find(v => v.id === order.villagerId)
      const startDate = new Date(game.startDate)
      const due = new Date(startDate)
      due.setDate(due.getDate() + (order.dueDate - 1))
      const dueDateString = due.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})
      return {
        ...order,
        villagerName: villager ? villager.name : 'Unknown',
        dueDateString
      }
    })
)

</script>
<template>
  <div class="main-map-wrapper">
    <StatusBar />
    <div class="assemblies-menu-area">
      <AssembliesMenu title="Available Assemblies" />
    </div>
    <div class="center-area">
      <div class="left-menu">
        <AnimalsMenu />
      </div>
      <TilesGrid />
      <div class="right-menu">
        <PlantsMenu />
      </div>
    </div>
    <HarvestedMenu :items="acceptedOrdersDisplay" />
  </div>
</template>

<style scoped>
.main-map-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.center-area {
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}

.assemblies-menu-area {
  flex: 0 0 auto;
  margin: 0.5rem 0;
}

.left-menu,
.right-menu {
  flex: 0 0 auto;
  height: 100%;
  min-width: 170px;
  max-width: 220px;
  display: flex;
  flex-direction: column;
}

.left-menu {
  margin-right: 1rem;
}

.right-menu {
  margin-left: 1rem;
}

.left-menu :deep(.verticalMenuArea),
.right-menu :deep(.verticalMenuArea) {
  flex: 1 1 auto;
  height: 100%;
}
</style>
