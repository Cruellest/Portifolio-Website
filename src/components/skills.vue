<template>
  <section class="container mx-auto max-w-screen-lg my-8 sm:my-12 px-4">
    <div class="card glass rounded-box p-6 sm:p-8 shadow">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-snug text-primary font-bold break-words">
            {{ sectionTitle }}
          </h2>
          <p class="text-base-content/70 text-sm sm:text-base md:text-lg">
            {{ tagline }}
          </p>
        </div>

      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="card bg-base-100/80 border border-base-300 rounded-box shadow-sm"
        >
          <div class="card-body gap-4">
            <div class="flex items-center gap-4">
              <div class="avatar placeholder">
                <div class="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold grid place-items-center">
                  {{ cat.initials }}
                </div>
              </div>
              <div class="min-w-0">
                <h3
                  class="card-title text-base-content text-sm sm:text-base md:text-lg leading-snug break-words"
                  :title="cat.name"
                >
                  {{ cat.name }}
                </h3>
                <p class="text-xs sm:text-sm text-base-content/70">
                  {{ cat.subtitle }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="(skill, i) in cat.itemsSorted"
                :key="i"
                :class="['tooltip', skill.level === 'primary' ? 'tooltip-primary' : '']"
                :data-tip="skill.level === 'primary' ? primaryTooltip : secondaryTooltip"
              >
                <span
                  class="badge"
                  :class="skill.level === 'primary'
                    ? 'badge-soft bg-primary/10 text-primary border border-primary/30'
                    : 'badge-ghost'"
                >
                  <span v-if="skill.level === 'primary'" aria-hidden="true" class="mr-1">★</span>
                  {{ skill.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- empty state -->
      <div v-if="!categories.length" class="mt-6 alert alert-info">
        <span>{{ emptyStateText }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getSkillsData, getSectionsData, getUiStrings } from '../controllers/json-data-controller'

type SkillItem = { name: string; level?: string }
type SkillCategory = { category: string; skill_list: SkillItem[] }

const rawSkills = computed(() => getSkillsData() as unknown as SkillCategory[] || [])
const sectionTitles = computed(() => getSectionsData() as any)
const ui = computed(() => getUiStrings() as any)

const sectionTitle = computed<string>(() => (sectionTitles.value?.skills) || 'Skills')

// texts from data.json with fallbacks
const tagline = computed<string>(() =>
  ui.value?.skills?.tagline || 'Skills not found'
)
const primarySubtitle = computed<string>(() =>
  ui.value?.skills?.categorySubtitlePrimary || 'Skills not found'
)
const supportingSubtitle = computed<string>(() =>
  ui.value?.skills?.categorySubtitleSupporting || 'Skills not found'
)
const primaryTooltip = computed<string>(() =>
  ui.value?.skills?.badgePrimaryTooltip || 'Skills not found'
)
const secondaryTooltip = computed<string>(() =>
  ui.value?.skills?.badgeSecondaryTooltip || 'Skills not found'
)
const emptyStateText = computed<string>(() =>
  ui.value?.skills?.emptyState || 'Skills not found'
)

const categories = computed(() => {
  const list = (rawSkills.value || [])
  return list.map(cat => {
    const items = Array.isArray(cat.skill_list) ? cat.skill_list : []
    const hasPrimary = items.some(s => s.level === 'primary')
    const itemsSorted = [...items].sort((a, b) => {
      const pa = a.level === 'primary' ? 0 : 1
      const pb = b.level === 'primary' ? 0 : 1
      return pa - pb || a.name.localeCompare(b.name)
    })
    return {
      name: cat.category || 'Untitled',
      initials: getInitials(cat.category || 'U'),
      subtitle: hasPrimary ? primarySubtitle.value : supportingSubtitle.value,
      itemsSorted
    }
  }).sort((a, b) => {
    const aCore = a.subtitle === primarySubtitle.value ? 0 : 1
    const bCore = b.subtitle === primarySubtitle.value ? 0 : 1
    return aCore - bCore || a.name.localeCompare(b.name)
  })
})

function getInitials(text: string) {
  const parts = text.trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p.charAt(0)).join('').toUpperCase()
}
</script>
