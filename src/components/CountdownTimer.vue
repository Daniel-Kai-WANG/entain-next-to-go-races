<script setup lang="ts">
import { computed } from 'vue'
import { classifyCountdownState, formatCountdown } from '@/utils/time'

const props = defineProps<{
  nowSeconds: number
  startSeconds: number
}>()

const countdownState = computed(() => classifyCountdownState(props.startSeconds, props.nowSeconds))
const countdownLabel = computed(() => formatCountdown(props.startSeconds, props.nowSeconds))
const timerLabel = computed(() => {
  switch (countdownState.value) {
    case 'critical-live':
      return 'Jump In'
    case 'urgent':
      return 'Closing Soon'
    default:
      return 'Starts In'
  }
})

const timerClassName = computed(() => {
  switch (countdownState.value) {
    case 'critical-live':
      return 'border-app-light-critical/20 bg-app-light-critical/10 text-app-light-critical dark:border-red-300/25 dark:bg-red-400/10 dark:text-red-200 animate-pulse-soft'
    case 'urgent':
      return 'border-app-light-danger/20 bg-app-light-danger/10 text-app-light-danger dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200'
    case 'warning':
      return 'border-app-light-warning/20 bg-amber-50/80 text-app-light-warning dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200'
    default:
      return 'border-app-light-primary/15 bg-app-light-soft/45 text-app-light-primaryStrong dark:border-app-dark-accent/25 dark:bg-app-dark-accentSoft dark:text-app-dark-accent'
  }
})
</script>

<template>
  <div
    class="theme-transition inline-flex shrink-0 items-center gap-3 rounded-[22px] border px-4 py-3 shadow-panel sm:px-5 sm:py-4"
    :class="timerClassName"
  >
    <div class="text-right">
      <p class="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
        {{ timerLabel }}
      </p>
      <p class="whitespace-nowrap font-mono text-2xl font-semibold tabular-nums lg:text-3xl">
        {{ countdownLabel }}
      </p>
    </div>
  </div>
</template>
