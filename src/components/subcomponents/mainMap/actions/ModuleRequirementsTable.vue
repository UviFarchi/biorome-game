<script setup>
import {ref} from "vue";

const props = defineProps({
  matches: {
    type: Array,
    required: true
  }
})

let showTable = ref(false);
function toggleTable(){
  showTable.value = !showTable.value
}

</script>

<template>
  <div v-if="matches.length">
    <button class="info-toggle-btn" @click="toggleTable">
      {{ showTable ? 'Hide' : 'Show' }} necessary modules
    </button>
    <table class="modules-required-table" v-if="showTable">
      <thead>
      <tr>
        <th>Type</th>
        <th>Subtype</th>
        <th>Suitable Modules</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(match, i) in matches" :key="i">
        <td>{{ match.type }}</td>
        <td>{{ match.subtype || '—' }}</td>
        <td>
            <span v-if="match.names && match.names.length">
              {{ match.names.join(', ') }}
            </span>
          <span v-else>
              <em>No match</em>
            </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.modules-required-table {
  margin-top: 0.7em;
  border-collapse: collapse;
  width: 100%;
  font-size: 0.98em;
}
.modules-required-table th, .modules-required-table td {
  border: 1px solid #e0e0e0;
  padding: 0.33em 0.7em;
  text-align: left;
}
.modules-required-table th {
  background: #f7f7f7;
}

.info-toggle-btn {
  background: none;
  border: 1px dashed #b0bec5;
  color: #546e7a;
  font-size: 0.95em;
  padding: 0.22em 0.9em;
  border-radius: 6px;
  cursor: pointer;
  margin: 0.6em 0 0.5em 0;
  transition: background 0.13s, color 0.13s, border 0.13s;
}

.info-toggle-btn:hover, .info-toggle-btn:focus {
  background: #f4f8fb;
  color: #1976d2;
  border-color: #90caf9;
  outline: none;
  text-decoration: underline;
}
</style>
