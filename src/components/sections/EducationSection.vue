<template>
  <div class="container mx-auto max-w-5xl px-4 py-14 sm:py-20">
    <SectionHeading
      index="04"
      :title="store.sectionTitles.education"
      :subtitle="`${entries.length} ${entries.length === 1 ? ui.education.entryLabel : ui.education.entriesLabel}`"
    />

    <div v-if="entries.length" class="relative ml-1.5 border-l border-base-300 pl-8 sm:pl-10">
      <Reveal v-for="(entry, index) in entries" :key="index" :delay="0.08 * index">
        <div class="relative pb-10 last:pb-0">
          <span
            class="absolute -left-[2.45rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15 sm:-left-[2.95rem]"
            aria-hidden="true"
          ></span>
          <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
            {{ entry.startDate }} – {{ entry.endDate }}
          </p>
          <h3 class="mt-1.5 text-xl font-semibold tracking-tight text-base-content sm:text-2xl">
            {{ entry.degree }}
          </h3>
          <p class="mt-1 font-medium text-primary">{{ entry.institution }}</p>
          <p class="mt-0.5 text-sm text-base-content/60">{{ entry.location }}</p>
        </div>
      </Reveal>
    </div>

    <div v-else class="alert alert-info">
      <span>{{ ui.education.emptyState }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EducationEntry } from '../../types/portfolio'
import { usePortfolioStore } from '../../stores/portfolio'
import Reveal from '../ui/Reveal.vue'
import SectionHeading from '../ui/SectionHeading.vue'

const store = usePortfolioStore()
const ui = computed(() => store.ui)

const CURRENT_MARKERS = ['current', 'atual', 'present']

/** "Current/Atual/Present" entries sort last; otherwise by final year. */
function getEndYear(date: string): number {
  const lower = date.toLowerCase()
  if (CURRENT_MARKERS.some((marker) => lower.includes(marker))) return Number.MAX_SAFE_INTEGER
  const match = date.match(/(19|20)\d{2}/)
  return match ? Number(match[0]) : Number.MIN_SAFE_INTEGER
}

const entries = computed<EducationEntry[]>(() =>
  [...store.education].sort((a, b) => getEndYear(a.endDate) - getEndYear(b.endDate)),
)
</script>
