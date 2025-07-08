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

// New handler for picking a premade
function handlePremadeSelect(assembly) {
  // If blank, assembly will be null or empty
  if (!assembly || !assembly.modules || assembly.modules.length === 0) {
    // Replace the entire array so reactivity triggers correctly
    modules.currentAssembly = []
  } else {
    // Deep copy modules and replace the array
    modules.currentAssembly = assembly.modules.map(m => ({ ...m }))
  }
  closePremadeModal()
}
</script>
<template>
  <div class="assembly-area-main">
    <button @click="openNewAssemblyModal" class="new-btn">+ New Assembly</button>
    <ActiveAssemblyMenu/>
    <ModulesMenu/>
    <PremadeAssembliesMenu
        v-if="showPremadeModal"
        @select="handlePremadeSelect"
        @close="closePremadeModal"
    />
    <AssemblyWorkspace />
    <button class="return-btn" @click="eventBus.emit('nav', 'main')">
      Return to Map
    </button>
  </div>
</template>

<style scoped>
.assembly-area-main {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f8fdfd;
}
.return-btn {
  margin: 2.3em auto 0 auto;
  display: block;
  font-weight: bold;
  padding: 0.45em 1.6em;
  background: #80deea;
  color: #2c2c2c;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1.08em;
  box-shadow: 0 2px 4px #0001;
}

.return-btn:hover {
  background: #00bcd4;
  color: #fff;
}

.new-btn {
  padding: 0.32em 1.2em;
  border-radius: 7px;
  background: #ffd600;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.1em;
}
.new-btn:hover {
  background: #ffb300;
  color: #333;
}
</style>
