<script setup>
import { getAdjacentTiles } from '@/rules/utils.js'
import { effects } from '@/rules/effects.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, watchEffect } from 'vue'
import { plantsStore } from '/stores/plantsStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import {gameStateStore} from "/stores/gameStateStore.js";

const plants = plantsStore()
const animals = animalsStore()
const gameState = gameStateStore()

const tilesStoreInstance = tilesStore()
const {tile} = defineProps({
  tile: {type: Object, required: true}
})

const tiles = tilesStoreInstance.tiles;
const tileEffects = computed(() => {
  if (!tile) return []

  const effs = []

  // Gather all effects (except synergies) from plant and animal
  function pushEffects(effectsArr) {
    if (!effectsArr) return
    for (const eff of Array.isArray(effectsArr) ? effectsArr : [effectsArr]) {
      if (effects[eff.type]) {
        effs.push({ ...effects[eff.type], type: eff.type, strength: eff.strength || 1 })
      }
    }
  }
  pushEffects(tile.plant?.effects)
  pushEffects(tile.animal?.effects)

  // Gather all synergies from plant and animal
  let allSynergies = []
  function pushSynergies(synergiesArr) {
    if (!synergiesArr) return
    for (const syn of Array.isArray(synergiesArr) ? synergiesArr : [synergiesArr]) {
      if (syn.target) allSynergies.push(syn)
    }
  }
  pushSynergies(tile.plant?.synergies)
  pushSynergies(tile.animal?.synergies)

  // Collect all potential synergy bonuses
  let synergyBonuses = {}
  // Helper to boost effect strengths by matching targets on this or adjacent tiles
  function applySynergyBonus(source, prop) {
    if (!source) return
    for (const syn of source.synergies || []) {
      if (!syn.target) continue
      // Synergy can boost multiple targets per synergies array
      // For each target, check current tile and adjacent tiles for match
      const targets = Array.isArray(syn.target) ? syn.target : [syn.target]
      for (const t of targets) {
        // Current tile
        if (tile.plant && tile.plant.type === t) {
          // Boost every effect for this source (animal or plant) by syn.strength
          for (const eff of source.effects || []) {
            synergyBonuses[eff.type] = (synergyBonuses[eff.type] || 0) + syn.strength
          }
        }
        // Adjacent tiles
        const adjTiles = getAdjacentTiles(tile, tiles)
        for (const adj of adjTiles) {
          if (adj && adj.plant && adj.plant.type === t) {
            for (const eff of source.effects || []) {
              synergyBonuses[eff.type] = (synergyBonuses[eff.type] || 0) + syn.strength
            }
          }
        }
      }
    }
  }

  applySynergyBonus(tile.animal, 'animal')
  applySynergyBonus(tile.plant, 'plant')

  // Apply synergy bonuses to effects
  for (const eff of effs) {
    if (synergyBonuses[eff.type]) {
      eff.strength += synergyBonuses[eff.type]
      eff.description += ` (+${synergyBonuses[eff.type]} synergy)`
    }
  }

  return effs
})



// --- Handle plant health and removal ---
const plantDied = computed(() => tile.plant && tile.plant.health === 0)
if (plantDied.value) {
  tile.plant = null
  gameState.waste = (gameState.waste || 0) + 1
}

// --- Handle animal health and removal ---
const animalDied = computed(() => tile.animal && tile.animal.health === 0)
if (animalDied.value) {
  tile.animal = null
  gameState.waste = (gameState.waste || 0) + 1
}

// --- Plant state and yields ---
const plantDef = computed(() =>
    tile.plant ? plants.plantTypes.find(p => p.type === tile.plant.type) : null
)
const plantStage = computed(() => tile.plant?.growthStage || '')
const plantYield = computed(() => plantDef.value?.yield || '-')
const plantProductLabel = computed(() =>
    plantDef.value && plantDef.value.productKey ? plants.products[plantDef.value.productKey]?.label : ''
)

// --- Animal state and yields ---
const animalDef = computed(() =>
    tile.animal ? animals.animalTypes.find(a => a.type === tile.animal.type) : null
)
const animalStage = computed(() => tile.animal?.growthStage || '')
const animalYield = computed(() => {
  if (!animalDef.value || !animalDef.value.yieldPerStage) return '-'
  const idx = animalDef.value.growthStages?.indexOf(animalStage.value)
  return idx !== -1 ? animalDef.value.yieldPerStage[idx] : '-'
})
const animalProductLabel = computed(() =>
    animalDef.value && animalDef.value.product ? animals.products[animalDef.value.product]?.label : ''
)

// --- Assemblies status ---
const assembliesInfo = computed(() =>
    tile.assemblies?.map(a => ({
      ...a,
      actions: a.actions,
      moves: a.moves,
      modules: a.modules
    })) || []
)

watchEffect(() => {
  if (tile.plant && tile.plant.health === 0) {
    tile.plant = null
    gameState.waste = (gameState.waste || 0) + 1
  }
})

// Remove animal if health hits 0
watchEffect(() => {
  if (tile.animal && tile.animal.health === 0) {
    tile.animal = null
    gameState.waste = (gameState.waste || 0) + 1
  }
})

</script>


<template>
  <div class="areaModal" @click.self="$emit('close')">
    <div class="tile-modal-content">
      <button class="btn btn--close close-btn" @click="$emit('close')">×</button>
      <h2>
        Tile ({{ tile.row + 1 }}, {{ tile.col + 1 }})
      </h2>
      <div class="tile-soil">
        <strong>Soil:</strong>
        <span class="soil-stat health">Health {{ tile.soil.health }}</span>
        <span class="soil-stat water">Water {{ tile.soil.water }}</span>
        <span class="soil-stat fertility">Fertility {{ tile.soil.fertility }}</span>
        <span class="soil-stat ph" v-if="'ph' in tile.soil">pH: {{ tile.soil.ph }}</span>
        <span class="soil-stat compaction" v-if="'compaction' in tile.soil">Compaction: {{
            tile.soil.compaction
          }}</span>
        <br/>
        <strong>Others stats:</strong>
        <span class="other-stat weeds" v-if="'weeds' in tile">Weeds: {{ tile.weeds }}</span>
        <span class="other-stat pests" v-if="'pests' in tile">Pests: {{ tile.pests }}</span>
        <span class="other-stat pollination" v-if="'pollination' in tile">Pollination: {{ tile.pollination }}</span>
        <span class="other-stat defense" v-if="'defense' in tile">Defense: {{ tile.defense }}</span>
      </div>

      <!-- Plant info -->
      <div class="tile-section">
        <strong>Plant:</strong>
        <template v-if="tile.plant">
          <span class="plant-icon">{{ tile.plant.icon }}</span>
          <span>{{ tile.plant.type }} ({{ plantStage }})</span>
          <span v-if="tile.plant.health">— Health: {{ tile.plant.health }}</span>
          <div class="plant-stats">
      <span v-if="plantProductLabel">
        Yield: {{ plantYield }} {{ plantProductLabel }}
      </span>
          </div>
        </template>
        <span v-else class="none">None</span>
      </div>

      <!-- Animal info -->
      <div class="tile-section">
        <strong>Animal:</strong>
        <template v-if="tile.animal">
          <span class="animal-icon">{{ tile.animal.icon }}</span>
          <span>{{ tile.animal.type }} ({{ animalStage }})</span>
          <span v-if="tile.animal.health">— Health: {{ tile.animal.health }}</span>
          <span v-if="tile.animal.foodConsumption">— Food Consumption: {{ tile.animal.foodConsumption }}</span>

          <div class="animal-stats">
      <span v-if="animalProductLabel">
        Yield: {{ animalYield }} {{ animalProductLabel }}
      </span>
          </div>
          <span v-if="tile.animal.collar"> — <em>Collar: Restricted to {{ tile.animal.collar.restrictedTiles.length }} tiles</em></span>
        </template>
        <span v-else class="none">None</span>
      </div>

      <!-- Assemblies info -->
      <div class="tile-section">
        <strong>Assemblies:</strong>
        <template v-if="assembliesInfo.length">
          <div v-for="assembly in assembliesInfo" :key="assembly.id" class="assembly-block">
            <span class="assembly-icon">{{ assembly.icon || '🤖' }}</span>
            <span>{{ assembly.name || 'Assembly' }}</span>
            <span class="modules-label">— Modules:</span>
            <span class="modules-list">
        <span class="modules-list-items" v-for="mod in assembly.modules" :key="mod.name">
          {{ mod.type }}{{mod.subtype ? " (" + mod.subtype + ")" : ""}}
        </span>
      </span>
            <span> | Actions left: {{ assembly.actions }}</span>
            <span v-if="typeof assembly.moves !== 'undefined'"> | Moves left: {{ assembly.moves }}</span>
          </div>
        </template>
        <span v-else class="none">None</span>
      </div>


      <div class="tile-section interactions">
        <strong>Interactions:</strong>
        <template v-if="tileEffects.length">
          <ul>
            <li v-for="eff in tileEffects" :key="eff.type + (eff.source || '')">
              <span v-if="eff.icon">{{ eff.icon }} </span>
              <strong>{{ eff.type.charAt(0).toUpperCase() + eff.type.slice(1) }}</strong>
              <span v-if="eff.strength"> (strength: {{ eff.strength }})</span>:
              {{ eff.description }}
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
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.44);
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.tile-modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 44px #0003;
  padding: 2.3em 2.5em 2em 2.5em;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  font-size: 1.08em;
  display: flex;
  flex-direction: column;
  gap: 1.15em;
}

.close-btn {
  position: absolute;
  top: 1.1em;
  right: 1.15em;
  font-size: 1.4em;
}

.tile-soil {
  margin-bottom: 0.65em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.95em;
  align-items: center;
}

.soil-stat {
  font-size: 1em;
  opacity: 0.97;
}

.tile-section {
  margin-bottom: 0.5em;
}

.plant-icon, .animal-icon, .assembly-icon {
  font-size: 1.28em;
  margin-right: 0.23em;
}

.none {
  color: #bbb;
  margin-left: 0.3em;
  font-style: italic;
}

.assembly-block {
  background: #fafafa;
  margin: 0.4em 0 0.4em 0;
  padding: 0.45em 0.9em;
  border-radius: 7px;
  border: 1px solid #eee;
  box-shadow: 0 1px 4px #0001;
  font-size: 1em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8em;
}

.modules-label {
  font-weight: 400;
  margin-left: 0.7em;
}

.modules-list {
  display: flex;
  gap: 0.25em;
}

.interactions {
  background: #e0f2f1;
  border-radius: 6px;
  padding: 0.7em 1.2em;
  margin-top: 0.8em;
}

.other-stat {
  display: block;
}

.modules-list-items {
  background: #9d9ded;
  border-radius: 10px;
  padding: 5px;
}

.plant-stats, .animal-stats {
  display: block;
  margin-left: 2.2em;
  margin-top: 0.25em;
  color: #388e3c;
  font-size: 0.97em;
}
</style>
