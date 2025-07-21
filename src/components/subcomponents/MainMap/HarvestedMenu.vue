<script setup>
import eventBus from "@/eventBus.js";
import {computed, ref} from "vue";




import { marketStore } from '/stores/marketStore.js'
const market = marketStore()
const harvested = computed(() => market.harvestedProducts)
</script>

<template>


    <div class="harvestedArea">
      <strong>Harvested Products:</strong>
      <div v-if="harvested.length">
        <div class="harvestedList">
          <span v-for="prod in harvested" :key="prod.type" class="harvestedItem">
            {{ prod.icon }} {{ prod.type }} &times;{{ prod.qty }}
          </span>
        </div>
      </div>
      <span v-else class="empty">No harvests yet.</span>
    </div>

</template>


<style scoped>



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
  border-top: 2px solid #b2dfdb;
  background: #e0f7fa;
  padding: 0.5rem 0;
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
