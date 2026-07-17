<template>
  <header
    class="sticky top-0 z-40 border-b border-base-300/60 bg-base-100/70 backdrop-blur-xl"
    data-search-ignore
  >
    <nav class="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
      <!-- Brand -->
      <a
        href="#top"
        class="whitespace-nowrap text-sm font-bold tracking-tight sm:text-base"
        @click.prevent="scrollToTop"
      >
        {{ shortName }}<span class="text-primary">.</span>
      </a>

      <!-- Desktop section links -->
      <div class="hidden items-center gap-1 md:flex">
        <a
          v-for="(label, key) in sectionLinks"
          :key="key"
          :href="`#${key}`"
          class="btn btn-ghost btn-sm rounded-full font-medium text-base-content/70 hover:bg-base-200 hover:text-base-content"
          @click.prevent="scrollToSection(key)"
        >
          {{ label }}
        </a>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 sm:gap-1.5">
        <SiteSearch />
        <ThemeMenu />
        <LanguageMenu />
        <DownloadMenu class="hidden md:block" />

        <!-- Mobile menu -->
        <div class="dropdown dropdown-end md:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle" aria-label="Menu">
            <i class="bi bi-list text-lg" aria-hidden="true"></i>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu z-50 mt-3 w-60 rounded-box border border-base-300/70 bg-base-100 p-2 shadow-xl"
          >
            <li class="menu-title">{{ ui.menu.sections }}</li>
            <li v-for="(label, key) in sectionLinks" :key="key">
              <a :href="`#${key}`" @click.prevent="scrollToSection(key)">{{ label }}</a>
            </li>
            <li class="menu-title pt-2">{{ ui.menu.actions }}</li>
            <li>
              <button :title="ui.menu.downloadResumeTitle" @click="goTo('/print-resume')">
                <i class="bi bi-file-earmark-richtext" aria-hidden="true"></i>
                {{ ui.menu.downloadResume }}
              </button>
            </li>
            <li>
              <button :title="ui.menu.downloadResumeAtsTitle" @click="goTo('/resume-ats')">
                <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
                {{ ui.menu.downloadResumeAts }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '../../stores/portfolio'
import { blurActiveElement, scrollToSection } from '../../utils/dom'
import DownloadMenu from './DownloadMenu.vue'
import LanguageMenu from './LanguageMenu.vue'
import SiteSearch from './SiteSearch.vue'
import ThemeMenu from './ThemeMenu.vue'

const store = usePortfolioStore()
const router = useRouter()

const ui = computed(() => store.ui)

const SECTION_ORDER = ['summary', 'skills', 'experience', 'education'] as const

const sectionLinks = computed(() => {
  const titles = store.sectionTitles
  return Object.fromEntries(SECTION_ORDER.map((key) => [key, titles[key]])) as Record<
    string,
    string
  >
})

const shortName = computed(() => {
  const parts = store.personal.fullName.trim().split(/\s+/)
  return parts.length >= 2 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0]
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  blurActiveElement()
}

const goTo = (path: string) => {
  blurActiveElement()
  void router.push(path)
}
</script>
