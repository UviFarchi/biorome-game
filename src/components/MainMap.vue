<script setup>
import {computed} from 'vue'
import StatusBar from '@/components/subcomponents/MainMap/StatusBar.vue';
import AssembliesMenu from "@/components/subcomponents/MainMap/AssembliesMenu.vue";
import OrdersMenu from "@/components/subcomponents/MainMap/OrdersMenu.vue";
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
  <StatusBar/>
  <AssembliesMenu title="Available Assemblies"/>
  <AnimalsMenu/>
  <TilesGrid/>
  <OrdersMenu :items="acceptedOrdersDisplay"/>
 <PlantsMenu/>

</template>

<style scoped>

</style>