<script setup lang="ts">
import { computed } from 'vue'
import { classifyCountdownState, formatCountdown } from '@/utils/time'

const props = defineProps<{
  align?: 'left' | 'right'
  nowSeconds: number
  plain?: boolean
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

const timerContainerClassName = computed(() => {
  if (props.plain) {
    switch (countdownState.value) {
      case 'critical-live':
        return 'animate-live-countdown-glow border-app-light-critical/30 bg-app-light-critical/16 text-app-light-critical dark:border-red-300/24 dark:bg-red-400/12 dark:text-red-200'
      case 'urgent':
        return 'border-transparent bg-transparent text-app-light-danger dark:text-red-200'
      case 'warning':
        return 'border-transparent bg-transparent text-app-light-primaryStrong dark:text-app-dark-accent'
      default:
        return 'border-transparent bg-transparent text-app-light-primaryStrong dark:text-app-dark-accent'
    }
  }

  switch (countdownState.value) {
    case 'critical-live':
      return 'animate-live-countdown-glow border-app-light-critical/30 bg-app-light-critical/16 text-app-light-critical dark:border-red-300/24 dark:bg-red-400/12 dark:text-red-200'
    case 'urgent':
      return 'border-app-light-danger/28 bg-app-light-danger/24 text-app-light-danger dark:border-red-300/24 dark:bg-red-400/14 dark:text-red-200'
    case 'warning':
      return 'border-app-light-palettePeriwinkleSoft/90 bg-app-light-palettePeriwinkle/54 text-app-light-primaryStrong dark:border-app-dark-accent/34 dark:bg-app-dark-accentSoft dark:text-app-dark-accent'
    default:
      return 'border-app-light-palettePeriwinkleSoft/90 bg-app-light-palettePeriwinkle/54 text-app-light-primaryStrong dark:border-app-dark-accent/34 dark:bg-app-dark-accentSoft dark:text-app-dark-accent'
  }
})

const timerValueClassName = computed(() => {
  switch (countdownState.value) {
    case 'critical-live':
      return ''
    default:
      return ''
  }
})
</script>

<template>
  <div
    class="theme-transition inline-flex shrink-0 items-center gap-3 rounded-timer border shadow-none"
    :class="[props.plain ? 'px-0 py-0 sm:px-0 sm:py-0' : 'px-4 py-3 sm:px-5 sm:py-4', timerContainerClassName]"
  >
    <div :class="props.align === 'left' ? 'text-left' : 'text-right'">
      <p class="text-xxs font-semibold uppercase tracking-caps-widest opacity-80">
        {{ timerLabel }}
      </p>
      <p
        class="whitespace-nowrap font-mono text-2xl font-semibold tabular-nums lg:text-3xl"
        :class="timerValueClassName"
      >
        {{ countdownLabel }}
      </p>
    </div>
  </div>
</template>
