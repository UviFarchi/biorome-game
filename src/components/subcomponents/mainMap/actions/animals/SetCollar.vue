<script setup>
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { assemblyMeetsRequirements, getRequirements, getMatchingModuleNames } from '@/rules/utils.js'
import { computed, ref } from 'vue'


const tiles = tilesStore()
const selectedAnimal = tiles.selectedSubject.value.animal;
const modules = modulesStore()
const props = defineProps({ setFeedbackMsg: Function});


const showCollarUI = ref(false)
const restrictedTiles = ref([])

const collarRequirements = computed(() => getRequirements('animal', 'collar'))
const collarMatchingModules = computed(() =>
    getMatchingModuleNames(collarRequirements.value, modules.availableModules)
)
const availableAssemblies = computed(() =>
    modules.activeAssemblies.filter(assembly => !assembly.deployed && assemblyMeetsRequirements(assembly, "animal", "collar"))
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
  selectedAnimal.collar = {
    restrictedTiles: restrictedTiles.value.map(t => ({ ...t })),
    assemblyId: assignedCollarAssembly.value.id
  }
  assignedCollarAssembly.value.deployed = true
  showCollarUI.value = false
  props.setFeedbackMsg("Collar Set!");
}


function removeCollar() {
  if (!selectedAnimal.collar) return
  const idx = modules.activeAssemblies.findIndex(a => a.id === selectedAnimal.collar.assemblyId)
  if (idx !== -1) modules.activeAssemblies[idx].deployed = false
  selectedAnimal.collar = null
  props.setFeedbackMsg("Collar Removed!");
}
</script>

<template>
  <div>
    <div v-if="selectedAnimal">
      <div v-if="selectedAnimal.collar">
        <p>
          <strong>Collar:</strong> Restricted to {{ selectedAnimal.collar.restrictedTiles?.length || 0 }} tiles.
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
    <ModuleRequirementsTable :matches="collarMatchingModules" />
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
