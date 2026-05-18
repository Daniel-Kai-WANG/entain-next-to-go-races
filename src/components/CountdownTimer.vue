<script setup lang="ts">
import { computed } from 'vue'
import { formatCountdown } from '@/utils/time'

const props = defineProps<{
  nowSeconds: number
  startSeconds: number
}>()

const difference = computed(() => props.startSeconds - props.nowSeconds)
const countdownLabel = computed(() => formatCountdown(props.startSeconds, props.nowSeconds))
const timerClassName = computed(() => {
  if (difference.value < 0) {
    return 'border-app-light-danger/20 bg-app-light-danger/10 text-app-light-danger dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100'
  }

  if (difference.value < 60) {
    return 'border-app-light-primary/20 bg-app-light-soft text-app-light-primary dark:border-app-dark-accent/20 dark:bg-app-dark-surface/80 dark:text-app-dark-accent'
  }

  return 'border-app-light-border/80 bg-white/70 text-app-light-text dark:border-app-dark-border dark:bg-app-dark-elevated/70 dark:text-app-dark-text'
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-panel transition"
    :class="timerClassName"
  >
    <span class="font-mono">{{ countdownLabel }}</span>
    <span class="text-[11px] uppercase tracking-[0.2em] opacity-75">
      {{ difference < 0 ? 'Live' : 'To jump' }}
    </span>
  </div>
</template>
