<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import CategoryToggle from '@/components/CategoryToggle.vue'
import RaceList from '@/components/RaceList.vue'
import StatsOverview from '@/components/StatsOverview.vue'
import {
  COUNTDOWN_INTERVAL_MS,
  RACE_REFRESH_INTERVAL_MS,
  REFILL_RETRY_WINDOW_MS,
  VISIBLE_RACE_COUNT,
} from '@/constants/raceTiming'
import { useRacesStore } from '@/stores/racesStore'
import {
  applyThemeMode,
  getStoredThemePreference,
  resolveThemeMode,
  setStoredThemePreference,
} from '@/utils/themeStorage'
import {
  classifyCountdownState,
  formatCountdown,
  formatLastUpdated,
  getNowInSeconds,
  nextThemeMode,
} from '@/utils/time'
import type { ThemeMode } from '@/types/race'

const racesStore = useRacesStore()

const nowSeconds = ref(getNowInSeconds())
const resolvedTheme = ref<ThemeMode>('light')
const storedThemePreference = ref<ThemeMode | null>(getStoredThemePreference())
const lastRefillAttemptAt = ref(0)

let countdownIntervalId: ReturnType<typeof setInterval> | undefined
let refreshIntervalId: ReturnType<typeof setInterval> | undefined
let themeMediaQuery: MediaQueryList | undefined

const isFollowingSystem = computed(() => storedThemePreference.value === null)
const lastUpdatedLabel = computed(() =>
  formatLastUpdated(racesStore.lastUpdatedAt, nowSeconds.value * 1000),
)
const visibleRaces = computed(() => racesStore.getProcessedRaces(nowSeconds.value))
const startingSoonCount = computed(
  () =>
    visibleRaces.value.filter(
      (race) =>
        classifyCountdownState(race.advertised_start.seconds, nowSeconds.value) === 'urgent',
    ).length,
)
const nextRaceLabel = computed(() => {
  const [nextRace] = visibleRaces.value

  return nextRace ? formatCountdown(nextRace.advertised_start.seconds, nowSeconds.value) : '--'
})
const helperMessage = computed(() => {
  if (visibleRaces.value.length > 0 && visibleRaces.value.length < VISIBLE_RACE_COUNT) {
    return 'Fewer than 5 races are currently available for this filter.'
  }

  return null
})

function syncResolvedTheme(prefersDark = themeMediaQuery?.matches ?? false) {
  resolvedTheme.value = resolveThemeMode(storedThemePreference.value, prefersDark)
  applyThemeMode(resolvedTheme.value)
}

function handleThemeToggle() {
  storedThemePreference.value = nextThemeMode(resolvedTheme.value)
  setStoredThemePreference(storedThemePreference.value)
  syncResolvedTheme()
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  if (storedThemePreference.value === null) {
    syncResolvedTheme(event.matches)
  }
}

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
  themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  syncResolvedTheme(themeMediaQuery.matches)
  themeMediaQuery.addEventListener('change', handleSystemThemeChange)

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

  themeMediaQuery?.removeEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-light-glow dark:bg-dark-glow" aria-hidden="true" />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-gradient-to-b from-white/55 via-white/10 to-transparent dark:from-white/5 dark:via-transparent"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-app-light-soft/80 blur-[110px] dark:bg-app-dark-accent/10"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-app-light-blush/60 blur-[110px] dark:bg-app-dark-surface/40"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-app-light-rose/30 blur-[120px] dark:bg-app-dark-surfaceSoft/45"
      aria-hidden="true"
    />

    <main class="relative mx-auto min-h-screen w-full max-w-[1560px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div class="glass-card-strong theme-transition overflow-hidden rounded-[36px]">
        <AppHeader
          :is-following-system="isFollowingSystem"
          :last-updated-label="lastUpdatedLabel"
          :theme="resolvedTheme"
          @toggle-theme="handleThemeToggle"
        />

        <section class="space-y-6 px-5 py-5 sm:px-7 lg:px-8 lg:py-6">
          <StatsOverview
            :active-filters-label="racesStore.activeFiltersLabel"
            :next-race-label="nextRaceLabel"
            :starting-soon-count="startingSoonCount"
          />

          <CategoryToggle :filter-state="racesStore.filterState" @toggle="racesStore.toggleCategory" />
        </section>

        <RaceList
          :error="racesStore.error"
          :helper-message="helperMessage"
          :loading="racesStore.loading"
          :now-seconds="nowSeconds"
          :races="visibleRaces"
          @retry="racesStore.fetchRaces"
        />
      </div>
    </main>
  </div>
</template>
