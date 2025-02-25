<template>
  <!-- {{ bitmap }} -->
  <div class="bitmap">
    <div v-for="(row, rowIndex) in bitmap" :key="rowIndex" class="row">
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        :class="['cell', { 'is-null': cell === null, 'is-active': cell === 1 }]"
      >
        <!-- {{ cell }} -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  numOfAbsenteesList: (number | null)[]
}>()

const bitmap = computed(() => {
  return props.numOfAbsenteesList.map(numOfAbsentees => {
    // return Array.from({ length: 9 }, (_, i) => (i < numOfAbsentees! ? 1 : 0))
    return Array.from({ length: 9 }, (_, i) => {
      if (numOfAbsentees === null) {
        return null
      }
      if (i < numOfAbsentees) {
        return 1
      }
      return 0
    })
  })
})
</script>

<style scoped>
.bitmap {
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  gap: 2px;
}

.row {
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  gap: 2px;
}

.cell {
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
}

.cell.is-active {
  background-color: rgb(128, 128, 128);
}

.cell.is-null {
  background-color: darkgray;
}
</style>
