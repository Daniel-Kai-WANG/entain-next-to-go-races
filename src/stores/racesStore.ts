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
  getVisibleRaces,
  toggleCategoryFilter,
} from '@/utils/raceFilters'
import type { CategoryFilterState, FilterOptionId, RaceSummary } from '@/types/race'

export const useRacesStore = defineStore('races', () => {
  const races = ref<RaceSummary[]>([])
  const filterState = ref<CategoryFilterState>(createAllCategoryFilterState())
  const activeLoadCount = ref(0)
  const loading = computed(() => activeLoadCount.value > 0)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<number | null>(null)

  const hasRaces = computed(() => races.value.length > 0)
  const activeCategoryIds = computed(() => getActiveCategoryIds(filterState.value))
  const activeFiltersLabel = computed(() => getActiveFiltersLabel(filterState.value))

  function waitForMinimumLoadingTime(startedAt: number) {
    const remainingDuration = MIN_LOADING_DURATION_MS - (Date.now() - startedAt)

    if (remainingDuration <= 0) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      setTimeout(resolve, remainingDuration)
    })
  }

  async function fetchRaces(nowSeconds: number) {
    const startedAt = Date.now()

    activeLoadCount.value += 1
    error.value = null

    try {
      let nextCount = INITIAL_FETCH_COUNT
      let nextRaces: RaceSummary[] = []

      while (nextCount <= MAX_FETCH_COUNT) {
        nextRaces = await fetchNextRaces(nextCount)

        if (getVisibleRaces(nextRaces, filterState.value, nowSeconds).length >= VISIBLE_RACE_COUNT) {
          break
        }

        nextCount += FETCH_COUNT_STEP
      }

      races.value = nextRaces
      lastUpdatedAt.value = Date.now()
    } catch (caughtError) {
      error.value =
        caughtError instanceof Error ? caughtError.message : 'Unable to load race data right now.'
    } finally {
      await waitForMinimumLoadingTime(startedAt)
      activeLoadCount.value = Math.max(0, activeLoadCount.value - 1)
    }
  }

  function toggleCategory(optionId: FilterOptionId) {
    filterState.value = toggleCategoryFilter(filterState.value, optionId)
  }

  function getProcessedRaces(nowSeconds: number) {
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
    lastUpdatedAt,
    loading,
    races,
    toggleCategory,
  }
})
