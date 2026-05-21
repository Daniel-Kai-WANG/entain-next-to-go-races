<script setup lang="ts">
import { computed } from 'vue'
import { Activity, AlarmClock, Clock3, ListFilter } from '@lucide/vue'
import type { CountdownState } from '@/types/race'

const props = defineProps<{
  activeFiltersLabel: string
  nextRaceLabel: string
  nextRaceState: CountdownState | null
  startingSoonCount: number
}>()

const nextRaceClassName = computed(() => {
  switch (props.nextRaceState) {
    case 'critical-live':
      return 'border-transparent bg-transparent text-app-light-critical dark:text-red-200'
    case 'urgent':
      return 'border-app-light-danger/20 bg-app-light-danger/10 text-app-light-danger dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200'
    case 'warning':
      return 'border-app-light-paletteThistleSoft/70 bg-app-light-paletteThistle/26 text-app-light-primaryStrong dark:border-app-dark-accent/25 dark:bg-app-dark-accentSoft dark:text-app-dark-accent'
    default:
      return 'border-app-light-palettePeriwinkleSoft/70 bg-app-light-palettePeriwinkle/24 text-app-light-primaryStrong dark:border-app-dark-accent/25 dark:bg-app-dark-accentSoft dark:text-app-dark-accent'
  }
})
</script>

<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-[clamp(1.25rem,1.9vw,3rem)]">
    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <AlarmClock class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Starting Soon
      </p>
      <p class="mt-2 text-4xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ startingSoonCount }}
      </p>
    </article>

    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <ListFilter class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Active Filters
      </p>
      <p class="mt-2 text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ activeFiltersLabel }}
      </p>
    </article>

    <article
      class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6"
      :class="nextRaceClassName"
    >
      <Clock3 class="h-6 w-6" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] opacity-80">
        Next Race
      </p>
      <p class="mt-2 text-2xl font-semibold">
        {{ nextRaceLabel }}
      </p>
    </article>

    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <Activity class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Live Status
      </p>
      <p class="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
        ON
      </p>
    </article>
  </section>
</template>
