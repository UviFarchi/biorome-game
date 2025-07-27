<script setup>
import { computed } from 'vue'
import { effects } from '@/rules/effects.js'

const { tile } = defineProps({
  tile: { type: Object, required: true }
})
const tileEffects = computed(() => {
  const effs = []

  // Plant effects
  if (tile.plant && tile.plant.effect) {
    const effectKeys = Array.isArray(tile.plant.effect)
        ? tile.plant.effect
        : [tile.plant.effect]
    for (const key of effectKeys) {
      if (effects[key]) effs.push({ key, ...effects[key] })
    }
  }
  // Animal effects
  if (tile.animal && tile.animal.effect) {
    const effectKeys = Array.isArray(tile.animal.effect)
        ? tile.animal.effect
        : [tile.animal.effect]
    for (const key of effectKeys) {
      if (effects[key]) effs.push({ key, ...effects[key] })
    }
  }
  return effs
})
</script>


<template>
  <div class="areaModal" @click.self="$emit('close')">
    <div class="tile-modal-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h2>
        Tile ({{ tile.row + 1 }}, {{ tile.col + 1 }})
      </h2>
      <div class="tile-soil">
        <strong>Soil:</strong>
        <span class="soil-stat health">Health {{ tile.soil.health }}</span>
        <span class="soil-stat water">Water {{ tile.soil.water }}</span>
        <span class="soil-stat fertility">Fertility {{ tile.soil.fertility }}</span>
        <span class="soil-stat ph" v-if="'ph' in tile.soil">pH: {{ tile.soil.ph }}</span>
        <span class="soil-stat compaction" v-if="'compaction' in tile.soil">Compaction: {{ tile.soil.compaction }}</span>
        <br/>
        <strong>Others stats:</strong>
        <span class="other-stat weeds" v-if="'weeds' in tile">Weeds: {{ tile.weeds }}</span>
        <span class="other-stat pests" v-if="'pests' in tile">Pests: {{ tile.pests }}</span>
        <span class="other-stat pollination" v-if="'pollination' in tile">Pests: {{ tile.pollination }}</span>
        <span class="other-stat defense" v-if="'defense' in tile">Defense: {{ tile.defense }}</span>
      </div>

      <!-- Plant info -->
      <div class="tile-section">
        <strong>Plant:</strong>
        <template v-if="tile.plant">
          <span class="plant-icon">{{ tile.plant.icon }}</span>
          <span>{{ tile.plant.type }} ({{ tile.plant.growthStage }})</span>
        </template>
        <span v-else class="none">None</span>
      </div>

      <!-- Animal info -->
      <div class="tile-section">
        <strong>Animal:</strong>
        <template v-if="tile.animal">
          <span class="animal-icon">{{ tile.animal.icon }}</span>
          <span>{{ tile.animal.type }}</span>
          <span v-if="tile.animal.mood"> — Mood: {{ tile.animal.mood }}</span>
          <span v-if="tile.animal.collar"> — <em>Collar: Restricted to {{ tile.animal.collar.restrictedTiles.length }} tiles</em></span>
        </template>
        <span v-else class="none">None</span>
      </div>

      <!-- Assemblies info -->
      <div class="tile-section">
        <strong>Assemblies:</strong>
        <template v-if="tile.assemblies && tile.assemblies.length">
          <div v-for="a in tile.assemblies" :key="a.id" class="assembly-block">
            <span class="assembly-icon">{{ a.icon || '🤖' }}</span>
            <span>{{ a.name || 'Assembly' }}</span>
            <span class="modules-label">— Modules:</span>
            <span class="modules-list">
              <span v-for="mod in a.modules" :key="mod.name">{{ mod.name }}</span>
            </span>
          </div>
        </template>
        <span v-else class="none">None</span>
      </div>

      <!-- Interactions area (future implementation) -->
      <div class="tile-section interactions">
       <strong>Interactions:</strong>
        <template v-if="tileEffects.length">
          <ul>
            <li v-for="eff in tileEffects" :key="eff.key">
              <span v-if="eff.icon">{{ eff.icon }} </span>
              <span><strong>{{ eff.label }}:</strong> {{ eff.description }}</span>
            </li>
          </ul>
        </template>
        <span v-else style="color: #888;">No effects or interactions on this tile yet.</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.areaModal {
  display: flex;
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.44);
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.tile-modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 44px #0003;
  padding: 2.3em 2.5em 2em 2.5em;
  width: 100%; height: 100%;
  overflow-y: auto;
  position: relative;
  font-size: 1.08em;
  display: flex;
  flex-direction: column;
  gap: 1.15em;
}
.close-btn {
  position: absolute; top: 1.1em; right: 1.15em;
  font-size: 1.4em;
  background: none; border: none; cursor: pointer;
  color: #aaa; font-weight: bold;
}
.close-btn:hover { color: #222; }
.tile-soil {
  margin-bottom: 0.65em;
  display: flex; flex-wrap: wrap; gap: 0.95em;
  align-items: center;
}
.soil-stat { font-size: 1em; opacity: 0.97; }
.tile-section {
  margin-bottom: 0.5em;
}
.plant-icon, .animal-icon, .assembly-icon {
  font-size: 1.28em;
  margin-right: 0.23em;
}
.none { color: #bbb; margin-left: 0.3em; font-style: italic; }
.assembly-block {
  background: #fafafa;
  margin: 0.4em 0 0.4em 0;
  padding: 0.45em 0.9em;
  border-radius: 7px;
  border: 1px solid #eee;
  box-shadow: 0 1px 4px #0001;
  font-size: 1em;
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.8em;
}
.modules-label { font-weight: 400; margin-left: 0.7em; }
.modules-list { display: flex; gap: 0.25em; }
.interactions {
  background: #e0f2f1;
  border-radius: 6px;
  padding: 0.7em 1.2em;
  margin-top: 0.8em;
}

.other-stat {
  display: block;
}
</style>
