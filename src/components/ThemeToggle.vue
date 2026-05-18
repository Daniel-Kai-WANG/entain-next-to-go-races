<script setup lang="ts">
import type { ThemeMode } from '@/types/race'

defineProps<{
  isFollowingSystem: boolean
  theme: ThemeMode
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="group inline-flex items-center gap-3 rounded-full border border-app-light-border/70 bg-white/65 px-4 py-2 text-sm font-medium text-app-light-text shadow-panel backdrop-blur-glass transition hover:border-app-light-primary/40 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:border-app-dark-border dark:bg-app-dark-elevated/75 dark:text-app-dark-text dark:hover:border-app-dark-accent/50 dark:hover:bg-app-dark-elevated"
    :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
    @click="emit('toggle')"
  >
    <span class="text-base leading-none">
      {{ theme === 'dark' ? '🌙' : '☀️' }}
    </span>
    <span class="flex flex-col items-start leading-tight">
      <span>{{ theme === 'dark' ? 'Dark mode' : 'Light mode' }}</span>
      <span class="text-xs text-app-light-muted dark:text-app-dark-muted">
        {{ isFollowingSystem ? 'Following system' : 'Manual preference saved' }}
      </span>
    </span>
  </button>
</template>
