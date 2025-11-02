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
        <!-- ...removed numeric stats block for a cleaner, non-quantified presentation... -->
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
                :data-tip="skill.level === 'primary' ? 'Core' : 'Also use'"
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

      <!-- optional empty state -->
      <div v-if="!categories.length" class="mt-6 alert alert-info">
        <span>No skills found.</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getSkillsData, getSectionsData } from '../controllers/json-data-controller'

type SkillItem = { name: string; level?: string }
type SkillCategory = { category: string; skill_list: SkillItem[] }

const rawSkills = computed(() => getSkillsData() as unknown as SkillCategory[] || [])
const sectionTitles = computed(() => getSectionsData() as any)
const sectionTitle = computed<string>(() => (sectionTitles.value?.skills) || 'Skills')

// friendly, non-quantified subtitle
const tagline = computed(() => 'Highlights from my toolbox — core stack and supporting technologies')

// category cards without numbers/percentages
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
      subtitle: hasPrimary ? 'Core tools I rely on' : 'Supporting tools I enjoy',
      itemsSorted
    }
  }).sort((a, b) => {
    // Put categories with core tools first, then alphabetically
    const aCore = a.subtitle.includes('Core') ? 0 : 1
    const bCore = b.subtitle.includes('Core') ? 0 : 1
    return aCore - bCore || a.name.localeCompare(b.name)
  })
})

// helper to make initials from category name
function getInitials(text: string) {
  const parts = text.trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p.charAt(0)).join('').toUpperCase()
}
</script>
