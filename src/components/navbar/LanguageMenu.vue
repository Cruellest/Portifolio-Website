<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-sm gap-1.5 rounded-full"
      :aria-label="currentLanguage?.nativeName"
    >
      <i class="bi bi-translate" aria-hidden="true"></i>
      <span class="text-xs font-semibold uppercase">{{ store.languageCode }}</span>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu z-50 mt-3 w-44 rounded-box border border-base-300/70 bg-base-100 p-2 shadow-xl"
    >
      <li v-for="lang in store.languages" :key="lang.code">
        <button
          class="flex items-center justify-between"
          :class="{ 'font-semibold text-primary': lang.code === store.languageCode }"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.nativeName }}
          <i v-if="lang.code === store.languageCode" class="bi bi-check-lg" aria-hidden="true"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioStore } from '../../stores/portfolio'
import { blurActiveElement } from '../../utils/dom'

const store = usePortfolioStore()

const currentLanguage = computed(() =>
  store.languages.find((lang) => lang.code === store.languageCode),
)

const selectLanguage = async (code: string) => {
  await store.setLanguage(code)
  blurActiveElement()
}
</script>
