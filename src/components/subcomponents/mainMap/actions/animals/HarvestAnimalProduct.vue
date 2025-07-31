<script setup>
import {ref, computed} from 'vue'
import {gameStateStore} from '/stores/gameStateStore.js'
import {animalsStore} from '/stores/animalsStore.js'
import {assemblyMeetsRequirements, getMatchingModuleNames, getRequirements} from '@/rules/utils.js'
import {tilesStore} from "/stores/tilesStore.js";
import {marketStore} from "/stores/marketStore.js";
import {modulesStore} from '/stores/modulesStore.js'
import ModuleRequirementsTable from "@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue";


const tiles = tilesStore();
const tile = tiles.selectedSubject;
const market = marketStore();
const modules = modulesStore();

const selectedAnimal = tiles.selectedSubject.value.animal;

const gameState = gameStateStore()
const animals = animalsStore()
const today = computed(() => gameState.day)


const animalProductKey = computed(() => selectedAnimal?.product || '')
const animalProduct = computed(() =>
    animalProductKey.value ? animals.products[animalProductKey.value] : null
)
function canHarvestAnimalProduct(animal, animalProduct, assemblies, today) {
  if (!animal || !animalProduct || !assemblies?.length) return []
  const reqs = getRequirements('harvest', animalProduct)
  if (!reqs) return []
  if (typeof animal.nextHarvest === "undefined") animal.nextHarvest = today

  // Return only assemblies that satisfy requirements and have actions left and are ready
  return assemblies.filter(a =>
      a.actions > 0 &&
      assemblyMeetsRequirements(a, "harvest", animalProduct) &&
      today >= animal.nextHarvest
  )
}
const eligibleAssemblies = computed(() => {
  if (!animalProductKey.value || tile.value.assemblies.length < 1) return [];
  const assembliesWithActions = tile.value.assemblies.filter(assembly => assembly.actions > 0)
  return canHarvestAnimalProduct(
      tile.value.animal,
      animalProductKey.value,
      assembliesWithActions,
      today.value
  );
});

const deployableAssemblies = computed(() => {
  if (!animalProductKey.value) return [];
  const validAssemblies = modules.activeAssemblies.filter(a => !a.deployed && a.actions > 0)
  return canHarvestAnimalProduct(
      tile.value.animal,
      animalProductKey.value,
      validAssemblies,
      today.value
  )
});
const requiredModules = computed(() => {
  if (eligibleAssemblies.value.length) return []
  return getRequirements('harvest', animalProductKey.value)
})
const moduleMatches = computed(() =>
    getMatchingModuleNames(requiredModules.value, modules.availableModules)
);


// Harvest cooldown, frequency etc
const freq = computed(() =>
    selectedAnimal.outputFrequency || animalProduct.value?.outputFrequency || 1
)
const nextHarvest = computed(() =>
    typeof selectedAnimal.nextHarvest === 'number'
        ? selectedAnimal.nextHarvest
        : today.value
)
const readyToHarvest = computed(() => today.value >= nextHarvest.value)
const harvestCooldown = computed(() => readyToHarvest.value ? 0 : nextHarvest.value - today.value)

// Assembly selection
const selectedAssemblyIndex = ref(0)

function harvestProduct() {
  if (!readyToHarvest.value) return
  const assembly = eligibleAssemblies.value[selectedAssemblyIndex.value]
  if (!assembly) return

  // Consume action
  assembly.actions--

  let existing = market.harvestedProducts.find(p => p.type === animalProduct.value.key)
  if (existing) {
    existing.qty += 1
  } else {
    market.harvestedProducts.push({
      ...animalProduct.value,
      qty: 1
    })
  }
  selectedAnimal.nextHarvest = today.value + freq.value
}
</script>

<template>
  <div class="animal-action-section">
    <h4>Harvest Product</h4>
    <div v-if="!animalProduct">
      <span class="error-msg">No product to harvest for this animal.</span>
    </div>
    <div v-else>
      <div>
        <strong>{{ animalProduct.label }}</strong>
        <span v-if="animalProduct.icon" class="product-icon">{{ animalProduct.icon }}</span>
      </div>
      <div v-if="harvestCooldown > 0" class="cooldown-msg">
        Not ready. Next harvest in {{ harvestCooldown }} day<span v-if="harvestCooldown > 1">s</span>.
      </div>
      <div v-else>
        <div v-if="eligibleAssemblies.length">
          <label v-if="eligibleAssemblies.length > 1">
            Use assembly:
            <select v-model="selectedAssemblyIndex">
              <option v-for="(a, i) in eligibleAssemblies" :key="a.id" :value="i">
                {{ a.name || 'Assembly' }} (actions: {{ a.actions }})
              </option>
            </select>
          </label>
          <button class="harvest-btn" @click="harvestProduct">
            Harvest {{ animalProduct.label }}
          </button>
        </div>
        <div v-if="deployableAssemblies.length">
          <br>
          You have assemblies in your pool that can do this job:
          <ul>
            <li v-for="assembly in deployableAssemblies" :key="assembly.id">
              {{ assembly.name || 'Assembly' }} (modules: {{ assembly.modules.length }})

            </li>
          </ul>
       </div>
        <div v-else-if="!eligibleAssemblies.length && !deployableAssemblies.length" class="error-msg">
          No eligible assemblies on tile or in pool. Required modules:
        </div>
        <ModuleRequirementsTable :matches="moduleMatches" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animal-action-section {
  margin: 1.1em 0 1.3em 0;
}

.error-msg {
  color: #c62828;
  font-size: 1em;
  margin-top: 0.5em;
}

.cooldown-msg {
  color: #fbc02d;
  margin: 0.6em 0;
}

.harvest-btn {
  margin-left: 1em;
  background: #aed581;
  border: none;
  border-radius: 6px;
  padding: 0.4em 1.2em;
  font-weight: bold;
  cursor: pointer;
}

.product-icon {
  margin-left: 0.6em;
  font-size: 1.2em;
}

select {
  margin-left: 0.7em;
}
</style>
