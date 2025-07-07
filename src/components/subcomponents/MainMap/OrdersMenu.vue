<script setup>
import eventBus from "@/eventBus.js";
import {computed, ref} from "vue";
defineProps({
  items: {
    type: Array,
    required: true
  }
})



import { marketStore } from '/stores/marketStore.js'
const market = marketStore()
const harvested = computed(() => market.harvestedProducts)
</script>

<template>
  <div class="bottomMenuArea" >
    <button class="MarketAreaButton" @click="eventBus.emit('nav', 'market')">
      Go to Market Area
    </button>

    <div class="harvestedArea">
      <strong>Harvested Products:</strong>
      <template v-if="harvested.length">
        <div class="harvestedList">
          <span v-for="prod in harvested" :key="prod.type" class="harvestedItem">
            {{ prod.icon }} {{ prod.type }} &times;{{ prod.qty }}
          </span>
        </div>
      </template>
      <span v-else class="empty">No harvests yet.</span>
    </div>

    <div class="bottomMenuScroll">
      <div
          v-for="item in items"
          :key="item.id"
          class="bottomMenuCard"
      >
        <div class="orderHeader">
          <span class="villagerName">{{ item.villagerName }}</span>
          <span class="orderType">{{ item.type }}</span>
        </div>
        <div class="dueDate">Due: {{ item.dueDateString }}</div>
        <div class="orderItems">
          <span v-for="req in item.requestedItems" :key="req">{{ req }}</span>
        </div>
      </div>
      <div v-if="!items || items.length === 0" class="empty">
        No accepted orders yet.
      </div>
    </div>
  </div>
</template>


<style scoped>
.bottomMenuArea {
  border-top: 2px solid #b2dfdb;
  background: #e0f7fa;
  padding: 0.5rem 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 88px;
  z-index: 100;
}

.bottomMenuScroll {
  display: flex;
  flex-direction: row;
  gap: 1.2em;
  overflow-x: auto;
  padding: 0 1.2em;
}

.bottomMenuCard {
  flex: 0 0 185px;
  background: #fff;
  border-radius: 8px;
  min-height: 70px;
  margin: 0.4rem 0;
  padding: 0.7rem 1rem;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.orderHeader {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.villagerName {
  font-weight: bold;
  font-size: 1.1em;
}

.orderType {
  font-size: 0.95em;
  color: #558b2f;
  margin-left: auto;
  padding-left: 1em;
}

.dueDate {
  font-size: 0.98em;
  margin-top: 0.2em;
  color: #00796b;
}

.orderItems {
  margin-top: 0.3em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  font-size: 0.97em;
}
.empty {
  color: #888;
  font-style: italic;
  align-self: center;
}

.harvestedArea {
  padding: 0.7em 1.2em 0.1em 1.2em;
  font-size: 1.04em;
  background: #f3fbe9;
  border-bottom: 1px solid #b2dfdb;
}
.harvestedList {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  margin-top: 0.1em;
}
.harvestedItem {
  background: #fffde7;
  padding: 0.1em 0.8em;
  border-radius: 7px;
  font-size: 1em;
  border: 1px solid #ffd60088;
}

</style>
