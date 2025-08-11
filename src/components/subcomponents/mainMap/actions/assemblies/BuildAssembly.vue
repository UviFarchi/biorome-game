<script setup>
import { modulesStore } from '/stores/modulesStore.js'
import { tilesStore } from '/stores/tilesStore.js'
import { computed, ref, watch, onMounted } from 'vue'
import { assemblyMeetsRequirements } from '@/rules/utils.js'

const props = defineProps({
  assembly: Object
})

</script>

<template>

</template>

<style scoped>

</style>