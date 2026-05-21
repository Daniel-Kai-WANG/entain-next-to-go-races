import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchNextRaces } from '@/api/racesApi'
import {
  FETCH_COUNT_STEP,
  INITIAL_FETCH_COUNT,
  MAX_FETCH_COUNT,
  MIN_LOADING_DURATION_MS,
  VISIBLE_RACE_COUNT,
} from '@/constants/raceTiming'
import {
  createAllCategoryFilterState,
  getActiveCategoryIds,
  getActiveFiltersLabel,
  mergeRacesWithRetainedLiveWindow,
  getVisibleRaces,
  toggleCategoryFilter,
} from '@/utils/raceFilters'
import type { CategoryFilterState, FilterOptionId, RaceSummary } from '@/types/race'

export const useRacesStore = defineStore('races', () => {
  const races = ref<RaceSummary[]>([])
  const filterState = ref<CategoryFilterState>(createAllCategoryFilterState())
  const activeLoadCount = ref(0)
  const activeAbortController = ref<AbortController | null>(null)
  const hasLoadedOnce = ref(false)
  const loading = computed(() => activeLoadCount.value > 0)
  const initialLoading = computed(() => loading.value && !hasLoadedOnce.value)
  const refreshing = computed(() => loading.value && hasLoadedOnce.value)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<number | null>(null)
  const latestRequestId = ref(0)

  const hasRaces = computed(() => races.value.length > 0)
  const activeCategoryIds = computed(() => getActiveCategoryIds(filterState.value))
  const activeFiltersLabel = computed(() => getActiveFiltersLabel(filterState.value))

  const waitForMinimumLoadingTime = (startedAt: number) => {
    const remainingDuration = MIN_LOADING_DURATION_MS - (Date.now() - startedAt)

    if (remainingDuration <= 0) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      setTimeout(resolve, remainingDuration)
    })
  }

  const isAbortError = (caughtError: unknown) =>
    caughtError instanceof DOMException && caughtError.name === 'AbortError'

  const fetchRaces = async (nowSeconds: number) => {
    const startedAt = Date.now()
    const shouldDelayForInitialLoad = !hasLoadedOnce.value
    const requestId = latestRequestId.value + 1
    const abortController = new AbortController()

    latestRequestId.value = requestId
    activeAbortController.value?.abort()
    activeAbortController.value = abortController

    activeLoadCount.value += 1

    if (requestId === latestRequestId.value) {
      error.value = null
    }

    try {
      let nextCount = INITIAL_FETCH_COUNT
      let nextRaces: RaceSummary[] = []

      while (nextCount <= MAX_FETCH_COUNT) {
        nextRaces = await fetchNextRaces(nextCount, fetch, abortController.signal)

        if (getVisibleRaces(nextRaces, filterState.value, nowSeconds).length >= VISIBLE_RACE_COUNT) {
          break
        }

        nextCount += FETCH_COUNT_STEP
      }

      if (requestId !== latestRequestId.value) {
        return
      }

      races.value = mergeRacesWithRetainedLiveWindow(races.value, nextRaces, nowSeconds)
      hasLoadedOnce.value = true
      lastUpdatedAt.value = Date.now()
    } catch (caughtError) {
      if (requestId !== latestRequestId.value || isAbortError(caughtError)) {
        return
      }

      error.value =
        caughtError instanceof Error ? caughtError.message : 'Unable to load race data right now.'
    } finally {
      if (shouldDelayForInitialLoad) {
        await waitForMinimumLoadingTime(startedAt)
      }

      if (activeAbortController.value === abortController) {
        activeAbortController.value = null
      }

      activeLoadCount.value = Math.max(0, activeLoadCount.value - 1)
    }
  }

  const toggleCategory = (optionId: FilterOptionId) => {
    filterState.value = toggleCategoryFilter(filterState.value, optionId)
  }

  const getProcessedRaces = (nowSeconds: number) => {
    return getVisibleRaces(races.value, filterState.value, nowSeconds)
  }

  return {
    activeCategoryIds,
    activeFiltersLabel,
    error,
    fetchRaces,
    filterState,
    getProcessedRaces,
    hasRaces,
    hasLoadedOnce,
    initialLoading,
    lastUpdatedAt,
    loading,
    races,
    refreshing,
    toggleCategory,
  }
})
