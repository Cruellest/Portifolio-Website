<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/navbar.vue'
import { computed } from 'vue'

const route = useRoute()

const showNavbar = computed(() => {
  return route.name !== 'PrintResume'
})
</script>

<template>
  <div class="relative min-h-dvh">
    <!-- content -->
    <Navbar v-if="showNavbar" size="xl" class="no-print sticky top-0 z-50" />
    <div class="relative z-10">
      <RouterView />
    </div>
  </div>
</template>

<style>
</style>
