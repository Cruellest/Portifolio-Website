<template>
  <button
    class="btn btn-ghost btn-sm btn-circle"
    :title="ui.search.toggle"
    :aria-label="ui.search.toggle"
    @click="toggle"
  >
    <i class="bi bi-search" aria-hidden="true"></i>
  </button>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50" data-search-ignore>
        <div class="absolute inset-0" @click="close"></div>
        <div
          class="absolute left-1/2 top-[15vh] w-[min(92vw,38rem)] -translate-x-1/2 rounded-box border border-base-300/70 bg-base-100/95 shadow-2xl backdrop-blur-xl"
          role="search"
        >
          <div class="flex items-center gap-3 px-4 py-3">
            <i class="bi bi-search text-base-content/50" aria-hidden="true"></i>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="ui.search.placeholder"
              :aria-label="ui.search.toggle"
              class="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-base-content/40"
              @keydown.enter.exact.prevent="nextMatch"
              @keydown.enter.shift.prevent="prevMatch"
              @keydown.escape.prevent="close"
            />
            <span
              v-if="totalMatches > 0"
              class="whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
              :title="ui.search.occurrences"
            >
              {{ currentIndex + 1 }} / {{ totalMatches }}
            </span>
            <span
              v-else-if="query.trim()"
              class="whitespace-nowrap rounded-full bg-base-200 px-2.5 py-1 text-xs text-base-content/50"
            >
              0
            </span>
            <div class="join">
              <button
                class="btn btn-ghost btn-xs join-item"
                :title="ui.common.prev"
                :disabled="totalMatches === 0"
                @click="prevMatch"
              >
                <i class="bi bi-chevron-up" aria-hidden="true"></i>
              </button>
              <button
                class="btn btn-ghost btn-xs join-item"
                :title="ui.common.next"
                :disabled="totalMatches === 0"
                @click="nextMatch"
              >
                <i class="bi bi-chevron-down" aria-hidden="true"></i>
              </button>
            </div>
            <button
              class="btn btn-ghost btn-xs btn-circle"
              :title="ui.search.close"
              :aria-label="ui.search.close"
              @click="close"
            >
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSiteSearch } from '../../composables/useSiteSearch'
import { usePortfolioStore } from '../../stores/portfolio'

const store = usePortfolioStore()
const ui = computed(() => store.ui)

const { isOpen, query, currentIndex, totalMatches, open, close, nextMatch, prevMatch } =
  useSiteSearch()

const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => inputRef.value?.focus()

const toggle = async () => {
  if (isOpen.value) {
    close()
    return
  }
  await open()
  focusInput()
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

const handleGlobalKeydown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  const searchCombo = (isMac && event.metaKey) || (!isMac && event.ctrlKey)

  if (
    (searchCombo && event.key.toLowerCase() === 'f') ||
    (event.key === '/' && !isTypingTarget(event.target))
  ) {
    event.preventDefault()
    if (!isOpen.value) {
      void open().then(focusInput)
    } else {
      focusInput()
      inputRef.value?.select()
    }
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  close()
})
</script>
