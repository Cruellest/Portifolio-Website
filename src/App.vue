<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navbar.vue'
</script>

<template>
  <Navbar size="xl" class="no-print" />
  <RouterView />
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
