<script setup>
import {ref, computed} from 'vue'
import {tilesStore} from '/stores/tilesStore.js'
import GateModal from '@/components/subcomponents/MainMap/Modals/GateModal.vue'
import TileModal from '@/components/subcomponents/MainMap/Modals/TileModal.vue'
import eventBus from "@/eventBus.js";

const tilesStoreInstance = tilesStore()
const tiles = tilesStoreInstance.tiles
const flatTiles = computed(() => tiles.flat())
const gate = tilesStoreInstance.gate
const selectedTile = ref(null)
const selectedBiotic = ref(null)
const showGateModal = ref(false)
const showTileModal = ref(false)

function openTileModal(tile) {
  selectedTile.value = tile
  showTileModal.value = true
  eventBus.emit('menus-mode', 'action');
  console.log(tile);
  tilesStoreInstance.selectedSubject.value = tile;
}

function openGateModal(item, type) {
  showGateModal.value = true;
  selectedBiotic.value = item;
  eventBus.emit('menus-mode', 'action');
 tilesStoreInstance.selectedSubject.value = {[type] : item};
}

function closeModal() {
  showGateModal.value = false;
  showTileModal.value = false;
  eventBus.emit('menus-mode', 'normal');
  tilesStoreInstance.selectedSubject.value= {};
}
</script>

<template>
  <div class="farm-wrapper">
    <!-- Farm Gate Bar -->
    <div class="gate-bar">
      <span class="gate-label">Farm Gate:</span>
      <span
          v-for="(a, i) in gate.animals"
          :key="'a-'+i"
          class="gate-icon"
          :title="`Click to deploy ${a.type}`"
          @click="openGateModal(a, 'animal')"
      >{{ a.icon }}</span>
      <span
          v-for="(p, i) in gate.plants"
          :key="'p-'+i"
          class="gate-icon"
          :title="`Click to plant ${p.type, 'plant'}`"
          @click="openGateModal(p)"
      >{{ p.icon }}</span>
      <span v-if="!gate.animals.length && !gate.plants.length" style="color:#bbb; margin-left:1em;">(empty)</span>
    </div>
    <!-- Fields Grid -->
    <div class="fieldsGrid" v-bind="$attrs">
      <div
          v-for="tile in flatTiles"
          :key="`${tile.row},${tile.col}`"
          class="fieldTile"
          :class="{ active: selectedTile && selectedTile.row === tile.row && selectedTile.col === tile.col }"
          @click="openTileModal(tile)"
          :title="[
          `Row: ${tile.row+1}, Col: ${tile.col+1}`,
          `Soil Health: ${tile.soil.health}`,
          `Water: ${tile.soil.water}`,
          `Fertility: ${tile.soil.fertility}`
        ].join('\n')"
      >
        <div class="tileContents">
          <span v-if="tile.plant" class="tilePlant">{{ tile.plant.icon }}</span>
          <span v-if="tile.animal" class="tileAnimal">{{ tile.animal.icon }}</span>
          <span
              v-for="a in tile.assemblies"
              :key="a.id"
              class="tileAssembly"
          >{{ a.icon || '🤖' }}</span>
        </div>
        <div class="tileStats">
          Tile {{ tile.row + 1 }} , {{ tile.col + 1 }}
        </div>
      </div>
    </div>
    <GateModal v-if="showGateModal" :gate="gate" @close="closeModal" :item="selectedBiotic"/>
    <TileModal v-if="showTileModal && selectedTile" :tile="selectedTile" @close="closeModal"/>
  </div>

</template>


<style scoped>
.farm-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
}

.gate-bar {
  display: flex;
  align-items: center;
  padding: 0.3em 1em;
  background: #c8e6c9;
  font-size: 1.22em;
  gap: 0.6em;
  flex-shrink: 0;
  border-bottom: 1px solid #1b5e20;
  flex-direction: row;
  min-height: 2.2em;
  max-height: 2.4em;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  line-height: 2.4em;
}

.gate-label {
  font-weight: bold;
  color: black;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.gate-icon {
  font-size: 1.4em;
  cursor: pointer;
  margin-right: 0.25em;
  transition: filter 0.15s;
}

.gate-icon:hover {
  filter: brightness(0.8);
}

.fieldsGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 8px;
  width: 90%;
  height: 90%;
  background: #c8e6c9;
  padding: 2.5% 5%;
  justify-self: right;

}

.fieldTile {
  background: #fff;
  border-radius: 7px;
  border: 2px solid #aed581;
  min-width: 50px;
  min-height: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.05em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 #0000;
}

.tileContents {
  display: flex;
  gap: 0.1em;
}

.tilePlant, .tileAnimal, .tileAssembly {
  font-size: 1.3em;
}

.tileStats {
  display: flex;
  gap: 0.3em;
  margin-top: 1px;
  font-size: 0.85em;
  opacity: 0.82;
}

.stat.health {
  font-weight: bold;
}

.fieldTile.active {
  box-shadow: 0 0 8px 3px #ffd60099;
  border-color: #ffd600;
}

.fieldTile.restricted {
  box-shadow: 0 0 0 3px #00bcd4, 0 0 8px 3px #ffd60099;
  border-color: #00bcd4;
}
</style>
