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

const nextRaceValueClassName = computed(() => {
  switch (props.nextRaceState) {
    case 'critical-live':
      return 'text-app-light-critical dark:text-red-200'
    case 'urgent':
      return 'text-app-light-danger dark:text-red-200'
    default:
      return 'text-app-light-primaryStrong dark:text-app-dark-accent'
  }
})
</script>

<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-overview">
    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <AlarmClock class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-caps-wide text-app-light-muted dark:text-app-dark-muted">
        Starting Soon
      </p>
      <p class="mt-2 text-4xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ startingSoonCount }}
      </p>
    </article>

    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <ListFilter class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-caps-wide text-app-light-muted dark:text-app-dark-muted">
        Active Filters
      </p>
      <p class="mt-2 text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ activeFiltersLabel }}
      </p>
    </article>

    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <Clock3 class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-caps-wide text-app-light-muted dark:text-app-dark-muted">
        Next Race
      </p>
      <p class="mt-2 text-2xl font-semibold" :class="nextRaceValueClassName">
        {{ nextRaceLabel }}
      </p>
    </article>

    <article class="glass-card-strong light-flat-panel theme-transition flex flex-col items-center text-center rounded-2xl border-app-light-bodyBorder shadow-glass-strong-deep px-6 py-5 2xl:px-7 2xl:py-6">
      <Activity class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-caps-wide text-app-light-muted dark:text-app-dark-muted">
        Live Status
      </p>
      <p class="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
        ON
      </p>
    </article>
  </section>
</template>
