import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchNextRaces } from '@/api/racesApi'
import {
  FETCH_COUNT_STEP,
  INITIAL_FETCH_COUNT,
  MAX_FETCH_COUNT,
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
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<number | null>(null)

  const hasRaces = computed(() => races.value.length > 0)
  const activeCategoryIds = computed(() => getActiveCategoryIds(filterState.value))
  const activeFiltersLabel = computed(() => getActiveFiltersLabel(filterState.value))

  async function fetchRaces(nowSeconds: number) {
    loading.value = true
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
      loading.value = false
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
