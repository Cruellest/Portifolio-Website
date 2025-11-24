<template>
  <!-- NAVBAR ROOT -->
  <div 
    class="navbar sticky top-0 left-0 z-50 isolate transition-all bg-base-100/60 border-b border-base-300 shadow-md supports-[backdrop-filter]:backdrop-blur-lg backdrop-blur-lg no-print"
    data-search-ignore
    :class="[sizeClasses.navbar]"
  >
    <!-- NAVBAR START (left) -->
    <div :class="['navbar-start gap-1 sm:gap-2', sizeClasses.gap]">
      <!-- LANGUAGE DROPDOWN (selection enabled) -->
      <div class="dropdown dropdown-start">
        <label
          tabindex="0"
          :class="['btn btn-secondary rounded-full font-bold text-white', sizeClasses.nameBtn]"
          ref="langDropdownBtn"
        >
          <i class="bi bi-translate mr-2"></i>
          {{ currentLanguageNativeName }}
        </label>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44"
          ref="langDropdownMenu"
        >
          <li v-for="lang in languages" :key="lang.code">
            <button
              class="rounded-full flex items-center justify-between"
              @click="selectLanguage(lang.code)"
            >
              <span>{{ lang.nativeName }}</span>
              <i v-if="lang.code === selectedLanguageCode" class="bi bi-check text-success"></i>
            </button>
          </li>
        </ul>
      </div>

      <!-- SEARCH AREA -->
      <div class="flex items-center min-w-0">
        <div
          v-if="isSearchOpen"
          class="fixed inset-0 bg-base-300/40 sm:hidden z-40"
          @click="isSearchOpen = false"
        ></div>

        <!-- SEARCH CONTAINER (below navbar on all screens) -->
        <div
          v-if="isSearchOpen"
          class="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 z-50 w-[min(90vw,42rem)]"
          ref="searchWrapper"
        >
          <div class="flex flex-col sm:flex-row items-stretch gap-2">
            <!-- SEARCH INPUT -->
            <div class="relative w-full">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                aria-label="Search"
                :class="[
                  'input input-bordered w-full rounded-full pl-10 pr-12 bg-base-100/95 border-base-300 shadow-lg',
                  'focus:outline-none focus:ring-2 focus:ring-primary/40',
                  sizeClasses.input
                ]"
                @blur="handleSearchBlur"
                @keyup.escape="isSearchOpen = false"
                @keydown.enter.prevent="closeSearchOnSubmit"
                ref="searchInput"
              />
              <button
                class="btn btn-circle btn-ghost absolute right-1.5 top-1/2 -translate-y-1/2"
                @click="isSearchOpen = false"
                title="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <kbd class="hidden sm:flex kbd kbd-sm absolute right-14 top-1/2 -translate-y-1/2 text-base-content/60">/</kbd>
            </div>

            <!-- SEARCH CONTROLS (arrows + counter) -->
            <div class="flex items-center justify-end">
              <div class="flex flex-col items-center gap-1">
                <div class="join">
                  <button
                    class="btn btn-sm btn-outline join-item rounded-full bg-base-100 border-base-300 text-base-content/80 shadow hover:bg-base-200"
                    title="Previous"
                    @click="prevMatch"
                  >
                    <i class="bi bi-chevron-up"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline join-item rounded-full bg-base-100 border-base-300 text-base-content/80 shadow hover:bg-base-200"
                    title="Next"
                    @click="nextMatch"
                  >
                    <i class="bi bi-chevron-down"></i>
                  </button>
                </div>
                <span
                  v-if="totalMatches > 0"
                  class="rounded-full bg-base-100 border border-base-300 text-base-content/80 text-xs px-2 py-1 shadow leading-none"
                  title="Occurrences"
                >
                  {{ currentIndex + 1 }} / {{ totalMatches }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH TOGGLE BUTTON -->
        <button
          :class="[
            'btn btn-circle rounded-full shrink-0',
            isSearchOpen ? 'btn-accent text-accent-content' : 'btn-ghost',
            sizeClasses.searchBtn
          ]"
          @click="toggleSearch"
          title="Search"
          ref="searchToggleBtn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="isSearchOpen ? 'opacity-100' : 'opacity-80'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- NAVBAR CENTER (spacer) -->
    <div class="navbar-center"></div>

    <!-- NAVBAR END (right) -->
    <div :class="['navbar-end gap-1 sm:gap-2', sizeClasses.gap]">
      <!-- DESKTOP NAV SECTIONS -->
      <div :class="['hidden gap-1 sm:gap-2', sizeClasses.navbreakpoint, sizeClasses.gap]">
        <a 
          v-for="(section, key) in navSectionsPrimary" 
          :key="key"
          :href="`#${key}`"
          :class="[
            'btn btn-ghost bg-base-100/60 backdrop-blur-sm rounded-full whitespace-nowrap',
            'hover:bg-accent hover:text-accent-content transition-colors duration-200',
            sizeClasses.navBtn
          ]"
          @click.prevent="scrollToSection(key)"
        >
          {{ getResponsiveName(section) }}
        </a>
      </div>
      
      <!-- THEME SWITCHER -->
      <div class="dropdown dropdown-end">
        <label
          tabindex="0"
          :class="['btn btn-ghost btn-circle rounded-full flex-shrink-0', sizeClasses.menuBtn]"
          :title="themeTexts.title"
        >
          <i :class="['bi', themeIcon]"></i>
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44">
          <li>
            <button class="rounded-full" @click="setTheme('auto')">
              <i class="bi bi-circle-half"></i>
              {{ themeTexts.auto }}
            </button>
          </li>
          <li>
            <button class="rounded-full" @click="setTheme('light')">
              <i class="bi bi-brightness-high"></i>
              {{ themeTexts.light }}
            </button>
          </li>
          <li>
            <button class="rounded-full" @click="setTheme('dark')">
              <i class="bi bi-moon"></i>
              {{ themeTexts.dark }}
            </button>
          </li>
        </ul>
      </div>

      <!-- DOWNLOAD BUTTON (desktop only) -->
      <button 
        @click="downloadPDF"
        :class="['btn btn-ghost btn-circle rounded-full flex-shrink-0 hidden', sizeClasses.downloadBtn, sizeClasses.navbreakpoint]"
        title="Download resume as PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      <!-- MOBILE MENU -->
      <div :class="['dropdown dropdown-end', sizeClasses.menubreakpoint]">
        <label tabindex="0" :class="['btn btn-ghost btn-circle rounded-full flex-shrink-0', sizeClasses.menuBtn]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
          <li class="menu-title">
            <span>{{ menuTexts.sections }}</span>
          </li>
          <li v-for="(section, key) in navSectionsPrimary" :key="key">
            <a
              :href="`#${key}`"
              class="rounded-full hover:bg-base-200 hover:text-base-content transition-colors duration-200"
              @click.prevent="scrollToSection(key)"
            >
              {{ section }}
            </a>
          </li>
          <li class="menu-title pt-2">
            <span>{{ menuTexts.actions }}</span>
          </li>
          <li>
            <button
              class="rounded-full hover:bg-base-200 hover:text-base-content transition-colors duration-200"
              @click="downloadPDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ menuTexts.downloadResume }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Navbar component
 * Provides:
 *  - search/highlight across the page
 *  - language selection (uses json-data-controller)
 *  - theme switching (persisted to localStorage)
 *
 * Props:
 *  - size: 'sm'|'md'|'lg'|'xl' (default: 'md')
 *
 * VSCode: JSDoc above and inline @type annotations below help editor tooling.
 */

import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPersonalData, getSectionsData, setLanguage as setAppLanguage, ensureLanguageFromLocalStorage as ensureLangFromStorage, getCurrentLanguageCode } from '../controllers/json-data-controller'
import languagesData from '../data/languages.json'
import appData from '../data/data.json'

const router = useRouter()

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

// core reactive state used in template
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const searchWrapper = ref(null)
const searchToggleBtn = ref(null)
const currentIndex = ref(-1)
const totalMatches = ref(0)

const personalData = computed(() => getPersonalData())
const navigationSections = computed(() => getSectionsData())

// Build navbar from primary sections only (ignore subtitles)
const navSectionsPrimary = computed(() => {
  const src = navigationSections.value || {}
  const order = ['summary', 'skills', 'experience', 'education']
  return Object.fromEntries(
    order
      .filter(key => src[key])
      .map(key => [key, src[key]])
  )
})

const getShortName = (fullName) => {
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) return `${parts[0]} ${parts[parts.length - 1]}`
  return parts[0]
}

const getResponsiveName = (sectionName) => {
  return sectionName
}

// Added missing event handlers
const scrollToSection = (key) => {
  const element = document.getElementById(key)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }
}

const downloadPDF = () => {
  router.push('/print-resume')
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => searchInput.value?.focus())
  }
}

const handleSearchBlur = () => {
  // Optional: logic when search input loses focus
}

const prevMatch = () => {
  if (totalMatches.value > 0) {
    focusHighlight(currentIndex.value - 1)
  }
}

const nextMatch = () => {
  if (totalMatches.value > 0) {
    focusHighlight(currentIndex.value + 1)
  }
}

const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      navbar: 'px-1 sm:px-2 py-1 sm:py-2',
      gap: 'gap-0.5 sm:gap-1',
      nameBtn: 'btn-xs px-2 sm:px-3',
      navBtn: 'btn-xs px-2 sm:px-3',
      searchBtn: 'btn-xs',
      downloadBtn: 'btn-xs',
      menuBtn: 'btn-xs',
      input: 'input-xs w-32',
      breakpoint: 'md:hidden',
      namebreakpoint: 'md:flex hidden',
      navbreakpoint: 'md:flex',
      menubreakpoint: 'md:hidden'
    },
    md: {
      navbar: 'px-2 sm:px-4 py-2 sm:py-3',
      gap: 'gap-1 sm:gap-2',
      nameBtn: 'btn-sm px-4 sm:px-6',
      navBtn: 'btn-sm px-3 sm:px-4',
      searchBtn: 'btn-sm',
      downloadBtn: 'btn-sm',
      menuBtn: 'btn-sm',
      input: 'input-sm w-40',
      breakpoint: 'md:hidden',
      namebreakpoint: 'md:flex hidden',
      navbreakpoint: 'md:flex',
      menubreakpoint: 'md:hidden'
    },
    lg: {
      navbar: 'px-3 sm:px-6 py-3 sm:py-4',
      gap: 'gap-2 sm:gap-3',
      nameBtn: 'btn-md px-6 sm:px-8',
      navBtn: 'btn-md px-4 sm:px-5',
      searchBtn: 'btn-md',
      downloadBtn: 'btn-md',
      menuBtn: 'btn-md',
      input: 'input-md w-48',
      breakpoint: 'lg:hidden',
      namebreakpoint: 'lg:flex hidden',
      navbreakpoint: 'lg:flex',
      menubreakpoint: 'lg:hidden'
    },
    xl: {
      navbar: 'px-4 sm:px-8 py-4 sm:py-5',
      gap: 'gap-3 sm:gap-4',
      nameBtn: 'btn-lg px-8 sm:px-10',
      navBtn: 'btn-lg px-5 sm:px-6',
      searchBtn: 'btn-lg',
      downloadBtn: 'btn-lg',
      menuBtn: 'btn-lg',
      input: 'input-lg w-56',
      breakpoint: 'xl:hidden',
      namebreakpoint: 'xl:flex hidden',
      navbreakpoint: 'xl:flex',
      menubreakpoint: 'xl:hidden'
    }
  }
  return sizes[props.size] ?? sizes.md
})

// Search/highlight related helpers
const getHighlights = () => Array.from(document.querySelectorAll('mark[data-search-highlight="true"]'))

const setActiveMark = (mark, active) => {
  if (!mark) return
  if (active) {
    mark.classList.add('bg-accent', 'text-accent-content', 'rounded', 'ring', 'ring-2', 'ring-accent', 'ring-offset-1')
  } else {
    mark.classList.remove('ring', 'ring-2', 'ring-accent', 'ring-offset-1')
    mark.classList.add('bg-accent', 'text-accent-content', 'rounded')
  }
}

const focusHighlight = (idx) => {
  const marks = getHighlights()
  totalMatches.value = marks.length
  if (marks.length === 0) {
    currentIndex.value = -1
    return
  }
  const clamped = ((idx % marks.length) + marks.length) % marks.length
  marks.forEach(m => setActiveMark(m, false))
  const target = marks[clamped]
  setActiveMark(target, true)
  currentIndex.value = clamped
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
}

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const clearHighlights = () => {
  const marks = document.querySelectorAll('mark[data-search-highlight="true"]')
  marks.forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
    parent.normalize()
  })
}

// Helper constants and functions for search highlighting
const EXCLUDE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CANVAS', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'MARK'])

const shouldSkipNode = (el) => {
  if (!el || el.nodeType !== 1) return false
  if (el.hasAttribute('data-search-ignore')) return true
  if (EXCLUDE_TAGS.has(el.tagName)) return true
  return false
}

const processTextNode = (text, re) => {
  if (!text) return null
  re.lastIndex = 0
  if (!re.test(text)) return null
  re.lastIndex = 0
  
  const frag = document.createDocumentFragment()
  let lastIndex = 0
  let match
  
  while ((match = re.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length
    if (start > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, start)))
    
    const mark = document.createElement('mark')
    mark.setAttribute('data-search-highlight', 'true')
    mark.className = 'bg-accent text-accent-content rounded'
    mark.textContent = text.slice(start, end)
    frag.appendChild(mark)
    
    lastIndex = end
  }
  
  if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)))
  return frag
}

const highlightQuery = (query) => {
  clearHighlights()
  const q = (query || '').trim()
  if (!q) {
    totalMatches.value = 0
    currentIndex.value = -1
    return
  }

  const re = new RegExp(escapeRegExp(q), 'gi')

  const walk = (node) => {
    if (!node) return
    if (node.nodeType === 1) {
      if (shouldSkipNode(node)) return
      
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i]
        if (child.nodeType === 1) {
          walk(child)
        } else if (child.nodeType === 3) {
          const frag = processTextNode(child.nodeValue, re)
          if (frag) {
            node.replaceChild(frag, child)
            i--
          }
        }
      }
    }
  }

  walk(document.body)

  const marks = getHighlights()
  totalMatches.value = marks.length
  if (marks.length > 0) {
    focusHighlight(0)
  } else {
    currentIndex.value = -1
  }
}

watch(searchQuery, (q) => {
  highlightQuery(q)
})

// Keyboard handler and document click handler
const handleKeydown = (e) => {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  const combo = (isMac && e.metaKey) || (!isMac && e.ctrlKey)
  if (combo && (e.key === 'f' || e.key === 'F')) {
    e.preventDefault()
    if (!isSearchOpen.value) {
      isSearchOpen.value = true
      nextTick(() => searchInput.value?.focus())
    } else {
      nextTick(() => {
        const input = searchInput.value
        if (input && input.select) input.select()
      })
    }
  }
}

const closeSearchOnSubmit = () => { isSearchOpen.value = false }

const isDesktop = () => window.matchMedia('(min-width: 640px)').matches

const handleDocumentClick = (e) => {
  if (!isSearchOpen.value) return
  if (!isDesktop()) return
  const wrapper = searchWrapper.value
  const toggleBtn = searchToggleBtn.value
  const target = e.target
  if (wrapper && wrapper.contains(target)) return
  if (toggleBtn && toggleBtn.contains(target)) return
  isSearchOpen.value = false
}

// ---------- Consolidated lifecycle helpers ----------
const addGlobalEventListeners = () => {
  window.addEventListener('keydown', handleKeydown, { passive: false })
  window.addEventListener('click', handleDocumentClick, true)
}
const removeGlobalEventListeners = () => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleDocumentClick, true)
}

const initLanguageState = async () => {
  await ensureLangFromStorage()
  selectedLanguageCode.value = getCurrentLanguageCode() || selectedLanguageCode.value
}

// ---------- Language dropdown helpers ----------
const LANGUAGE_KEY = 'site-language'
const languages = computed(() => languagesData?.languages || [])
const selectedLanguageCode = ref(localStorage.getItem(LANGUAGE_KEY) || (languages.value[0]?.code ?? 'en'))
const currentLanguage = computed(() => languages.value.find(l => l.code === selectedLanguageCode.value) || languages.value[0] || null)
const currentLanguageNativeName = computed(() => currentLanguage.value?.nativeName || 'Language')

const langDropdownBtn = ref(null)
const langDropdownMenu = ref(null)
const closeLanguageDropdown = () => {
  langDropdownMenu.value?.blur?.()
  langDropdownBtn.value?.blur?.()
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur()
  }
}

const selectLanguage = async (code) => {
  selectedLanguageCode.value = code
  await setAppLanguage(code)
  closeLanguageDropdown()
}

// ---------- Theme helpers (consolidated) ----------
const THEME_KEY = 'theme-preference'
const themeMode = ref('auto')
const isDarkPreferred = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const applyTheme = (mode) => {
  const root = document.documentElement
  if (mode === 'light') root.setAttribute('data-theme', 'light-custom')
  else if (mode === 'dark') root.setAttribute('data-theme', 'dark-custom')
  else root.removeAttribute('data-theme')
}

const setTheme = (mode) => {
  themeMode.value = mode
  try {
    localStorage.setItem(THEME_KEY, mode)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to save theme preference:', err)
  }
  applyTheme(mode)
}

const initTheme = () => {
  const saved = localStorage.getItem(THEME_KEY)
  setTheme(saved === 'light' || saved === 'dark' ? saved : 'auto')
}

const themeIcon = computed(() => {
  if (themeMode.value === 'light') return 'bi-brightness-high'
  if (themeMode.value === 'dark') return 'bi-moon'
  return isDarkPreferred.value ? 'bi-moon' : 'bi-brightness-high'
})

// Use plain JS variables for MediaQueryList (not Vue refs) so lifecycle code is straightforward.
// Provide JSDoc so VSCode infers the type: /** @type {MediaQueryList|null} */
let mediaQueryRef = null
/** @type {((e: MediaQueryListEvent) => void)|null} */
let mqlListenerRef = null

const onSchemeChange = (e) => {
  const matches = 'matches' in e ? e.matches : Boolean(e && e.matches)
  isDarkPreferred.value = matches
  if (themeMode.value === 'auto') applyTheme('auto')
}

// Single consolidated lifecycle registration
onMounted(() => {
  addGlobalEventListeners()
  initTheme()
  void initLanguageState()

  // setup prefers-color-scheme watcher
  mediaQueryRef = window.matchMedia('(prefers-color-scheme: dark)')
  mqlListenerRef = (ev) => onSchemeChange(ev)
  if (mediaQueryRef && mediaQueryRef.addEventListener) {
    mediaQueryRef.addEventListener('change', mqlListenerRef)
  } else if (mediaQueryRef && mediaQueryRef.addListener) {
    // older browsers
    mediaQueryRef.addListener(mqlListenerRef)
  }
})

onBeforeUnmount(() => {
  removeGlobalEventListeners()
  clearHighlights()
  if (mediaQueryRef) {
    if (mediaQueryRef.removeEventListener && mqlListenerRef) {
      mediaQueryRef.removeEventListener('change', mqlListenerRef)
    } else if (mediaQueryRef.removeListener && mqlListenerRef) {
      mediaQueryRef.removeListener(mqlListenerRef)
    }
  }
})

// ---------- Remaining computed texts (unchanged) ----------
const themeTexts = computed(() => appData?.ui?.theme ?? {
  title: 'Tema',
  auto: 'Auto',
  light: 'Claro',
  dark: 'Escuro'
})

const menuTexts = computed(() => appData?.ui?.menu ?? {
  sections: 'Sections',
  actions: 'Actions',
  downloadResume: 'Download Resume'
})
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

mark[data-search-highlight="true"] {
  padding: 0 !important;
  line-height: inherit !important;
  font: inherit !important;
  vertical-align: baseline !important;
  background-clip: padding-box;
}
</style>
