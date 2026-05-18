<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import CategoryToggle from '@/components/CategoryToggle.vue'
import RaceList from '@/components/RaceList.vue'
import {
  COUNTDOWN_INTERVAL_MS,
  RACE_REFRESH_INTERVAL_MS,
  REFILL_RETRY_WINDOW_MS,
  VISIBLE_RACE_COUNT,
} from '@/constants/raceTiming'
import { useRacesStore } from '@/stores/racesStore'
import { formatLastUpdated, getNowInSeconds } from '@/utils/time'

const racesStore = useRacesStore()

const nowSeconds = ref(getNowInSeconds())
const lastRefillAttemptAt = ref(0)

let countdownIntervalId: ReturnType<typeof setInterval> | undefined
let refreshIntervalId: ReturnType<typeof setInterval> | undefined

const lastUpdatedLabel = computed(() => formatLastUpdated(racesStore.lastUpdatedAt))
const visibleRaces = computed(() => racesStore.getProcessedRaces(nowSeconds.value))

function maybeRefillVisibleRaces() {
  const shouldRefill = visibleRaces.value.length < VISIBLE_RACE_COUNT
  const hasWaitedLongEnough =
    Date.now() - Math.max(racesStore.lastUpdatedAt ?? 0, lastRefillAttemptAt.value) >=
    REFILL_RETRY_WINDOW_MS

  if (shouldRefill && !racesStore.loading && hasWaitedLongEnough) {
    lastRefillAttemptAt.value = Date.now()
    void racesStore.fetchRaces()
  }
}

watch(nowSeconds, maybeRefillVisibleRaces)

onMounted(async () => {
  countdownIntervalId = setInterval(() => {
    nowSeconds.value = getNowInSeconds()
  }, COUNTDOWN_INTERVAL_MS)

  refreshIntervalId = setInterval(() => {
    void racesStore.fetchRaces()
  }, RACE_REFRESH_INTERVAL_MS)

  await racesStore.fetchRaces()
  maybeRefillVisibleRaces()
})

onUnmounted(() => {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId)
  }

  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-light-glow dark:bg-dark-glow"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-20 top-24 h-52 w-52 rounded-full bg-app-light-primary/15 blur-3xl dark:bg-app-dark-accent/10"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute bottom-8 right-0 h-72 w-72 rounded-full bg-app-light-softAlt/60 blur-3xl dark:bg-app-dark-surface/35"
      aria-hidden="true"
    />

    <main
      class="relative mx-auto flex min-h-screen w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
    >
      <div
        class="flex w-full flex-col rounded-[32px] border border-app-light-border/75 bg-app-light-elevated/65 shadow-glass backdrop-blur-glass dark:border-app-dark-border dark:bg-app-dark-card/60 dark:shadow-glass-dark"
      >
        <header
          class="flex flex-col gap-4 border-b border-app-light-border/70 px-5 py-6 sm:px-7 lg:px-8 lg:py-8 dark:border-app-dark-border"
        >
          <span
            class="inline-flex w-fit rounded-full bg-app-light-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-app-light-primary dark:bg-app-dark-surface/85 dark:text-app-dark-accent"
          >
            Entain Next To Go
          </span>
          <div class="space-y-2">
            <h1
              class="font-display text-3xl font-semibold tracking-tight text-app-light-text sm:text-4xl dark:text-app-dark-text"
            >
              Next to Go races, ordered and ready to move.
            </h1>
            <p class="max-w-xl text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
              Five upcoming races stay in view when available, update every second, and disappear
              one minute after their advertised start.
            </p>
          </div>
          <p
            class="text-xs font-medium uppercase tracking-[0.2em] text-app-light-muted dark:text-app-dark-muted"
          >
            Last updated {{ lastUpdatedLabel }}
          </p>
        </header>

        <section
          class="border-b border-app-light-border/70 px-5 py-5 sm:px-7 lg:px-8 dark:border-app-dark-border"
        >
          <CategoryToggle
            :selected-categories="racesStore.selectedCategories"
            @toggle="racesStore.toggleCategory"
          />
        </section>

        <RaceList
          :error="racesStore.error"
          :loading="racesStore.loading"
          :now-seconds="nowSeconds"
          :races="visibleRaces"
          @retry="racesStore.fetchRaces"
        />
      </div>
    </main>
  </div>
</template>
