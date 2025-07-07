<script setup>
import { computed } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'

const modules = modulesStore()

// Only show assemblies that are not deployed
const assemblies = computed(() =>
    (modules.activeAssemblies ?? []).filter(a => !a.deployed)
)

// Load assembly into workspace for editing
function selectAssembly(assembly) {
  // Deep copy module list so edits don’t mutate the active assembly until “Save”
  modules.currentAssembly.splice(
      0,
      modules.currentAssembly.length,
      ...assembly.modules
          .map(name => modules.availableModules.find(mod => mod.name === name))
          .filter(Boolean)
          .map(mod => ({ ...mod }))
  )
  modules.editingAssemblyName = assembly.name || '' // Optionally track name
  modules.editingAssemblyId = assembly.id || null   // Optionally track id
}


</script>

<template>
  <div class="active-assemblies-menu">
    <div class="assemblies-header">
      <h3>Your Assemblies</h3>

    </div>
    <div class="assemblies-scroll">
      <div
          v-for="assembly in assemblies"
          :key="assembly.id"
          class="assembly-card"
          @click="selectAssembly(assembly)"
      >
        <div class="assembly-name">{{ assembly.name || 'Assembly' }}</div>
        <ul class="modules-list">
          <li v-for="mod in assembly.modules" :key="mod">
            {{ typeof mod === 'string' ? mod : mod.name }}
          </li>
        </ul>
      </div>
      <div v-if="assemblies.length === 0" class="empty">No assemblies yet.</div>
    </div>
  </div>
</template>

<style scoped>
.active-assemblies-menu {
  width: 100%;
  padding: 0.8em 0.2em 0 0.2em;
  background: #e0f7fa;
  border-radius: 10px;
  box-shadow: 0 1px 7px #0001;
  margin-bottom: 1em;
}
.assemblies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9em;
}
.assemblies-header h3 {
  font-size: 1.16em;
  font-weight: bold;
  margin: 0;
}

.assemblies-scroll {
  display: flex;
  flex-direction: row;
  gap: 1.1em;
  overflow-x: auto;
  padding-bottom: 0.2em;
}
.assembly-card {
  flex: 0 0 185px;
  background: #fff;
  border-radius: 8px;
  min-height: 60px;
  margin-bottom: 0.3em;
  padding: 0.7rem 1rem;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
  transition: box-shadow 0.15s;
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
