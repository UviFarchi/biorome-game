<script setup>
import { modulesStore } from '/stores/modulesStore.js'

const emit = defineEmits(['close'])

const modules = modulesStore()
const premadeAssemblies = modules.premadeAssemblies

function selectAssembly(assembly) {
  // Convert names to module objects
  const moduleObjs = assembly.modules
      .map(name => modules.availableModules.find(m => m.name === name))
      .filter(Boolean)
      .map(m => ({ ...m })) // shallow copy, so editing one doesn't edit all
  modules.currentAssembly.splice(0, modules.currentAssembly.length, ...moduleObjs)
  emit('close')
}

function selectBlank() {
  modules.currentAssembly.splice(0, modules.currentAssembly.length)
  emit('close')
}
function close() {
  emit('close')
}
</script>

<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h2>Select a Premade Assembly</h2>
      <div class="assemblies-grid">
        <!-- Blank Assembly first -->
        <div class="assembly-card blank" @click="selectBlank">
          <div class="assembly-usage">Blank Assembly</div>
          <div class="blank-desc">(Start from scratch)</div>
        </div>
        <!-- Premade Assemblies -->
        <div
            v-for="assembly in premadeAssemblies"
            :key="assembly.usage"
            class="assembly-card"
            @click="selectAssembly(assembly)"
        >
          <div class="assembly-usage">{{ assembly.usage }}</div>
          <ul class="modules-list">
            <li v-for="mod in assembly.modules" :key="mod">{{ mod }}</li>
          </ul>
        </div>
      </div>
      <button class="close-btn" @click="close">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #e0f7fa;
  border-radius: 14px;
  box-shadow: 0 6px 32px #0003;
  padding: 2em 2.6em 2em 2.6em;
  min-width: 420px;
  max-width: 90vw;
  max-height: 86vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 1.3em;
  text-align: center;
}

.assemblies-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2em;
  justify-content: center;
  width: 100%;
}

.assembly-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px #0001;
  padding: 1.2em 1.2em 0.9em 1.2em;
  min-width: 200px;
  max-width: 260px;
  cursor: pointer;
  transition: box-shadow 0.14s, background 0.14s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.assembly-card:hover {
  background: #b2ebf2;
  box-shadow: 0 4px 18px #00bcd455;
}

.assembly-usage {
  font-weight: bold;
  font-size: 1.09em;
  margin-bottom: 0.55em;
}

.modules-list {
  margin: 0 0 0.6em 1em;
  padding: 0;
  font-size: 1em;
}

.close-btn {
  margin-top: 1.5em;
  padding: 0.39em 1.7em;
  background: #ffd600;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
}

.close-btn:hover {
  background: #ffb300;
  color: #222;
}

.assembly-card.blank {
  background: #fafafa;
  border: 2px dashed #b2dfdb;
  color: #00796b;
  justify-content: center;
  align-items: center;
  min-height: 90px;
}
.blank-desc {
  font-size: 0.97em;
  color: #888;
  margin-top: 0.3em;
}
</style>
