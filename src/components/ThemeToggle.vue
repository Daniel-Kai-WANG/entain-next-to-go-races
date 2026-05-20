<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import type { ThemeMode } from '@/types/race'

defineProps<{
  theme: ThemeMode
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="flex flex-col items-start lg:items-end">
    <button
      type="button"
      class="theme-transition inline-flex flex-col items-start gap-2 border border-transparent bg-transparent px-0 py-0 text-sm font-semibold text-app-light-primaryStrong shadow-none hover:border-transparent hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary sm:min-h-12 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:border-app-light-softAlt sm:bg-glass-light sm:px-4 sm:py-2 sm:shadow-glass sm:hover:border-app-light-primaryStrong sm:hover:shadow-panel-hover dark:text-app-dark-accent dark:sm:border-white/10 dark:sm:bg-glass-dark dark:sm:shadow-glass-dark dark:sm:hover:border-app-dark-accent/40 dark:sm:hover:shadow-glass-dark"
      :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
      @click="emit('toggle')"
    >
      <span
        class="flex h-9 w-9 items-center justify-center rounded-full bg-app-light-surface text-app-light-primaryStrong dark:bg-app-dark-surfaceSoft dark:text-app-dark-accent"
      >
        <Moon v-if="theme === 'light'" class="h-4 w-4" />
        <Sun v-else class="h-4 w-4" />
      </span>
      <span class="hidden text-left sm:inline">
        <span class="leading-tight">{{ theme === 'light' ? 'Light mode' : 'Dark mode' }}</span>
      </span>
    </button>
  </div>
</template>
