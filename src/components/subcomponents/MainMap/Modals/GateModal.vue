<template>
  <div class="areaModal" @click.self="$emit('close')">
    <div class="gate-modal-content">
      <h1>Farm Gate</h1>
      <button class="btn btn--close close-btn" @click="$emit('close')">×</button>
      <div class="subject-header">
        <span class="icon">{{ item.icon }}</span>
        <span class="type">{{ item.type }}</span>
        <span v-if="item.plantingType" class="plantingType">
          ({{ item.plantingType }})
        </span>
      </div>
      <div v-if="item.description" class="desc">{{ item.description }}</div>
      <div v-if="item.product" class="product">Product: {{ item.product }}</div>
      <div class="action-note" style="margin-top:1.1em; color:#669;">
        Actions for this {{ item.plantingType ? 'plant' : 'animal' }} are now enabled in the menu.
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.areaModal {
  display: flex;
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  background: rgba(64,100,60, 0.13);
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.gate-modal-content {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 40px #0003;
  padding: 2.2em 2.4em 2em 2.4em;
  min-width: 270px;
  max-width: 97vw;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  font-size: 1.08em;
  width: 100%; height: 100%;
}
.close-btn {
  position: absolute; top: 1.1em; right: 1.15em;
  font-size: 1.4em;
}
.subject-header {
  display: flex; gap: 0.8em; align-items: center; font-size: 1.15em;
}
.icon { font-size: 2em; }
.type { font-weight: bold; }
.plantingType { font-size: 0.96em; color: #888; }
</style>
