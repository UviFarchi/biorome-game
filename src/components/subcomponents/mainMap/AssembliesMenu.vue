<script setup>
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import {modulesStore} from '/stores/modulesStore.js'
import {tilesStore} from '/stores/tilesStore.js'
import eventBus from "@/eventBus.js"
import Move from "@/components/subcomponents/mainMap/actions/assemblies/Move.vue"
import ApplyFertilizer from "@/components/subcomponents/mainMap/actions/assemblies/ApplyFertilizer.vue"
import ProvideFeed from "@/components/subcomponents/mainMap/actions/assemblies/ProvideFeed.vue"
import {assemblyMeetsRequirements, canAssemblyMoveAlone} from "@/rules/utils.js"
import TransportAssembly from "@/components/subcomponents/mainMap/actions/assemblies/TransportAssembly.vue";
import BuildAssembly from "@/components/subcomponents/mainMap/actions/assemblies/BuildAssembly.vue";

const modules = modulesStore()
const tiles = tilesStore()
const mode = ref('normal')
const actionToggle = ref('tile') // 'tile' or 'station'
const feedbackMsg = ref([])
const tile = computed(() => tiles.selectedSubject.value)
const prevMode = ref(mode.value)

onMounted(() => eventBus.on('menus-mode', changeMode))
onBeforeUnmount(() => eventBus.off('menus-mode', changeMode))

function changeMode(e) {
  if (prevMode.value === 'normal' && e === 'action') {
    actionToggle.value = tile.value ? 'tile' : 'station'
  }
  mode.value = e
  prevMode.value = e
  feedbackMsg.value = []
}

// Automatically show station assemblies if no tile is selected
watch(tile, (val) => {
  if (!val) actionToggle.value = 'station'
})

// Assemblies not deployed (at the station)
const stationAssemblies = computed(() => modules.activeAssemblies.filter(a => !a.deployed))
// Assemblies on the selected tile
const tileAssemblies = computed(() => tile.value?.assemblies || [])


const showingStation = computed(() => !tile.value || actionToggle.value === 'station')
const currentAssemblies = computed(() => showingStation.value ? stationAssemblies.value : tileAssemblies.value)
const currentTitle = computed(() => showingStation.value ? 'Assemblies at Station' : 'Assemblies on this Tile')
const emptyText = computed(() => showingStation.value ? 'No assemblies at station.' : 'No assemblies on this tile.')
// Toggle between tile and station views if a tile is selected
function toggleMode() {
  if (!tile.value) return
  actionToggle.value = actionToggle.value === 'tile' ? 'station' : 'tile'
}

// Requirements helpers


function canFertilize(assembly) {
  return assemblyMeetsRequirements(assembly, 'sowing', 'fertilize')
}

function canFeed(assembly) {
  return assemblyMeetsRequirements(assembly, 'animal', 'feed')
}

function canTransport(assembly) {
  return assemblyMeetsRequirements(assembly, 'assemblies', 'transportAssembly')
}

function canBuild(assembly) {
  return assemblyMeetsRequirements(assembly, 'assemblies', 'buildAssembly')
}



</script>

<template>
  <div class="assemblies-menu-root">
    <button class="assemblyAreaButton" @click="eventBus.emit('nav', 'assembly')">
      Go to Assemblies Area
    </button>
    <div v-if="tile" class="toggle-col">
      <button class="toggle-btn" @click="toggleMode">
        View {{ actionToggle === 'tile' ? 'Station Assemblies' : 'Assemblies on this Tile' }}
      </button>
    </div>

    <div class="assemblies-section">
      <h4>{{ currentTitle }}</h4>

      <div v-for="assembly in currentAssemblies" :key="assembly.id" class="assembly-block">
        <div class="assembly-name">{{ assembly.name || 'Assembly' }}</div>

        <div class="actions-row">
          <Move v-if="canAssemblyMoveAlone(assembly)" :assembly="assembly" />
          <ApplyFertilizer v-if="canFertilize(assembly)" :assembly="assembly" />
          <ProvideFeed v-if="canFeed(assembly)" :assembly="assembly" />
          <TransportAssembly v-if="canTransport(assembly)" :assembly="assembly" />
          <BuildAssembly v-if="canBuild(assembly)" :assembly="assembly" />
        </div>
      </div>

      <div v-if="currentAssemblies.length === 0" class="empty">{{ emptyText }}</div>
    </div>

  </div>
</template>

<style scoped>
.assemblies-menu-root {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  background: #f5f5f5;
}

.toggle-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #e0f7fa;
  min-width: 64px;
  max-width: 64px;
  height: 100%;
  padding: 0;
  border-radius: 10px 0 0 10px;
  box-shadow: 1px 0 4px #00796b22;
  margin-right: 0.5em;
}

.toggle-btn {
  flex: 1 1 auto;
  border-radius: 10px 0 0 10px;
  border: none;
  background: #00bcd4;
  color: #fff;
  font-weight: bold;
  font-size: 1.12em;
  padding: 1.1em 0.2em;
  cursor: pointer;
  writing-mode: vertical-rl;
  text-align: center;
  letter-spacing: 0.08em;
  transition: background 0.2s;
}

.toggle-btn:hover {
  background: #0097a7;
}

.assemblies-section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 1em;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}
.assembly-block {
  display: grid;
  grid-template-columns: 1fr;        /* explicit single column */
  grid-template-rows: auto auto;     /* title, actions */
  row-gap: 0.5em;
  background: #f9fbe7;
  border-radius: 8px;
  padding: 0.5em 1em;
  width: max-content;
  box-shadow: 0 1px 4px rgba(60,60,60,0.05);
}

.assembly-name {
  grid-row: 1;
  grid-column: 1;
  justify-self: center;
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  font-size: 1.05em;
}

.actions-row {
  grid-row: 2;
  display: grid;
  grid-auto-flow: column;            /* one column per control */
  grid-auto-columns: max-content;
  column-gap: 0.6em;
  align-items: start;
  white-space: nowrap;
}

/* errors from action components go on their own line inside the actions grid */
.actions-row .btn-error {
  grid-column: 1 / -1;
  grid-row: 2;
  margin-top: 0.25em;
}





.assemblies-section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 1em;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.assembly-block button:hover {
  background: #43a047;
  color: #fff;
}

.assembly-block button:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}

.assembly-block select {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 70px;
  margin-top: 0.1em;
}

.empty {
  color: #888;
  font-style: italic;
  align-self: center;
}
</style>
