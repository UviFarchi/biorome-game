<script setup>
import { ref, computed } from 'vue'
import { tilesStore } from '/stores/tilesStore.js'
import { modulesStore } from '/stores/modulesStore.js'
import { assemblyIsCollar } from '@/rules/utils.js'

const props = defineProps({
  selectedAnimal: { type: Object, required: true }
})

const tiles = tilesStore().tiles
const modules = modulesStore()


const showCollarUI = ref(false)
const restrictedTiles = ref([])


const availableAssemblies = computed(() =>
    modules.activeAssemblies.filter(a => !a.deployed && assemblyIsCollar(a))
)

const assignedCollarAssembly = ref(null)

function beginCollarRestriction() {
  assignedCollarAssembly.value = availableAssemblies.value[0]
  restrictedTiles.value = []
  showCollarUI.value = true
}


function toggleTile(row, col) {
  const idx = restrictedTiles.value.findIndex(t => t.row === row && t.col === col)
  if (idx !== -1) {
    restrictedTiles.value.splice(idx, 1)
  } else if (restrictedTiles.value.length < 3) {
    restrictedTiles.value.push({ row, col })
  }
}


function saveRestriction() {
  props.selectedAnimal.collar = {
    restrictedTiles: restrictedTiles.value.map(t => ({ ...t })),
    assemblyId: assignedCollarAssembly.value.id
  }
  assignedCollarAssembly.value.deployed = true
  showCollarUI.value = false
}


function removeCollar() {
  if (!props.selectedAnimal.collar) return
  const idx = modules.activeAssemblies.findIndex(a => a.id === props.selectedAnimal.collar.assemblyId)
  if (idx !== -1) modules.activeAssemblies[idx].deployed = false
  props.selectedAnimal.collar = null
}
</script>

<template>
  <div>
    <div v-if="props.selectedAnimal">
      <div v-if="props.selectedAnimal.collar">
        <p>
          <strong>Collar:</strong> Restricted to {{ props.selectedAnimal.collar.restrictedTiles?.length || 0 }} tiles.
        </p>
        <button @click="removeCollar">Remove Collar</button>
      </div>
      <!-- Otherwise show the "Set" button -->
      <div v-else>
        <button
            :disabled="availableAssemblies.length === 0"
            @click="beginCollarRestriction"
        >
          Set Collar Restriction
        </button>
        <span v-if="availableAssemblies.length === 0" class="collar-msg">No available collar assemblies.</span>
      </div>
    </div>
    <!-- Tile selection UI goes here (step 3) -->
    <div v-if="showCollarUI">
      <div style="margin-top: 1em;">
        <div>
          Click up to 3 tiles to restrict where the animal can be.
          <span v-if="restrictedTiles.length">Selected:
      <span v-for="t in restrictedTiles" :key="t.row+'-'+t.col">[{{ t.row+1 }},{{ t.col+1 }}]</span>
    </span>
        </div>
        <div class="fieldsGrid" style="margin: 0.6em 0;">
          <div
              v-for="row in 6"
              :key="row"
              style="display: flex"
          >
            <div
                v-for="col in 6"
                :key="col"
                class="fieldTile"
                :class="{ restricted: restrictedTiles.some(t => t.row === row-1 && t.col === col-1) }"
                @click="toggleTile(row-1, col-1)"
                style="width: 2em; height: 2em; display: inline-block; border: 1px solid #bbb; margin: 1px; cursor: pointer; text-align: center; line-height: 2em;"
            >
              {{ row }},{{ col }}
            </div>
          </div>
        </div>
        <button :disabled="restrictedTiles.length === 0" @click="saveRestriction">Save Restriction</button>
        <button @click="() => { showCollarUI.value = false; restrictedTiles.value = [] }" style="margin-left: 1em;">Cancel</button>
      </div>

    </div>
  </div>
</template>


<style scoped>
.restricted {
  background: #ffd54f !important;
  border-color: #fbc02d !important;
}
.collar-msg {
  color: #c62828; margin-left: 0.7em; font-size: 0.92em;
}

</style>
