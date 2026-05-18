import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchNextRaces } from '@/api/racesApi'
import { ALL_CATEGORY_IDS } from '@/constants/raceCategories'
import { getVisibleRaces } from '@/utils/raceFilters'
import type { RaceCategoryId, RaceSummary } from '@/types/race'

export const useRacesStore = defineStore('races', () => {
  const races = ref<RaceSummary[]>([])
  const selectedCategories = ref<RaceCategoryId[]>([...ALL_CATEGORY_IDS])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<number | null>(null)

  const hasRaces = computed(() => races.value.length > 0)

  async function fetchRaces() {
    loading.value = true
    error.value = null

    try {
      races.value = await fetchNextRaces()
      lastUpdatedAt.value = Date.now()
    } catch (caughtError) {
      error.value =
        caughtError instanceof Error ? caughtError.message : 'Unable to load race data right now.'
    } finally {
      loading.value = false
    }
  }

  function toggleCategory(categoryId: RaceCategoryId) {
    const nextSelection = selectedCategories.value.includes(categoryId)
      ? selectedCategories.value.filter((id) => id !== categoryId)
      : [...selectedCategories.value, categoryId]

    selectedCategories.value = nextSelection.length === 0 ? [...ALL_CATEGORY_IDS] : nextSelection
  }

  function getProcessedRaces(nowSeconds: number) {
    return getVisibleRaces(races.value, selectedCategories.value, nowSeconds)
  }

  return {
    error,
    fetchRaces,
    getProcessedRaces,
    hasRaces,
    lastUpdatedAt,
    loading,
    races,
    selectedCategories,
    toggleCategory,
  }
})
