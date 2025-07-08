<script setup>
import eventBus from "@/eventBus.js";
</script>

<template>
  <div class="market-area-main">
    <div class="market-content">Market Area</div>
    <button class="return-btn" @click="eventBus.emit('nav', 'main')">Return to Map</button>
  </div>
</template>

<style scoped>
.market-area-main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.return-btn {
  margin-top: 1.5em;
  padding: 0.4em 1.2em;
  border-radius: 8px;
  border: none;
  background: #80deea;
  font-weight: bold;
  cursor: pointer;
}

.return-btn:hover {
  background: #00bcd4;
  color: #fff;
}</style>