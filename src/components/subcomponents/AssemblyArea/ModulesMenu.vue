<script setup>
import {ref, computed} from 'vue'
import {modulesStore} from '/stores/modulesStore.js'
import {userStore} from '/stores/userStore.js'

const modules = modulesStore()
const user = userStore()

// Group modules by type for the menu
const groupedModules = computed(() => {
  const groups = {}
  modules.availableModules.forEach(mod => {
    if (!groups[mod.type]) groups[mod.type] = []
    groups[mod.type].push(mod)
  })
  return groups
})

// Track collapsed state per type
const collapsedTypes = ref({})

// Toggle collapse/expand for a type
function toggleType(type) {
  collapsedTypes.value[type] = !collapsedTypes.value[type]
}

// Buy module logic
function buyModule(moduleName) {
  const mod = modules.availableModules.find(m => m.name === moduleName)
  if (!mod) return
  if ((user.gold || 0) < mod.cost) {
    showToast('Not enough gold!')
    return
  }
  user.gold -= mod.cost
  mod.count = (mod.count || 0) + 1
  showToast(`Bought ${mod.name} for 💰${mod.cost}`)
}

function sellModule(moduleName) {
  const mod = modules.availableModules.find(m => m.name === moduleName)
  if (!mod || (mod.count || 0) <= 0) return
  let refund = Math.ceil((mod.cost / 2) / 5) * 5
  user.gold += refund
  mod.count -= 1
  showToast(`Sold ${mod.name} for 💰${refund}`)
}

// --- Assembly compatibility helpers ---
function remainingSlots(type) {
  const hosts = modules.currentAssembly.filter(m => m.type === type)
  if (!hosts.length) return 0
  const capacity = hosts.reduce((sum, h) => sum + (h.maxSlots || 0), 0)
  const used = modules.currentAssembly.filter(m => m.attachesTo.includes(type)).length
  return capacity - used
}

function canAttach(mod) {
  if (!mod.attachesTo || mod.attachesTo.length === 0) return true
  return mod.attachesTo.some(attType => {
    const hosts = modules.currentAssembly.filter(m => m.type === attType)
    if (!hosts.length) return false
    const hasSlot = hosts.some(h => (h.slots || []).includes(mod.type))
    if (!hasSlot) return false
    return remainingSlots(attType) > 0
  })
}

function attachTooltip(mod) {
  if (!mod.attachesTo || mod.attachesTo.length === 0) return ''
  const hostNames = mod.attachesTo.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
  return `Attach to: ${hostNames}`
}


function addModuleToAssembly(moduleName) {
  const mod = modules.availableModules.find(m => m.name === moduleName)
  if (!mod || (mod.count || 0) <= 0) {
    showToast('You do not have any in stock.')
    return
  }
  if (!canAttach(mod)) {
    showToast('No compatible slot available.')
    return
  }
  modules.currentAssembly.push({...mod})
  mod.count -= 1
  showToast(`Added ${mod.name} to assembly.`)
}


const toast = ref(null)

function showToast(msg) {
  toast.value = msg
  setTimeout(() => {
    toast.value = null
  }, 3000)
}
</script>

<template>
  <div class="assembly-side-menu">
    <h2>Modules</h2>
    <div class="modules-list">
      <div
          v-for="(mods, type) in groupedModules"
          :key="type"
          class="module-type-group"
      >
        <div class="type-header" @click="toggleType(type)">
          <span>{{ type.charAt(0).toUpperCase() + type.slice(1) }}</span>
          <span class="arrow">
            {{ collapsedTypes[type] ? '▶' : '▼' }}
          </span>
        </div>
        <transition name="fade">
          <div v-show="!collapsedTypes[type]" class="type-modules">
            <div v-for="mod in mods" :key="mod.name" class="module-row">
              <span class="mod-name">{{ mod.name }}</span>
              <span class="mod-count">x{{ mod.count || 0 }}</span>
              <span class="mod-cost">💰{{ mod.cost }}</span>
              <div class="button-group">
                <button
                    v-if="mod.count > 0"
                    :disabled="!canAttach(mod)"
                    :title="!canAttach(mod) ? attachTooltip(mod) : ''"

                    @click="addModuleToAssembly(mod.name)"
                    class="add-btn"
                >
                  + Add
                </button>
                <button
                    @click="buyModule(mod.name)"
                    :disabled="user.gold < mod.cost"
                    class="buy-btn"
                >
                  Buy
                </button>
                <button
                    v-if="mod.count > 0"
                    @click="sellModule(mod.name)"
                    class="sell-btn"
                    title="Sell for half price"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
    <div class="gold-status">
      Gold: <span class="gold-amount">{{ user.gold }}</span>
    </div>
  </div>
</template>

<style scoped>

.assembly-side-menu {
  width: 340px;
  min-width: 260px;
  background: #e0f7fa;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0002;
  padding: 1.6em 0.7em 2.5em 0.7em;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;

}

h2 {
  margin-bottom: 1.1em;
  text-align: center;
  letter-spacing: 0.04em;
}

.modules-list {
  flex: 1 1 auto;
  overflow-y: auto;
  margin-bottom: 1.8em;
}

.module-type-group {
  margin-bottom: 1.3em;
}

.type-header {
  font-weight: bold;
  font-size: 1.08em;
  cursor: pointer;
  background: #b2ebf2;
  border-radius: 7px;
  padding: 0.53em 0.8em 0.53em 1.2em;
  margin-bottom: 0.2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: background 0.2s;
}

.type-header:hover {
  background: #80deea;
}

.type-modules {
  padding: 0.5em 0.3em 0.4em 1.7em;
  display: flex;
  flex-direction: column;
  gap: 0.58em;
}

.module-row {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.38em 0.5em 0.38em 0.1em;
  background: #fff;
  border-radius: 7px;
  font-size: 1.03em;
  box-shadow: 0 1px 4px #0001;
}

.mod-name {
  flex: 2;
  font-weight: bold;
}

.mod-count {
  flex: 0.6;
  text-align: right;
}

.mod-cost {
  flex: 0.8;
  color: #00695c;
  text-align: right;
}

.buy-btn {
  background: #ffd600;
  border: none;
  border-radius: 7px;
  padding: 0.23em 0.85em;
  font-weight: bold;
  cursor: pointer;
}

.buy-btn:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}

.buy-btn:not(:disabled):hover {
  background: #ffb300;
  color: #fff;
}

.sell-btn {
  background: #e0e0e0;
  border: none;
  border-radius: 7px;
  padding: 0.23em 0.85em;
  font-weight: bold;
  cursor: pointer;
  color: #37474f;
  transition: background 0.15s;
}

.sell-btn:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}

.sell-btn:not(:disabled):hover {
  background: #cfd8dc;
  color: #263238;
}


.arrow {
  font-size: 1.1em;
  margin-left: 0.8em;
}

.gold-status {
  margin-top: 1.2em;
  background: #b2ebf2;
  border-radius: 7px;
  padding: 0.5em 1.4em;
  font-weight: bold;
  font-size: 1.08em;
  text-align: center;
  box-shadow: 0 1px 4px #0001;
}

.gold-amount {
  color: #00796b;
  font-weight: bold;
  font-size: 1.15em;
  margin-left: 0.3em;
}


.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2em;
  background: #fffde7;
  color: #333;
  font-weight: bold;
  padding: 0.9em 1.7em;
  border-radius: 9px;
  box-shadow: 0 2px 8px #0002;
  font-size: 1.1em;
  z-index: 2000;
  pointer-events: none;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.add-btn {
  background: #c8e6c9;
  border: none;
  border-radius: 7px;
  padding: 0.23em 0.85em;
  font-weight: bold;
  cursor: pointer;
  color: #388e3c;
  transition: background 0.15s;
}

.add-btn:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}

.add-btn:not(:disabled):hover {
  background: #a5d6a7;
  color: #1b5e20;
}

.module-row {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.38em 0.5em 0.38em 0.1em;
  background: #fff;
  border-radius: 7px;
  font-size: 1.03em;
  box-shadow: 0 1px 4px #0001;
  /* Add this to keep buttons at the right edge */
  position: relative;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.42em;
  margin-left: auto; /* Push to the right edge */
  align-items: flex-end;
}
</style>
