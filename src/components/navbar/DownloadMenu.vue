<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-primary btn-sm gap-2 rounded-full"
      :title="ui.menu.downloadResumeTitle"
    >
      <i class="bi bi-download" aria-hidden="true"></i>
      <span class="hidden lg:inline">{{ ui.menu.downloadResume }}</span>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu z-50 mt-3 w-60 rounded-box border border-base-300/70 bg-base-100 p-2 shadow-xl"
    >
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '../../stores/portfolio'
import { blurActiveElement } from '../../utils/dom'

const store = usePortfolioStore()
const router = useRouter()

const ui = computed(() => store.ui)

const goTo = (path: string) => {
  blurActiveElement()
  void router.push(path)
}
</script>
