<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed } from 'vue'

const props = defineProps({
  assembly: Object
})

const tilesStoreInstance = tilesStore()
const tile = computed(() => tilesStoreInstance.selectedSubject.value)
const modules = modulesStore()

function recall() {
  const idx = tile.value.assemblies.findIndex(a => a.id === props.assembly.id)
  if (idx !== -1) tile.value.assemblies.splice(idx, 1)
  modules.activeAssemblies.push({ ...props.assembly, deployed: false })
}
</script>

<template>
  <div class="assembly-block">
    <span>{{ assembly.name || 'Assembly' }}</span>
    <button @click="recall">Recall</button>
    <span v-if="assembly.moves < 1" class="btn-error">No moves left for this assembly</span>
  </div>
</template>

<style scoped>
.assembly-block {
  background: #f9fbe7;
  border-radius: 8px;
  padding: 0.5em 1em;
  min-width: 185px;
  max-width: 185px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 0;
  position: relative;
  box-shadow: 0 1px 4px rgba(60, 60, 60, 0.05);
  gap: 0.6em;
}

.assembly-block span {
  font-weight: bold;
  text-align: center;
  overflow-wrap: anywhere;
  max-height: 3.5em;
  line-height: 1.13em;
  font-size: 1.08em;
  margin-bottom: 0.15em;
}

.assembly-block button {
  padding: 0.21em 1em;
  border-radius: 7px;
  background: #b2dfdb;
  border: none;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  margin: 0.15em 0;
}

.assembly-block button:hover {
  background: #00bcd4;
  color: #fff;
}

.assembly-block button:disabled {
  background: #ddd !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border: 1px solid #bbb;
}

.btn-error {
  color: #b22222;
  font-size: 0.95em;
  margin-left: 0.5em;
  font-weight: 500;
}
</style>
