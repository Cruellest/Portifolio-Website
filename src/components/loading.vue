<template>
  <div
    v-if="show"
    class="no-print print:hidden fixed inset-0 z-50 grid place-items-center bg-base-100/60 backdrop-blur-sm"
  >
    <div class="bg-base-100/80 backdrop-blur-md rounded-box p-6 sm:p-8 shadow-xl text-center w-[min(90vw,28rem)]">
      <div v-if="status === 'loading'" class="flex flex-col items-center gap-3">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-base-content/80">{{ message || 'Loading…' }}</p>
      </div>
      <div v-else class="flex flex-col items-center gap-3">
        <button class="btn btn-primary w-full" @click="$emit('action')">
          Return to menu
        </button>
        <p class="text-xs text-base-content/60" v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  status: 'loading' | 'action'
  message?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
