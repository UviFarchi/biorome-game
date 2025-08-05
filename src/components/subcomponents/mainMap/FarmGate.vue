<script setup>
import {marketStore} from '/stores/marketStore.js'
import {tilesStore} from "/stores/tilesStore.js";
import {computed, ref, watch, onMounted, onBeforeUnmount} from 'vue'
import eventBus from "@/eventBus.js";

const market = marketStore()
const tilesStoreInstance = tilesStore()
const gate = tilesStoreInstance.gate
const harvested = computed(() => market.harvestedProducts)

const gateItemsGrouped = computed(() => {
  const all = [...gate.animals, ...gate.plants, ...gate.extras]
  const map = {}
  all.forEach(item => {
    const key = item.type
    if (!map[key]) {
      map[key] = {...item, type: item.type, count: 1, _group: [item]}
    } else {
      map[key].count++
      map[key]._group.push(item)
    }
  })
  return Object.values(map)
})

const expandedType = ref(null)
const selectedIndividual = ref(null)

function getGateItemDisplayName(item) {
  return item.type[0].toUpperCase() + item.type.slice(1).replace('_', ' ')
}

function expandPill(type) {
  expandedType.value = expandedType.value === type ? null : type
}

function selectIndividual(item) {
  selectedIndividual.value = item
  expandedType.value = null
  let kind = gate.animals.includes(item)
      ? 'animal'
      : gate.plants.includes(item)
          ? 'plant'
          : 'extra'
  tilesStoreInstance.selectedSubject.value = {[kind]: item}
  eventBus.emit('menus-mode', 'action')
}

function handleClickAway(event) {
  if (!event.target.closest('.gate-pill')) {
    expandedType.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickAway)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickAway)
})
watch(
    () => [gate.animals, gate.plants, gate.extras],
    () => {
      if (
          selectedIndividual.value &&
          !gate.animals.includes(selectedIndividual.value) &&
          !gate.plants.includes(selectedIndividual.value) &&
          !gate.extras.includes(selectedIndividual.value)
      ) {
        selectedIndividual.value = null
        tilesStoreInstance.selectedSubject.value = {}
        eventBus.emit('menus-mode', 'normal')
      }
    },
    {deep: true}
)
</script>
<template>
  <div class="farm-gate-bar">
    <div class="gate-section">
      <div class="gate-section-header">
        <span class="gate-label">Farm Gate - IN</span>
      </div>
      <div class="gate-card-row">
        <template v-for="g in gateItemsGrouped" :key="g.type">
          <!-- Collapsed card -->
          <div
              v-if="expandedType !== g.type"
              class="gate-card"
              :class="{ selected: selectedIndividual && selectedIndividual.type === g.type }"
              @click.stop="expandPill(g.type)"
              tabindex="0"
          >
            <span> {{ g.icon }}{{ getGateItemDisplayName(g) }} x {{ g.count }}</span>
          </div>
          <!-- Dropdown card (expanded) -->
          <div
              v-else
              class="gate-card dropdown-card"
          >
            <div class="dropdown-scroll">
              <div
                  v-for="(item, i) in g._group"
                  :key="item.id || i"
                  class="gate-card subcard"
                  :class="{ selected: selectedIndividual === item }"
                  @click.stop="selectIndividual(item)"
                  tabindex="0"
              >
                <span class="card-label stage-label">
                    {{ item.growthStage ? item.growthStage : 'Ready' }}
                  <template v-if="item.health !== undefined">({{ item.health }}%)</template>
                </span>
              </div>
            </div>
          </div>
        </template>
        <span v-if="!gateItemsGrouped.length" class="empty">(empty)</span>
      </div>
      <div v-if="selectedIndividual" class="gate-item-details">
        <div><strong>{{ getGateItemDisplayName(selectedIndividual) }}</strong></div>
        <div v-if="selectedIndividual.growthStage">Stage: {{ selectedIndividual.growthStage }}</div>
        <div v-if="selectedIndividual.health !== undefined">Health: {{ selectedIndividual.health }}%</div>
      </div>
    </div>
    <div class="market-section">
      <button class="MarketAreaButton" @click="eventBus.emit('nav', 'market')">
        Go To Market
      </button>
    </div>
    <div class="gate-section out-section">
      <div class="gate-section-header">
        <span class="gate-label">Farm Gate - OUT</span>
      </div>
      <div class="gate-card-row">
        <div
            v-for="prod in harvested"
            :key="prod.type"
            class="gate-card out-card"
        >
          <span class="icon">{{ prod.icon }}</span>
          <span class="card-label">{{ prod.label }}</span>
          <span class="qty">×{{ prod.qty }}</span>
        </div>
        <span v-if="!harvested.length" class="empty">No harvests yet.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.farm-gate-bar {
  display: flex;
  width: 100%;
  max-width: 100vw;
  gap: 0.1em;
  background: #e3f2fd;
  border-radius: 1em;
  border: 2px solid #b2dfdb;
  padding: 0.7em 0.5em 0.6em 0.5em;
  margin-bottom: 1em;
height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 100;
  align-items: flex-start;
  overflow: hidden;
}

.gate-section {
  flex: 1 1 0;
  min-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
  height: 100%;
  max-width: 31vw;
  overflow: hidden;
}


.gate-section-header {
  display: flex;
  align-items: stretch;
  margin-bottom: 0.32em;
  height: 2.1em;
}

.gate-label {
  font-weight: 600;
  color: #1565c0;
  font-size: 1em;
  margin-right: 0.7em;
  margin-left: 0.2em;
  white-space: nowrap;
  line-height: 1.6em;
}

.gate-card-row {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.65em;
  overflow-x: auto;
  overflow-y: visible;
  height: 100%;
  padding-bottom: 0.15em;
  scrollbar-width: thin;
}

.gate-card-row::-webkit-scrollbar {
  height: 7px;
}

.gate-card-row::-webkit-scrollbar-thumb {
  background: #b2dfdb;
  border-radius: 8px;
}

.gate-card,
.gate-card.subcard,
.gate-card.out-card,
.gate-card.dropdown-card {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fffde7;
  border-radius: 1.15em;
  border: 2px solid #ffd60088;
  box-shadow: 0 2px 7px #ffd60022;
  padding: 0.62em 0.6em 0.55em 0.6em;
  font-size: 1.07em;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  margin-bottom: 0.08em;
  height: 70%;
  position: relative;
  transition: border 0.14s, box-shadow 0.14s, background 0.13s;
  overflow: hidden;
}

.gate-card.selected,
.gate-card:focus-within,
.gate-card.subcard.selected,
.gate-card.out-card.selected {
  border: 2.5px solid #00bcd4;
  background: #e0f7fa;
  z-index: 101;
}

.gate-card .icon,
.gate-card.subcard .icon,
.gate-card.out-card .icon {
  font-size: 2.6em;
  margin: 0;
}

.gate-card .card-label,
.gate-card.subcard .card-label,
.gate-card.out-card .card-label {
  font-size: 0.75em;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gate-card .qty,
.gate-card.out-card .qty,
.gate-card.subcard .qty {
  color: #a97e16;
  font-weight: bold;
  margin-top: 0.2em;
  font-size: 0.99em;
  text-align: center;
}

.gate-card.dropdown-card {
  background: #e0f7fa;
  border: 2px solid #00bcd4;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  cursor: default;
  z-index: 110;
  padding: 0;
  overflow: hidden;
}

.dropdown-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.12em;
  scrollbar-width: thin;
  padding-top: 0.08em;
}

.dropdown-scroll::-webkit-scrollbar {
  width: 7px;
}

.dropdown-scroll::-webkit-scrollbar-thumb {
  background: #b2dfdb;
  border-radius: 8px;
}

.gate-card.subcard {
  background: #f3fbe9;
  border-radius: 0;
  border-bottom: 2px solid #b2dfdb;
  border-top: none;
  border-left: none;
  border-right: none;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  min-height: 20px;
  height: 20px;
  max-height: 20px;
  display: flex;
  flex: 1;
}

.gate-card.subcard.selected,
.gate-card.subcard:hover {
  border: 2.5px solid #00bcd4;
  background: #e0f7fa;
}

.gate-card.subcard .stage-label,
.gate-card.subcard .card-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

.stage-label {
  font-size: 1em;
  color: #136;
  margin-bottom: 0.2em;
  margin-top: 0.04em;
  text-align: center;
  display: inline;
  width: 100%;
}

.market-section {
  flex: 0 0 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0;
  margin-top: 0;
  position: absolute;
  width: 100%;
  left: 0;
  align-items: center;
}

.MarketAreaButton {
  background: #00bcd4;
  color: #fff;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 2em;
  padding: 0.45em 2.2em;
  box-shadow: 0 2px 6px #00bcd433;
  cursor: pointer;
  transition: background 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8em;
  margin-top: 0.08em;
}

.MarketAreaButton:hover {
  background: #0097a7;
}

.out-section {
  min-width: 0;
  text-align: right;
  align-items: flex-end;
}

.empty {
  color: #bbb;
  font-style: italic;
  align-self: center;
  margin-left: 0.7em;
}

.gate-item-details {
  margin: 0.35em 0 0 0.2em;
  background: #e0f7fa;
  border-radius: 0.4em;
  padding: 0.35em 0.9em;
  color: #234;
  font-size: 0.97em;
}
</style>

