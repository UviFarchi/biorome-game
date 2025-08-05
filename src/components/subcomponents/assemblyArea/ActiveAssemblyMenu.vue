<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { computed } from 'vue'

const modules = modulesStore()

// Only show assemblies that are not deployed
const assemblies = computed(() =>
    (modules.activeAssemblies ?? []).filter(a => !a.deployed)
)

function selectAssembly(assembly) {
  // Move modules into workspace for editing
  modules.currentAssembly.splice(
      0,
      modules.currentAssembly.length,
      ...assembly.modules.map(mod => ({ ...mod }))
  )
  modules.editingAssemblyName = assembly.name || ''
  modules.editingAssemblyId = assembly.id || null

  // Remove these modules from the pool
  for (const mod of assembly.modules) {
    const found = modules.availableModules.find(m =>
        m.name === mod.name &&
        m.type === mod.type &&
        (m.subtype === mod.subtype || (!m.subtype && !mod.subtype))
    )
    if (found && found.count > 0) found.count--
  }

  // Remove from activeAssemblies (by id)
  const idx = modules.activeAssemblies.findIndex(a => a.id === assembly.id)
  if (idx !== -1) modules.activeAssemblies.splice(idx, 1)
}



</script>

<template>
    <div class="assemblies-scroll">
      <div
          v-for="assembly in assemblies"
          :key="assembly.id"
          class="card assembly-card"
          @click="selectAssembly(assembly)"
      >
        <div class="assembly-name">{{ assembly.name || 'Assembly' }}</div>
        <ul class="modules-list">
          <li v-for="mod in assembly.modules" :key="mod.name">
            {{ mod.type }} {{mod.subtype ? "(" + mod.subtype + ")" : ""}}
          </li>
        </ul>
      </div>
      <div v-if="assemblies.length === 0" class="empty">No assemblies yet.</div>
    </div>

</template>

<style scoped>




.assemblies-scroll {
  display: flex;
  flex-direction: row;
  gap: 1.1em;
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 0.2em;
  flex: 8;
}
.assembly-card {
  flex: 0 0 185px;
  border-radius: 8px;
  margin-bottom: 0.3em;
  padding: 0.7rem 1rem;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
  transition: box-shadow 0.15s;
  max-height: 100%;
}
.assembly-card:hover {
  box-shadow: 0 4px 12px #00bcd455;
  background: #e0f2f1;
}
.assembly-name {
  font-weight: bold;
  font-size: 1.09em;
  margin-bottom: 0.3em;
}
.modules-list {
  margin: 0;
  padding-left: 1.1em;
  font-size: 0.98em;
}
.empty {
  color: #888;
  font-style: italic;
  align-self: center;
  padding: 1.3em 0;
}
</style>
