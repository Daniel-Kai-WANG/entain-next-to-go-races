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
  if (
    !racesStore.loading &&
    visibleRaces.value.length > 0 &&
    visibleRaces.value.length < VISIBLE_RACE_COUNT
  ) {
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
  const hasError = racesStore.error !== null
  const hasWaitedLongEnough =
    Date.now() - Math.max(racesStore.lastUpdatedAt ?? 0, lastRefillAttemptAt.value) >=
    REFILL_RETRY_WINDOW_MS

  if (shouldRefill && !hasError && !racesStore.loading && hasWaitedLongEnough) {
    lastRefillAttemptAt.value = Date.now()
    void racesStore.fetchRaces(nowSeconds.value)
  }
}

watch(nowSeconds, maybeRefillVisibleRaces)
watch(() => racesStore.filterState, maybeRefillVisibleRaces, { deep: true })

onMounted(async () => {
  themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  syncResolvedTheme(themeMediaQuery.matches)
  themeMediaQuery.addEventListener('change', handleSystemThemeChange)

  countdownIntervalId = setInterval(() => {
    nowSeconds.value = getNowInSeconds()
  }, COUNTDOWN_INTERVAL_MS)

  refreshIntervalId = setInterval(() => {
    void racesStore.fetchRaces(nowSeconds.value)
  }, RACE_REFRESH_INTERVAL_MS)

  await racesStore.fetchRaces(nowSeconds.value)
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
  <div class="relative isolate min-h-screen overflow-hidden bg-app-light-bg dark:bg-app-dark-bg">
    <div class="pointer-events-none absolute inset-0 bg-app-light-bg dark:bg-dark-glow" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -left-32 top-12 h-[28rem] w-[28rem] rounded-full bg-transparent blur-[140px] dark:bg-app-dark-accent/8"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute right-[-5rem] top-24 h-[24rem] w-[24rem] rounded-full bg-transparent blur-[140px] dark:bg-app-dark-surface/32"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute bottom-[-8rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-transparent blur-[150px] dark:bg-app-dark-surfaceSoft/32"
      aria-hidden="true"
    />

    <div class="fixed inset-x-0 top-0 z-40">
      <div class="w-full">
        <AppHeader
          :is-following-system="isFollowingSystem"
          :last-updated-label="lastUpdatedLabel"
          :theme="resolvedTheme"
          @toggle-theme="handleThemeToggle"
        />
      </div>
    </div>

    <main
      class="relative mx-auto min-h-screen w-full max-w-[1920px] px-4 pb-5 pt-28 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 2xl:px-10"
    >
      <div class="theme-transition rounded-[36px]">

        <section
          class="flex flex-col px-5 py-5 gap-8 sm:px-7 lg:px-8 lg:py-6 dark:border-white/8"
        >
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
          @retry="() => racesStore.fetchRaces(nowSeconds)"
        />
      </div>
    </main>
  </div>
</template>
