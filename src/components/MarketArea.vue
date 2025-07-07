<script setup>
import eventBus from "@/eventBus.js";
</script>

<template>
  Market Area
  <button @click="eventBus.emit('nav', 'main')">Return to Map</button>

</template>

<style scoped>

</style>