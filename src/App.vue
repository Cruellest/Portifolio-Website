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
  <Navbar v-if="showNavbar" size="xl" class="no-print" />
  <RouterView />
</template>

<style>
</style>
