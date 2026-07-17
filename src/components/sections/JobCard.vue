<template>
  <article
    class="flex flex-col rounded-box border border-base-300/70 bg-base-100/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
    :class="mobileFullHeight ? 'h-[70dvh] justify-between overflow-hidden' : ''"
  >
    <div class="space-y-1.5">
      <p v-if="showDate" class="text-xs font-medium uppercase tracking-wider text-base-content/50">
        <template v-if="ui.experience.dateLabel">{{ ui.experience.dateLabel }}: </template>
        {{ job.startDate }} – {{ job.endDate }}
      </p>
      <h3 class="text-lg font-semibold leading-snug text-base-content">{{ job.title }}</h3>
      <p class="text-sm font-medium text-primary">{{ job.company }}</p>
      <p class="text-xs text-base-content/60">{{ job.location }}</p>
    </div>

    <ul
      class="mt-4 space-y-2 text-sm leading-relaxed text-base-content/75"
      :class="mobileFullHeight ? 'grow overflow-y-auto pr-1' : ''"
    >
      <li v-for="(highlight, index) in job.highlights" :key="index" class="flex gap-2.5">
        <span
          class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
          aria-hidden="true"
        ></span>
        {{ highlight }}
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '../../types/portfolio'
import { usePortfolioStore } from '../../stores/portfolio'

withDefaults(
  defineProps<{
    job: Job
    mobileFullHeight?: boolean
    showDate?: boolean
  }>(),
  { showDate: true },
)

const store = usePortfolioStore()
const ui = computed(() => store.ui)
</script>
