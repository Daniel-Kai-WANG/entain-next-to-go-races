<script setup lang="ts">
import { RefreshCw, TriangleAlert } from '@lucide/vue'

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="glass-card-strong light-flat-panel theme-transition flex min-h-[320px] flex-col justify-center gap-4 rounded-[28px] border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-8 text-left"
  >
    <span
      class="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-light-danger/10 text-app-light-danger dark:bg-red-400/10 dark:text-red-200"
    >
      <TriangleAlert class="h-6 w-6" />
    </span>
    <h2 class="text-xl font-semibold text-app-light-text dark:text-app-dark-text">
      We could not load the latest races
    </h2>
    <p class="max-w-xl text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
      {{ message }}
    </p>
    <button
      type="button"
      class="theme-transition inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-app-light-primary px-5 py-3 text-sm font-semibold text-white hover:bg-app-light-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:bg-app-dark-accent dark:text-app-dark-bg dark:hover:bg-rose-200"
      @click="emit('retry')"
    >
      <RefreshCw class="h-4 w-4" />
      <span>Retry request</span>
    </button>
  </div>
</template>
