<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-sm btn-circle"
      :aria-label="ui.theme.title"
      :title="ui.theme.title"
    >
      <i class="bi" :class="currentIcon" aria-hidden="true"></i>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu z-50 mt-3 w-44 rounded-box border border-base-300/70 bg-base-100 p-2 shadow-xl"
    >
      <li v-for="option in options" :key="option.mode">
        <button
          class="flex items-center gap-2"
          :class="{ 'font-semibold text-primary': mode === option.mode }"
          @click="selectTheme(option.mode)"
        >
          <i class="bi" :class="option.icon" aria-hidden="true"></i>
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme, type ThemeMode } from '../../composables/useTheme'
import { usePortfolioStore } from '../../stores/portfolio'
import { blurActiveElement } from '../../utils/dom'

const store = usePortfolioStore()
const { mode, setTheme, isDark } = useTheme()

const ui = computed(() => store.ui)

const options = computed((): { mode: ThemeMode; label: string; icon: string }[] => [
  { mode: 'auto', label: ui.value.theme.auto, icon: 'bi-circle-half' },
  { mode: 'light', label: ui.value.theme.light, icon: 'bi-brightness-high' },
  { mode: 'dark', label: ui.value.theme.dark, icon: 'bi-moon' },
])

const currentIcon = computed(() => {
  if (mode.value === 'light') return 'bi-brightness-high'
  if (mode.value === 'dark') return 'bi-moon'
  return isDark.value ? 'bi-moon' : 'bi-brightness-high'
})

const selectTheme = (newMode: ThemeMode) => {
  setTheme(newMode)
  blurActiveElement()
}
</script>
