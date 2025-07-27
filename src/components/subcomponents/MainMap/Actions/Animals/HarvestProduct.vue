<script setup>
import { ref, computed } from 'vue'
import { gameStateStore } from '/stores/gameStateStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import { canHarvestAnimalProduct, getMissingModules } from '@/rules/utils.js'

// Required props
const props = defineProps({
  selectedAnimal: { type: Object, required: true },
  tile: { type: Object, required: true } // The tile containing the animal and assemblies
})

const gameState = gameStateStore()
const animals = animalsStore()

// Find the product from the animal's definition in store
const animalProduct = computed(() =>
    animals.products.find(p => p.key === props.selectedAnimal.product)
)

// Game day for harvest logic
const today = computed(() => gameState.day)

// Calculate eligible assemblies for harvesting this product
const eligibleAssemblies = computed(() =>
    (props.tile.assemblies || []).filter(a =>
        a.actions > 0 && canHarvestAnimalProduct(props.tile, a.id, animalProduct.value, today.value)
    )
)

// If none are eligible, get the missing modules for one of the assemblies (or just list all requirements)
const missingModules = computed(() => {
  if (eligibleAssemblies.value.length) return []
  // If no assemblies at all, or all fail, list requirements for the product
  // We'll use getMissingModules on the *first* assembly (if present), otherwise an empty object
  const assemblies = props.tile.assemblies || []
  if (assemblies.length) {
    // Show missing for the first one
    return getMissingModules(assemblies[0], animalProduct.value.key.charAt(0).toUpperCase() + animalProduct.value.key.slice(1))
  } else {
    // Show all requirements for the product (as strings)
    // We'll need a helper, but for now just do:
    // You can use requirements.harvest[productKey] if you want, or add a new util
    return [] // Add your logic here if desired
  }
})

// Harvest cooldown, frequency etc
const freq = computed(() =>
    props.selectedAnimal.outputFrequency || animalProduct.value?.outputFrequency || 1
)
const nextHarvest = computed(() =>
    typeof props.selectedAnimal.nextHarvest === 'number'
        ? props.selectedAnimal.nextHarvest
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

  // Find product in market (or whatever your output area is)
  // Here just show an alert or add your own logic to actually "give" the player the product

  // Set next harvest day for animal
  props.selectedAnimal.nextHarvest = today.value + freq.value
  // Optionally, show a notification or effect
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
        <div v-else class="error-msg">
          No eligible assemblies. Required modules:
          <ul>
            <li v-for="(missing, i) in missingModules" :key="i">
              {{ missing }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animal-action-section { margin: 1.1em 0 1.3em 0; }
.error-msg { color: #c62828; font-size: 1em; margin-top: 0.5em; }
.cooldown-msg { color: #fbc02d; margin: 0.6em 0; }
.harvest-btn {
  margin-left: 1em;
  background: #aed581;
  border: none;
  border-radius: 6px;
  padding: 0.4em 1.2em;
  font-weight: bold;
  cursor: pointer;
}
.product-icon { margin-left: 0.6em; font-size: 1.2em; }
select { margin-left: 0.7em; }
</style>
