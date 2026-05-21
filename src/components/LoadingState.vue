<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue'

withDefaults(
  defineProps<{
    compact?: boolean
    label?: string
  }>(),
  {
    compact: false,
    label: 'Loading latest races',
  },
)
</script>

<template>
  <div
    class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center justify-center rounded-panel border-app-light-bodyBorder shadow-glass-strong-deep text-center"
    :class="compact ? 'min-h-[220px] px-6 py-8' : 'min-h-[320px] px-8 py-12'"
    aria-busy="true"
    aria-live="polite"
  >
    <span
      class="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white/50 text-app-light-primaryStrong backdrop-blur-shimmer dark:border-white/10 dark:bg-white/5 dark:text-app-dark-accent"
    >
      <LoaderCircle class="h-7 w-7 animate-spin" />
    </span>
    <h2 class="mt-5 text-lg font-semibold text-app-light-text dark:text-app-dark-text">
      {{ label }}
    </h2>
    <p class="mt-2 max-w-sm text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
      Pulling the latest race feed and preparing the next set of visible races.
    </p>
  </div>
</template>
