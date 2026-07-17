import { computed, ref } from 'vue'

export type ThemeMode = 'auto' | 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-preference'
const LIGHT_THEME = 'light-custom'
const DARK_THEME = 'dark-custom'

const mode = ref<ThemeMode>('auto')
const systemPrefersDark = ref(false)
let initialized = false

function applyTheme(currentMode: ThemeMode) {
  const root = document.documentElement
  if (currentMode === 'light') root.setAttribute('data-theme', LIGHT_THEME)
  else if (currentMode === 'dark') root.setAttribute('data-theme', DARK_THEME)
  else root.removeAttribute('data-theme')
}

function initTheme() {
  if (initialized) return
  initialized = true

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', (event) => {
    systemPrefersDark.value = event.matches
  })

  let saved: string | null = null
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY)
  } catch {}
  mode.value = saved === 'light' || saved === 'dark' ? saved : 'auto'
  applyTheme(mode.value)
}

export function useTheme() {
  initTheme()

  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode)
    } catch {}
    applyTheme(newMode)
  }

  const isDark = computed(() =>
    mode.value === 'auto' ? systemPrefersDark.value : mode.value === 'dark',
  )

  return { mode, setTheme, isDark }
}
