<template>
  <div class="container mx-auto max-w-5xl px-4 py-14 sm:py-20">
    <SectionHeading index="01" :title="store.sectionTitles.summary" />
    <Reveal :delay="0.1">
      <p class="max-w-3xl text-lg leading-relaxed text-base-content/80 sm:text-xl sm:leading-9">
        {{ store.summary }}
      </p>
    </Reveal>
  </div>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'
import Reveal from '../ui/Reveal.vue'
import SectionHeading from '../ui/SectionHeading.vue'

const store = usePortfolioStore()
</script>
