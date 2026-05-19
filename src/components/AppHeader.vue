<script setup lang="ts">
import { CircleDot } from '@lucide/vue'
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
    class="theme-transition flex flex-col gap-6 border-b border-app-light-border/70 px-5 py-6 sm:px-7 lg:flex-row lg:items-start lg:justify-between lg:px-8 lg:py-7 dark:border-app-dark-border"
  >
    <div class="space-y-2">
      <h1
        class="font-display text-3xl font-semibold tracking-tight text-app-light-primaryStrong dark:text-app-dark-text"
      >
        Next To Go Races
      </h1>
      <p class="max-w-xl text-sm text-app-light-body sm:text-base dark:text-app-dark-muted">
        Real-time racing intelligence dashboard
      </p>
    </div>

    <div class="flex flex-col items-start gap-4 lg:items-end">
      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <div
          class="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-app-light-body dark:text-app-dark-text"
        >
          <CircleDot class="h-4 w-4 text-app-light-success dark:text-app-dark-accent" />
          <span>LIVE UPDATES: ON</span>
        </div>

        <div class="text-right">
          <p class="text-xs uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
            Last Updated
          </p>
          <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
            {{ lastUpdatedLabel }}
          </p>
        </div>

        <ThemeToggle
          :is-following-system="isFollowingSystem"
          :theme="theme"
          @toggle="emit('toggle-theme')"
        />
      </div>
    </div>
  </header>
</template>
