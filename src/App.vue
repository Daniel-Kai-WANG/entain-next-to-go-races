<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import CategoryToggle from '@/components/CategoryToggle.vue'
import RaceList from '@/components/RaceList.vue'
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
import { formatLastUpdated, getNowInSeconds, nextThemeMode } from '@/utils/time'
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
const lastUpdatedLabel = computed(() => formatLastUpdated(racesStore.lastUpdatedAt))
const visibleRaces = computed(() => racesStore.getProcessedRaces(nowSeconds.value))

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
        <AppHeader
          :is-following-system="isFollowingSystem"
          :last-updated-label="lastUpdatedLabel"
          :theme="resolvedTheme"
          @toggle-theme="handleThemeToggle"
        />

        <section
          class="border-b border-app-light-border/70 px-5 py-5 sm:px-7 lg:px-8 dark:border-app-dark-border"
        >
          <CategoryToggle
            :filter-state="racesStore.filterState"
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
