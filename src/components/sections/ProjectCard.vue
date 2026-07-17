<template>
  <article
    class="flex flex-col rounded-box border border-base-300/70 bg-base-100/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
    :class="mobileFullHeight ? 'h-[55dvh] overflow-hidden' : ''"
  >
    <h4 class="text-lg font-semibold leading-snug text-base-content">{{ project.name }}</h4>
    <p
      class="mt-2 grow text-sm leading-relaxed text-base-content/75"
      :class="mobileFullHeight ? 'overflow-y-auto pr-1' : ''"
    >
      {{ project.description }}
    </p>
    <div class="mt-5">
      <a
        :href="project.link"
        target="_blank"
        rel="noopener"
        class="btn btn-sm gap-1.5 rounded-full border-base-300 bg-transparent font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
        :title="project.link"
      >
        {{ ui.projects.visitButton }}
        <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '../../types/portfolio'
import { usePortfolioStore } from '../../stores/portfolio'

defineProps<{
  project: Project
  mobileFullHeight?: boolean
}>()

const store = usePortfolioStore()
const ui = computed(() => store.ui)
</script>
