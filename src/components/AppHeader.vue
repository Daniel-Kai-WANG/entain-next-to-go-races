<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import type { ThemeMode } from '@/types/race'

defineProps<{
  isFollowingSystem: boolean
  lastUpdatedLabel: string
  theme: ThemeMode
}>()

const emit = defineEmits<{
  'toggle-theme': []
}>()
</script>

<template>
  <header
    class="flex flex-col gap-6 border-b border-app-light-border/70 px-5 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-8 dark:border-app-dark-border"
  >
    <div class="max-w-2xl space-y-3">
      <span
        class="inline-flex rounded-full bg-app-light-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-app-light-primary dark:bg-app-dark-surface/85 dark:text-app-dark-accent"
      >
        Entain Next To Go
      </span>
      <div class="space-y-2">
        <h1
          class="font-display text-3xl font-semibold tracking-tight text-app-light-text sm:text-4xl dark:text-app-dark-text"
        >
          Next to Go races, ordered and ready to move.
        </h1>
        <p
          class="max-w-xl text-sm leading-6 text-app-light-body sm:text-base dark:text-app-dark-muted"
        >
          Five upcoming races stay in view when available, update every second, and disappear one
          minute after their advertised start.
        </p>
      </div>
    </div>

    <div class="flex flex-col items-start gap-3 self-stretch lg:items-end">
      <ThemeToggle
        :is-following-system="isFollowingSystem"
        :theme="theme"
        @toggle="emit('toggle-theme')"
      />
      <p
        class="text-xs font-medium uppercase tracking-[0.2em] text-app-light-muted dark:text-app-dark-muted"
      >
        Last updated {{ lastUpdatedLabel }}
      </p>
    </div>
  </header>
</template>
