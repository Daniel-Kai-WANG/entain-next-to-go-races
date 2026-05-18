<script setup lang="ts">
import RaceCard from '@/components/RaceCard.vue'
import type { RaceSummary } from '@/types/race'

defineProps<{
  error: string | null
  loading: boolean
  nowSeconds: number
  races: RaceSummary[]
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="space-y-4 px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-7">
    <div
      v-if="error && races.length === 0"
      class="rounded-[24px] border border-app-light-danger/20 bg-app-light-card/75 p-6 text-left shadow-panel backdrop-blur-glass dark:border-rose-300/20 dark:bg-app-dark-card/70"
    >
      <h2 class="text-lg font-semibold text-app-light-text dark:text-app-dark-text">
        We could not load the latest races.
      </h2>
      <p class="mt-2 text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
        {{ error }}
      </p>
      <button
        type="button"
        class="mt-4 inline-flex min-h-11 items-center rounded-full bg-app-light-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-light-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:bg-app-dark-accent dark:text-app-dark-bg dark:hover:bg-rose-200 dark:focus-visible:outline-app-dark-accent"
        @click="emit('retry')"
      >
        Retry request
      </button>
    </div>

    <div
      v-else-if="loading && races.length === 0"
      class="rounded-[24px] border border-app-light-border/70 bg-app-light-card/75 p-6 shadow-panel backdrop-blur-glass dark:border-app-dark-border dark:bg-app-dark-card/70"
    >
      <h2 class="text-lg font-semibold text-app-light-text dark:text-app-dark-text">
        Loading the next races
      </h2>
      <p class="mt-2 text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
        Pulling the latest list and preparing the next five races.
      </p>
    </div>

    <div
      v-else-if="races.length === 0"
      class="rounded-[24px] border border-app-light-border/70 bg-app-light-card/75 p-6 shadow-panel backdrop-blur-glass dark:border-app-dark-border dark:bg-app-dark-card/70"
    >
      <h2 class="text-lg font-semibold text-app-light-text dark:text-app-dark-text">
        No races are available right now
      </h2>
      <p class="mt-2 text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
        The API returned no visible races for the current moment. Try again shortly.
      </p>
    </div>

    <div v-else class="grid gap-4">
      <RaceCard v-for="race in races" :key="race.race_id" :now-seconds="nowSeconds" :race="race" />
    </div>

    <div
      v-if="error && races.length > 0"
      class="rounded-[22px] border border-app-light-danger/20 bg-app-light-card/65 px-4 py-3 text-sm text-app-light-body backdrop-blur-glass dark:border-rose-300/20 dark:bg-app-dark-card/65 dark:text-app-dark-muted"
    >
      Showing the latest cached races. {{ error }}
    </div>
  </section>
</template>
