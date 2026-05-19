<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
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
    class="glass-surface theme-transition inline-flex min-h-12 items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-app-light-primaryStrong hover:border-app-light-borderHover hover:shadow-panel-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:text-app-dark-accent dark:hover:border-app-dark-accent/40 dark:hover:shadow-glass-dark"
    :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
    @click="emit('toggle')"
  >
    <span
      class="flex h-9 w-9 items-center justify-center rounded-full bg-app-light-surface text-app-light-primaryStrong dark:bg-app-dark-surfaceSoft dark:text-app-dark-accent"
    >
      <Moon v-if="theme === 'light'" class="h-4 w-4" />
      <Sun v-else class="h-4 w-4" />
    </span>
    <span class="hidden text-left sm:flex sm:flex-col">
      <span class="leading-tight">{{ theme === 'light' ? 'Light mode' : 'Dark mode' }}</span>
      <span class="text-xs font-medium text-app-light-muted dark:text-app-dark-muted">
        {{ isFollowingSystem ? 'Following system' : 'Manual preference saved' }}
      </span>
    </span>
  </button>
</template>
