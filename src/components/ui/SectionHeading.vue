<template>
  <Reveal>
    <div class="mb-8 sm:mb-12">
      <p
        class="flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.35em] text-primary sm:text-sm"
        aria-hidden="true"
      >
        {{ index }}
        <span class="inline-block h-px w-10 bg-primary/50"></span>
      </p>
      <h2 class="mt-3 text-3xl font-bold tracking-tight text-base-content sm:text-4xl md:text-5xl">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 max-w-prose text-base text-base-content/60 sm:text-lg">
        {{ subtitle }}
      </p>
    </div>
  </Reveal>
</template>

<script setup lang="ts">
import Reveal from './Reveal.vue'

defineProps<{
  index: string
  title: string
  subtitle?: string
}>()
</script>
