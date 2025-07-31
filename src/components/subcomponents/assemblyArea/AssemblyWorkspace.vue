<script setup>
import { ref } from 'vue'
import { modulesStore } from '/stores/modulesStore.js'
import { v4 as uuidv4 } from 'uuid'

const modules = modulesStore()
const name = ref('')

function saveAssembly() {
  if (!modules.currentAssembly.length) return
  const id = uuidv4()
  modules.activeAssemblies.push({
    id,
    name: name.value || 'Unnamed Assembly',
    modules: modules.currentAssembly.map(m => ({ ...m })),
    deployed: false,
    moves: 1,
    actions: 1
  })
  // Clear the workspace for next assembly
  modules.currentAssembly.splice(0)
  name.value = ''
}

function returnToPool(index) {
  const [removed] = modules.currentAssembly.splice(index, 1)
  if (!removed) return
  const mod = modules.availableModules.find(m => m.name === removed.name)
  if (mod) mod.count = (mod.count || 0) + 1
}
function returnAllToPool() {
  while (modules.currentAssembly.length > 0) {
    const removed = modules.currentAssembly.pop()
    const mod = modules.availableModules.find(m => m.name === removed.name)
    if (mod) mod.count = (mod.count || 0) + 1
  }
}

</script>

<template>
  <div class="workspace-area">
    <h3>Assembly Workspace</h3>
    <input
        v-model="name"
        placeholder="Assembly Name (optional)"
        class="assembly-name-input"
        maxlength="30"
    />
    <ul class="current-modules-list">
      <li v-for="(mod, i) in modules.currentAssembly" :key="mod.type + i">
        <span>{{ mod.name }} — type: {{ mod.type }}</span>
        <button class="btn btn--return return-btn" @click="returnToPool(i)">return to module pool</button>
      </li>
      <li v-if="!modules.currentAssembly.length" class="empty-msg">No modules added yet.</li>
    </ul>
    <button
        class="btn btn--return return-all-btn"
        :disabled="!modules.currentAssembly.length"
        @click="returnAllToPool"
    >
      Return all modules to pool
    </button>
    <hr/>
    <button
        class="btn btn--save save-btn"
        :disabled="!modules.currentAssembly.length"
        @click="saveAssembly"
    >Save Assembly</button>
  </div>
</template>

<style scoped>
.workspace-area {
  flex: 1 1 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 10px #0001;
  padding: 2em 2.5em;
  margin: 1.5em auto;
  max-width: 550px;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.assembly-name-input {
  margin-bottom: 1em;
  padding: 0.48em 0.8em;
  font-size: 1em;
  border: 1px solid #b2ebf2;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}
.current-modules-list {
  margin: 0 0 1.6em 0.2em;
  padding: 0 0 0 1.3em;
  width: 100%;
}
.current-modules-list li {
  font-size: 1.08em;
  margin-bottom: 0.19em;
}
.empty-msg {
  color: #aaa;
  font-style: italic;
}
.save-btn {
  margin-top: 0.6em;
  padding: 0.58em 1.8em;
}

.return-all-btn {
  margin-top: 0.3em;
  margin-left: 0.9em;
  padding: 0.45em 1.3em;
}
</style>
