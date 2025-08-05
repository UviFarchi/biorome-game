<script setup>
import ModuleRequirementsTable from '@/components/subcomponents/mainMap/actions/ModuleRequirementsTable.vue'
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { assemblyMeetsRequirements, getRequirements, getMatchingModuleNames } from '@/rules/utils.js'
import { computed, ref, watch } from 'vue'

const tiles = tilesStore()
const selectedAnimal = tiles.selectedSubject.value.animal
const modules = modulesStore()
const props = defineProps({ setFeedbackMsg: Function, isGate: Boolean })
const showCollarUI = ref(false)
const restrictedTiles = ref([])

const collarRequirements = computed(() => getRequirements('animal', 'collar'))
const collarMatchingModules = computed(() =>
    getMatchingModuleNames(collarRequirements.value, modules.availableModules)
)

// Now: check for eligible collar assemblies both on the tile and in the pool
const tileAssemblies = computed(() => (tiles.selectedSubject.value.assemblies || []).filter(
    a => assemblyMeetsRequirements(a, "animal", "collar")
))
const poolAssemblies = computed(() => modules.activeAssemblies.filter(
    a => !a.deployed && assemblyMeetsRequirements(a, "animal", "collar")
))
const allAvailableAssemblies = computed(() => [...tileAssemblies.value, ...poolAssemblies.value])

const assignedCollarAssembly = ref(null)
const animalTile = computed(() => ({
    row: tiles.selectedSubject.value.row,
    col: tiles.selectedSubject.value.col
}))

// Used for changing restrictions
const isEditing = ref(false)

function beginCollarRestriction(editMode = false) {
  assignedCollarAssembly.value = allAvailableAssemblies.value[0]
  // If NOT at the gate, pre-select the current tile and make it non-removable
  if (!props.isGate) {
    restrictedTiles.value = [{ row: animalTile.value.row, col: animalTile.value.col }]
    // If editing, fill out the old ones (but cannot remove current tile)
    if (editMode && selectedAnimal.collar && Array.isArray(selectedAnimal.collar.restrictedTiles)) {
      restrictedTiles.value = [
        { row: animalTile.value.row, col: animalTile.value.col },
        ...selectedAnimal.collar.restrictedTiles.filter(t =>
            t.row !== animalTile.value.row || t.col !== animalTile.value.col
        )
      ].slice(0, 3)
      assignedCollarAssembly.value = modules.activeAssemblies.find(
          a => a.id === selectedAnimal.collar.assemblyId
      ) || allAvailableAssemblies.value[0]
    }
  } else {
    // At the gate: allow the player to select any 3 tiles
    restrictedTiles.value = []
    if (editMode && selectedAnimal.collar && Array.isArray(selectedAnimal.collar.restrictedTiles)) {
      restrictedTiles.value = [...selectedAnimal.collar.restrictedTiles].slice(0, 3)
      assignedCollarAssembly.value = modules.activeAssemblies.find(
          a => a.id === selectedAnimal.collar.assemblyId
      ) || allAvailableAssemblies.value[0]
    }
  }
  showCollarUI.value = true
  isEditing.value = editMode
}




function toggleTile(row, col) {
  // Don't allow unselecting the current tile
  if (row === animalTile.value.row && col === animalTile.value.col) return
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
  isEditing.value = false
  props.setFeedbackMsg("Collar Set!")
}


function removeCollar() {
  if (!selectedAnimal.collar) return
  const idx = modules.activeAssemblies.findIndex(a => a.id === selectedAnimal.collar.assemblyId)
  if (idx !== -1) modules.activeAssemblies[idx].deployed = false
  selectedAnimal.collar = null
  props.setFeedbackMsg("Collar Removed!")
}

// Cancel should always just reset and hide UI
function cancelCollarUI() {
  showCollarUI.value = false
  isEditing.value = false
  restrictedTiles.value = []
}

// Make sure that even if the animal moves, the restriction UI gets reset/closed
watch(() => tiles.selectedSubject.value.row + ',' + tiles.selectedSubject.value.col, () => {
  showCollarUI.value = false
  isEditing.value = false
  restrictedTiles.value = []
})
</script>

<template>
  <div>
    <div v-if="selectedAnimal">
      <div v-if="selectedAnimal.collar">
        <p>
          <strong>Collar:</strong> Restricted to {{ selectedAnimal.collar.restrictedTiles?.length }} tiles.
        </p>
        <button @click="removeCollar">Remove Collar</button>
        <button style="margin-left: 0.8em;" @click="beginCollarRestriction(true)">
          Change Restrictions
        </button>
      </div>
      <!-- Otherwise show the "Set" button -->
      <div v-else>
        <button
            :disabled="allAvailableAssemblies.length === 0 || (isGate && tiles.gate.animals.length === 0)"
          @click="beginCollarRestriction(false)"
        >
          Set Collar Restriction
        </button>
        <span v-if="allAvailableAssemblies.length === 0" class="collar-msg">No available collar assemblies.</span>
      </div>
    </div>

    <!-- Restriction UI -->
    <div v-if="showCollarUI">
      <div style="margin-top: 1em;">
        <div>
          Select up to 3 tiles to restrict where the animal can be.<br>
          <span style="color:#333;" v-if="!isGate">(Current tile is always restricted, can't be removed.)</span>
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
                :class="{
                  restricted: restrictedTiles.some(t => t.row === row-1 && t.col === col-1),
                  current: (row-1) === animalTile.row && (col-1) === animalTile.col
                }"
                @click="toggleTile(row-1, col-1)"
                style="width: 2em; height: 2em; display: inline-block; border: 1px solid #bbb; margin: 1px; cursor: pointer; text-align: center; line-height: 2em;"
            >
              {{ row }},{{ col }}
            </div>
          </div>
        </div>
        <button :disabled="restrictedTiles.length === 0" @click="saveRestriction">Save Restriction</button>
        <button @click="cancelCollarUI" style="margin-left: 1em;">Cancel</button>
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
.current {
  background: #80cbc4 !important;
  border-color: #00897b !important;
  font-weight: bold;
}
.collar-msg {
  color: #c62828; margin-left: 0.7em; font-size: 0.92em;
}

</style>
