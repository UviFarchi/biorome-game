<script setup >
import {assemblyMeetsRequirements} from "@/rules/utils.js";

function canHarvestPlant(plant, materialEntry, assemblies, today) {
  if (!plant || !materialEntry || !assemblies?.length) return []



  // Here, for simplicity, let's assume plant must be at "mature" or "old" or "overripe" to cut down.
  const removalStages = ['mature', 'old', 'overripe', 'fruiting']
  const stage = plant.growthStage || plant.stage
  const inStage = removalStages.includes(stage)
  if (!inStage) return []

  return assemblies.filter(a =>
      a.actions > 0 &&
      assemblyMeetsRequirements(a, "harvest", materialEntry.key)
  )
}
</script>

<template>

</template>

<style scoped>

</style>