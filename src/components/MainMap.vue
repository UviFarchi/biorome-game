<script setup>

import StatusBar from '@/components/subcomponents/MainMap/StatusBar.vue';
import AssembliesMenu from "@/components/subcomponents/MainMap/AssembliesMenu.vue";
import HarvestedMenu from "@/components/subcomponents/MainMap/HarvestedMenu.vue";
import PlantsMenu from "@/components/subcomponents/MainMap/PlantsMenu.vue";
import AnimalsMenu from "@/components/subcomponents/MainMap/AnimalsMenu.vue";
import TilesGrid from "@/components/subcomponents/MainMap/TilesGrid.vue";
</script>

<template>
  <div class="main-map-wrapper">
    <StatusBar class="status-bar"/>
    <AssembliesMenu class="top-menu"/>
    <AnimalsMenu class="left-menu"/>
    <TilesGrid class="center-grid"/>
    <PlantsMenu class="right-menu"/>
    <HarvestedMenu class="bottom-menu"/>
  </div>
</template>

<style scoped>
.main-map-wrapper {
  display: grid;
  grid-template-rows: 5% 15% 65% 15%;
  grid-template-columns: 15% 70% 15%;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  grid-template-areas:
    "status-bar  status-bar   status-bar"
    "left-menu   top-menu     right-menu"
    "left-menu   center-grid  right-menu"
    "left-menu   bottom-menu  right-menu";
}

.status-bar   { grid-area: status-bar;   z-index: 10; }
.left-menu    { grid-area: left-menu;    min-width: 110px; }
.top-menu     { grid-area: top-menu;     z-index: 5; }
.right-menu   { grid-area: right-menu;   min-width: 110px; }
.bottom-menu  {
  grid-area: bottom-menu;
   align-self: stretch;
   justify-self: stretch;
}
.center-grid  { grid-area: center-grid;  z-index: 1; }

.left-menu, .right-menu, .top-menu, .bottom-menu, .center-grid {
  overflow: auto;
  max-height: 100%;
}
.top-menu {
  overflow-x: auto;
  overflow-y: hidden;
  max-height: 100%;
  height: 100%;
  width: 100%;
}
.status-bar {
  height: 100%;
  width: 100%;
}
</style>

