<script setup>
import { computed } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'
import { userStore } from '/stores/userStore.js'

const emit = defineEmits(['close'])

const modules = modulesStore()
const user = userStore()
const premadeAssemblies = modules.premadeAssemblies

// Helper to get module object by name from store
function getModuleByName(name) {
  return modules.availableModules.find(m => m.name === name)
}

// For each assembly, calculate missing modules & total buy cost
function getAssemblyStatus(assembly) {
  const missing = []
  let totalCost = 0
  for (const mod of assembly.modules) {
    const storeMod = getModuleByName(mod.name)
    if (!storeMod || (storeMod.count || 0) <= 0) {
      missing.push(mod)
      totalCost += storeMod ? storeMod.cost : 0
    }
  }
  return { missing, totalCost }
}

function canSelectAssembly(assembly) {
  return getAssemblyStatus(assembly).missing.length === 0
}

function canBuyAll(assembly) {
  const status = getAssemblyStatus(assembly)
  return status.missing.length > 0 && user.gold >= status.totalCost
}

// Buy all missing modules in this assembly
function buyAllMissing(assembly) {
  const status = getAssemblyStatus(assembly)
  if (user.gold < status.totalCost) return
  for (const mod of status.missing) {
    const storeMod = getModuleByName(mod.name)
    if (storeMod) storeMod.count = (storeMod.count || 0) + 1
  }
  user.gold -= status.totalCost
}

function selectAssembly(assembly) {
  if (!canSelectAssembly(assembly)) return
  modules.currentAssembly.splice(0, modules.currentAssembly.length, ...assembly.modules.map(m => ({ ...m })))
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
            :class="{ disabled: !canSelectAssembly(assembly) }"
        >
          <div
              class="assembly-click-area"
              @click="canSelectAssembly(assembly) ? selectAssembly(assembly) : null"
          >
            <div class="assembly-usage">{{ assembly.usage }}</div>
            <ul class="modules-list">
              <li
                  v-for="mod in assembly.modules"
                  :key="mod.name"
                  :class="{ missing: (getModuleByName(mod.name)?.count || 0) <= 0 }"
              >
                {{ mod.name }}
                <span v-if="(getModuleByName(mod.name)?.count || 0) <= 0"> (missing)</span>
              </li>
            </ul>
          </div>
          <button
              v-if="getAssemblyStatus(assembly).missing.length"
              class="buy-missing-btn"
              :disabled="!canBuyAll(assembly)"
              @click.stop="buyAllMissing(assembly)"
          >
            Buy all missing (💰{{ getAssemblyStatus(assembly).totalCost }})
          </button>
        </div>


      </div>
      <button class="close-btn" @click="close">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.assembly-card.disabled {
  opacity: 0.65;
  background: #eee;
}

.modules-list .missing {
  color: #ba2525;
  font-style: italic;
}

.buy-missing-btn {
  margin-top: 0.9em;
  background: #ffd600;
  color: #222;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  padding: 0.23em 1.3em;
  transition: background 0.15s;
}
.buy-missing-btn:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
.buy-missing-btn:not(:disabled):hover {
  background: #ffb300;
  color: #222;
}
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
