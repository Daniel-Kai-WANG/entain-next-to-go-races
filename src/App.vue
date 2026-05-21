<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import CategoryToggle from '@/components/CategoryToggle.vue'
import RaceList from '@/components/RaceList.vue'
import StatsOverview from '@/components/StatsOverview.vue'
import { SYSTEM_THEME_MEDIA_QUERY } from '@/constants/app'
import {
  COUNTDOWN_INTERVAL_MS,
  MIN_LOADING_DURATION_MS,
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
import { getNextUpcomingRace } from '@/utils/raceFilters'
import type { ThemeMode } from '@/types/race'

const racesStore = useRacesStore()

const nowSeconds = ref(getNowInSeconds())
const resolvedTheme = ref<ThemeMode>('light')
const storedThemePreference = ref<ThemeMode | null>(getStoredThemePreference())
const lastRefillAttemptAt = ref(0)
const blockingRefillPending = ref(false)
const headerStatusLabel = ref<'Loading' | null>(null)
const headerStatusVisibleUntil = ref(0)

let countdownIntervalId: ReturnType<typeof setInterval> | undefined
let refreshIntervalId: ReturnType<typeof setInterval> | undefined
let themeMediaQuery: MediaQueryList | undefined
let headerStatusTimeoutId: ReturnType<typeof setTimeout> | undefined

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
  const nextRace = getNextUpcomingRace(visibleRaces.value, nowSeconds.value)

  return nextRace ? formatCountdown(nextRace.advertised_start.seconds, nowSeconds.value) : '--'
})
const nextRaceState = computed(() => {
  const nextRace = getNextUpcomingRace(visibleRaces.value, nowSeconds.value)

  return nextRace
    ? classifyCountdownState(nextRace.advertised_start.seconds, nowSeconds.value)
    : null
})
const blockingLoading = computed(
  () =>
    racesStore.initialLoading ||
    blockingRefillPending.value ||
    (racesStore.loading && visibleRaces.value.length < VISIBLE_RACE_COUNT),
)
const helperMessage = computed(() => {
  if (
    !racesStore.loading &&
    visibleRaces.value.length > 0 &&
    visibleRaces.value.length < VISIBLE_RACE_COUNT
  ) {
    return 'Fewer than 5 races are currently available for this filter.'
  }

  return null
})
const handleRetry = () => racesStore.fetchRaces(nowSeconds.value)
const rawHeaderStatusLabel = computed<'Loading' | null>(() => {
  if (racesStore.refreshing || lastUpdatedLabel.value === 'Waiting') {
    return 'Loading'
  }

  return null
})

const scheduleHeaderStatusHide = () => {
  if (headerStatusTimeoutId) {
    clearTimeout(headerStatusTimeoutId)
  }

  const remainingDuration = headerStatusVisibleUntil.value - Date.now()

  if (remainingDuration <= 0) {
    headerStatusLabel.value = null
    return
  }

  headerStatusTimeoutId = setTimeout(() => {
    headerStatusLabel.value = null
    headerStatusTimeoutId = undefined
  }, remainingDuration)
}

const syncResolvedTheme = (prefersDark = themeMediaQuery?.matches ?? false) => {
  resolvedTheme.value = resolveThemeMode(storedThemePreference.value, prefersDark)
  applyThemeMode(resolvedTheme.value)
}

const handleThemeToggle = () => {
  storedThemePreference.value = nextThemeMode(resolvedTheme.value)
  setStoredThemePreference(storedThemePreference.value)
  syncResolvedTheme()
}

const handleSystemThemeChange = (event: MediaQueryListEvent) => {
  if (storedThemePreference.value === null) {
    syncResolvedTheme(event.matches)
  }
}

const maybeRefillVisibleRaces = (force = false) => {
  const shouldRefill = visibleRaces.value.length < VISIBLE_RACE_COUNT
  const hasError = racesStore.error !== null
  const hasWaitedLongEnough =
    Date.now() - Math.max(racesStore.lastUpdatedAt ?? 0, lastRefillAttemptAt.value) >=
    REFILL_RETRY_WINDOW_MS

  if (shouldRefill && !hasError && !racesStore.loading && (force || hasWaitedLongEnough)) {
    lastRefillAttemptAt.value = Date.now()
    blockingRefillPending.value = true
    void racesStore.fetchRaces(nowSeconds.value).finally(() => {
      blockingRefillPending.value = false
    })
  }
}

watch(nowSeconds, () => {
  maybeRefillVisibleRaces()
})
watch(
  rawHeaderStatusLabel,
  (nextStatus) => {
    if (nextStatus) {
      if (headerStatusTimeoutId) {
        clearTimeout(headerStatusTimeoutId)
        headerStatusTimeoutId = undefined
      }

      headerStatusLabel.value = nextStatus
      headerStatusVisibleUntil.value = Date.now() + MIN_LOADING_DURATION_MS
      return
    }

    scheduleHeaderStatusHide()
  },
  { immediate: true },
)
watch(
  () => racesStore.filterState,
  () => {
    maybeRefillVisibleRaces(true)
  },
  { deep: true },
)

onMounted(async () => {
  themeMediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY)
  syncResolvedTheme(themeMediaQuery.matches)
  themeMediaQuery.addEventListener('change', handleSystemThemeChange)

  countdownIntervalId = setInterval(() => {
    nowSeconds.value = getNowInSeconds()
  }, COUNTDOWN_INTERVAL_MS)

  refreshIntervalId = setInterval(() => {
    void racesStore.fetchRaces(nowSeconds.value)
  }, RACE_REFRESH_INTERVAL_MS)

  await racesStore.fetchRaces(nowSeconds.value)
  maybeRefillVisibleRaces(true)
})

onUnmounted(() => {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId)
  }

  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }

  if (headerStatusTimeoutId) {
    clearTimeout(headerStatusTimeoutId)
  }

  themeMediaQuery?.removeEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden bg-app-light-bg dark:bg-app-dark-bg">
    <div class="pointer-events-none absolute inset-0 bg-app-light-bg dark:bg-dark-glow" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -left-32 top-12 h-orb w-orb rounded-full bg-transparent blur-orb dark:bg-app-dark-accent/8"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-20 top-24 h-96 w-96 rounded-full bg-transparent blur-orb dark:bg-app-dark-surface/32"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-32 left-orb-anchor h-96 w-96 rounded-full bg-transparent blur-orb-strong dark:bg-app-dark-surfaceSoft/32"
      aria-hidden="true"
    />

    <div class="fixed inset-x-0 top-0 z-40">
      <div class="w-full">
        <AppHeader
          :is-following-system="isFollowingSystem"
          :last-updated-label="lastUpdatedLabel"
          :status-chip-label="headerStatusLabel"
          :theme="resolvedTheme"
          @toggle-theme="handleThemeToggle"
        />
      </div>
    </div>

    <main
      class="relative mx-auto min-h-screen w-full max-w-app px-4 pb-5 pt-36 sm:px-6 sm:pb-6 sm:pt-24 lg:px-8 lg:pb-8 lg:pt-28"
    >
      <div class="theme-transition rounded-5xl">

        <section
          class="flex flex-col px-5 py-10 gap-8 sm:px-7 lg:px-8 lg:py-6 dark:border-white/8"
        >
          <StatsOverview
            :active-filters-label="racesStore.activeFiltersLabel"
            :next-race-label="nextRaceLabel"
            :next-race-state="nextRaceState"
            :starting-soon-count="startingSoonCount"
          />

          <CategoryToggle :filter-state="racesStore.filterState" @toggle="racesStore.toggleCategory" />
        </section>

        <RaceList
          :blocking-loading="blockingLoading"
          :error="racesStore.error"
          :helper-message="helperMessage"
          :loading="racesStore.loading"
          :now-seconds="nowSeconds"
          :races="visibleRaces"
          @retry="handleRetry"
        />
      </div>
    </main>
  </div>
</template>
