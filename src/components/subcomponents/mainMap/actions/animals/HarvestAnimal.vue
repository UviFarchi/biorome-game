<script setup>

import {assemblyMeetsRequirements} from "@/rules/utils.js";

function canHarvestAnimal(tile, assemblyId) {
  if (!tile.animal || !tile.assemblies) return false
  const animalType = tile.animal.type
  const assembly = tile.assemblies.find(a => a.id === assemblyId)
  return assembly && assemblyMeetsRequirements(assembly, "harvest", animalType)
}
</script>

<template>

</template>

<style scoped>

</style>