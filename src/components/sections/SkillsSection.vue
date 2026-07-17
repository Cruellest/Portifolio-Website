<template>
  <div class="container mx-auto max-w-5xl px-4 py-14 sm:py-20">
    <SectionHeading index="02" :title="store.sectionTitles.skills" :subtitle="ui.skills.tagline" />

    <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
      <Reveal v-for="(category, index) in categories" :key="category.name" :delay="0.06 * index">
        <div
          class="group h-full rounded-box border border-base-300/70 bg-base-100/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
        >
          <div class="flex items-center gap-4">
            <div
              class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content"
            >
              {{ category.initials }}
            </div>
            <div class="min-w-0">
              <h3
                class="break-words text-base font-semibold leading-snug text-base-content"
                :title="category.name"
              >
                {{ category.name }}
              </h3>
              <p class="text-xs text-base-content/60 sm:text-sm">{{ category.subtitle }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <div
              v-for="skill in category.itemsSorted"
              :key="skill.name"
              class="tooltip"
              :class="skill.level === 'primary' ? 'tooltip-primary' : ''"
              :data-tip="
                skill.level === 'primary'
                  ? ui.skills.badgePrimaryTooltip
                  : ui.skills.badgeSecondaryTooltip
              "
            >
              <span
                class="badge rounded-full"
                :class="
                  skill.level === 'primary'
                    ? 'border-primary/25 bg-primary/10 text-primary'
                    : 'badge-ghost border-base-300 text-base-content/70'
                "
              >
                <span v-if="skill.level === 'primary'" aria-hidden="true" class="mr-0.5">★</span>
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>

    <div v-if="!categories.length" class="alert alert-info mt-6">
      <span>{{ ui.skills.emptyState }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '../../stores/portfolio'
import Reveal from '../ui/Reveal.vue'
import SectionHeading from '../ui/SectionHeading.vue'

const store = usePortfolioStore()
const ui = computed(() => store.ui)

function getInitials(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const categories = computed(() => {
  const primarySubtitle = ui.value.skills.categorySubtitlePrimary
  const supportingSubtitle = ui.value.skills.categorySubtitleSupporting

  return store.skills
    .map((category) => {
      const items = category.skill_list
      const hasPrimary = items.some((skill) => skill.level === 'primary')
      const itemsSorted = [...items].sort((a, b) => {
        const priorityA = a.level === 'primary' ? 0 : 1
        const priorityB = b.level === 'primary' ? 0 : 1
        return priorityA - priorityB || a.name.localeCompare(b.name)
      })
      return {
        name: category.category,
        initials: getInitials(category.category),
        hasPrimary,
        subtitle: hasPrimary ? primarySubtitle : supportingSubtitle,
        itemsSorted,
      }
    })
    .sort((a, b) => {
      const coreA = a.hasPrimary ? 0 : 1
      const coreB = b.hasPrimary ? 0 : 1
      return coreA - coreB || a.name.localeCompare(b.name)
    })
})
</script>
