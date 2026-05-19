<script setup lang="ts">
import { Activity, AlarmClock, Clock3, ListFilter } from '@lucide/vue'

defineProps<{
  activeFiltersLabel: string
  nextRaceLabel: string
  startingSoonCount: number
}>()
</script>

<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article class="glass-card-strong theme-transition rounded-[28px] px-6 py-5">
      <AlarmClock class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Starting Soon
      </p>
      <p class="mt-2 text-4xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ startingSoonCount }}
      </p>
    </article>

    <article class="glass-card-strong theme-transition rounded-[28px] px-6 py-5">
      <ListFilter class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Active Filters
      </p>
      <p class="mt-2 text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ activeFiltersLabel }}
      </p>
    </article>

    <article class="glass-card-strong theme-transition rounded-[28px] px-6 py-5">
      <Clock3 class="h-6 w-6 text-app-light-primaryStrong dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Next Race
      </p>
      <p class="mt-2 text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
        {{ nextRaceLabel }}
      </p>
    </article>

    <article class="glass-card-strong theme-transition rounded-[28px] px-6 py-5">
      <Activity class="h-6 w-6 text-app-light-success dark:text-app-dark-accent" />
      <p class="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
        Live Status
      </p>
      <p class="mt-2 text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
        Live Updates ON
      </p>
    </article>
  </section>
</template>
