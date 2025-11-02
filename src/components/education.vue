<template>
  <section class="container mx-auto max-w-screen-lg my-8 sm:my-12 px-4">
    <div class="card bg-base-100/80 backdrop-blur-sm border border-base-300 rounded-box p-6 sm:p-8 shadow">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-snug text-primary font-bold break-words">
            {{ sectionTitles.education || 'Education' }}
          </h2>
          <p class="text-base-content/70 text-sm sm:text-base">
            {{ items.length }} {{ items.length === 1 ? eduEntry : eduEntries }}
          </p>
        </div>
      </div>

      <!-- Lista vertical -->
      <div class="mt-6">
        <div class="flex flex-col gap-4 sm:gap-6">
          <section
            v-for="(edu, idx) in itemsSorted"
            :key="idx"
            class="relative w-full p-5 sm:p-6 rounded-lg border-l-4 border-primary bg-gradient-to-r from-base-200/60 to-base-100/20 backdrop-blur transition-colors hover:from-base-200/80"
          >
            <div class="flex flex-col gap-3 md:gap-4">
              <div class="text-xs sm:text-sm md:text-base text-base-content/60">
                {{ edu.startDate }} – {{ edu.endDate }}
              </div>
              <h3 class="text-2xl md:text-3xl font-bold text-primary leading-snug">
                {{ edu.degree }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="badge badge-soft badge-primary badge-sm md:badge-md">{{ edu.institution }}</span>
              </div>
              <p class="text-sm md:text-base text-base-content/70">
                {{ edu.location }}
              </p>
            </div>
            <span class="status status-primary status-sm absolute -left-2 top-6"></span>
          </section>

          <div v-if="!itemsSorted.length" class="alert alert-info">
            <span>{{ eduEmpty }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getEducationData, getSectionsData, getUiStrings } from '../controllers/json-data-controller'

type Education = {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
}

const sectionTitles = computed(() => getSectionsData() as any)
const ui = computed(() => getUiStrings() as any)
const eduEntry = computed<string>(() => ui.value?.education?.entryLabel || 'entry')
const eduEntries = computed<string>(() => ui.value?.education?.entriesLabel || 'entries')
const eduEmpty = computed<string>(() => ui.value?.education?.emptyState || 'No education records found.')
const items = computed<Education[]>(() => {
  const raw = getEducationData() as any
  return Array.isArray(raw) ? (raw as Education[]) : (Array.isArray(raw?.education) ? raw.education as Education[] : [])
})

// Ordenação baseada no ano final (endDate). "Current/Atual/Present" vai para o final (9999).
const getEndYear = (s: string): number => {
  if (!s) return -Infinity
  const lower = s.toLowerCase()
  if (lower.includes('current') || lower.includes('atual') || lower.includes('present'))
    return 9999
  const m = s.match(/(19|20)\d{2}/)
  return m ? Number(m[0]) : -Infinity
}
const itemsSorted = computed<Education[]>(() => {
  const arr = Array.isArray(items.value) ? [...items.value] : []
  return arr.sort((a, b) => getEndYear(a.endDate) - getEndYear(b.endDate))
})
</script>
