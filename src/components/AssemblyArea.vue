<script setup>
import { ref } from 'vue'
import eventBus from "@/eventBus.js";
import ModulesMenu from '@/components/subcomponents/AssemblyArea/ModulesMenu.vue'
import ActiveAssemblyMenu from "@/components/subcomponents/AssemblyArea/ActiveAssemblyMenu.vue";
import PremadeAssembliesMenu from "@/components/subcomponents/AssemblyArea/PremadeAssembliesMenu.vue"
import AssemblyWorkspace from "@/components/subcomponents/AssemblyArea/AssemblyWorkspace.vue";
import { modulesStore } from '/stores/modulesStore.js'

const showPremadeModal = ref(false)
const modules = modulesStore()

function openNewAssemblyModal() {
  showPremadeModal.value = true
}
function closePremadeModal() {
  showPremadeModal.value = false
}

// Handler for selecting a premade
function handlePremadeSelect(assembly) {
  if (!assembly || !assembly.modules || assembly.modules.length === 0) {
    modules.currentAssembly = []
  } else {
    modules.currentAssembly = assembly.modules.map(m => ({ ...m }))
  }
  closePremadeModal()
}
</script>

<template>
  <div class="assembly-area-main">
    <!-- Top bar with left, center, right -->
    <div class="top-bar">
      <button @click="openNewAssemblyModal" class="new-btn">+ New Assembly</button>
      <div class="assemblies-bar">
        <ActiveAssemblyMenu/>
      </div>
      <button class="return-btn" @click="eventBus.emit('nav', 'main')">
        Return to Map
      </button>
    </div>
    <!-- Main horizontal flex layout -->
    <div class="workspace-row">
      <div class="modules-col">
        <ModulesMenu/>
      </div>
      <div class="workspace-col">
        <AssemblyWorkspace />
      </div>
    </div>
    <PremadeAssembliesMenu
        v-if="showPremadeModal"
        @close="closePremadeModal"
    />
  </div>
</template>

<style scoped>
.assembly-area-main {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #f8fdfd;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #e0f7fa;
  padding: 0.7em 1.4em 0.7em 1em;
  border-bottom: 1.5px solid #b2dfdb;
  min-height: 58px;
  gap: 1.1em;
}

.new-btn {
  padding: 0.35em 1.2em;
  border-radius: 7px;
  background: #ffd600;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-right: 0.8em;
}
.new-btn:hover {
  background: #ffb300;
  color: #333;
}

.assemblies-bar {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}

.return-btn {
  margin-left: auto;
  font-weight: bold;
  padding: 0.39em 1.1em;
  background: #80deea;
  color: #2c2c2c;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.07em;
  box-shadow: 0 2px 4px #0001;
}
.return-btn:hover {
  background: #00bcd4;
  color: #fff;
}

.workspace-row {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 0; /* allows children to use 100% height */
  min-height: 0;
}

.modules-col {
  width: 340px;
  min-width: 260px;
  background: #e0f7fa;
  border-right: 1.5px solid #b2dfdb;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.workspace-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: #f8fdfd;
  overflow-y: auto;
  padding: 2.4em 2.4em 2em 2em;
}

</style>
