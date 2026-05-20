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
    class="theme-transition relative flex flex-col gap-6 bg-app-light-navBg px-5 py-4 backdrop-blur-xl shadow-[0_18px_42px_-30px_rgba(124,77,255,0.18),0_10px_24px_-22px_rgba(15,23,42,0.16)] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#DCB6D5] after:content-[''] lg:flex-row lg:items-start lg:justify-between dark:bg-[rgb(43_43_71_/_0.84)] dark:shadow-[0_24px_48px_-32px_rgba(0,0,0,0.62),0_12px_28px_-24px_rgba(0,0,0,0.38)] dark:after:bg-white/10"
  >
    <div class="space-y-1">
      <h1
        class="font-display text-3xl font-semibold tracking-tight text-app-light-primaryStrong dark:text-app-dark-text"
      >
        Next To Go Races
      </h1>
      <p class="max-w-xl text-sm font-semibold text-app-light-body sm:text-base dark:text-app-dark-muted">
        Real-time racing intelligence dashboard
      </p>
    </div>

    <ThemeToggle
      :theme="theme"
      @toggle="emit('toggle-theme')"
    />
  </header>
</template>
