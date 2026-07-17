<template>
  <div class="min-h-dvh">
    <div class="site-background no-print" aria-hidden="true"></div>
    <AppNavbar v-if="showChrome" class="no-print" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from './components/navbar/AppNavbar.vue'
import { usePersonJsonLd } from './composables/usePersonJsonLd'
import { useTheme } from './composables/useTheme'
import { usePortfolioStore } from './stores/portfolio'

const route = useRoute()
const showChrome = computed(() => route.meta.chrome !== false)

useTheme()
usePersonJsonLd()
void usePortfolioStore().initLanguageFromStorage()
</script>
