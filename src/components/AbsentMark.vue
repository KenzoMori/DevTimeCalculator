<script setup lang="ts">
const props = defineProps<{ numOfAbsentees: number | null }>()
</script>

<template>
  <span
    v-for="n in props.numOfAbsentees"
    :key="n"
    style="width: 10px; background-color: rgb(128, 128, 128)"
    >&nbsp;&nbsp;</span
  >
</template>

<style scoped>
span {
  margin-right: 1px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
}
</style>
