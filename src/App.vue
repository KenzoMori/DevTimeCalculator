<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageTitle from './views/PageTitle.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <PageTitle />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 10vh;
}

@media (min-width: 1024px) {
  header {
    max-height: 5vh;
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
