import {
  ALL_CATEGORY_IDS,
  ALL_FILTER_ID,
  CATEGORY_COUNT,
} from '@/constants/raceCategories'
import { RACE_EXPIRY_BUFFER_SECONDS, VISIBLE_RACE_COUNT } from '@/constants/raceTiming'
import { sortRacesByAdvertisedStart } from '@/utils/raceSorting'
import type {
  CategoryFilterState,
  FilterOptionId,
  RaceCategoryId,
  RaceSummary,
} from '@/types/race'

export function createAllCategoryFilterState(): CategoryFilterState {
  return {
    mode: 'all',
    selectedCategoryIds: [],
  }
}

export function isRaceExpired(race: RaceSummary, nowSeconds: number) {
  return nowSeconds > race.advertised_start.seconds + RACE_EXPIRY_BUFFER_SECONDS
}

export function filterExpiredRaces(races: RaceSummary[], nowSeconds: number) {
  return races.filter((race) => !isRaceExpired(race, nowSeconds))
}

export function normalizeCategoryFilterState(
  selectedCategoryIds: RaceCategoryId[],
): CategoryFilterState {
  if (selectedCategoryIds.length === 0 || selectedCategoryIds.length === CATEGORY_COUNT) {
    return createAllCategoryFilterState()
  }

  return {
    mode: 'custom',
    selectedCategoryIds,
  }
}

export function toggleCategoryFilter(
  currentState: CategoryFilterState,
  optionId: FilterOptionId,
): CategoryFilterState {
  if (optionId === ALL_FILTER_ID) {
    return createAllCategoryFilterState()
  }

  const nextSelection = currentState.selectedCategoryIds.includes(optionId)
    ? currentState.selectedCategoryIds.filter((id) => id !== optionId)
    : [...currentState.selectedCategoryIds, optionId]

  return normalizeCategoryFilterState(nextSelection)
}

export function getActiveCategoryIds(filterState: CategoryFilterState) {
  return filterState.mode === 'all' ? ALL_CATEGORY_IDS : filterState.selectedCategoryIds
}

export function getActiveFiltersLabel(filterState: CategoryFilterState) {
  return filterState.mode === 'all'
    ? 'All Categories'
    : `${filterState.selectedCategoryIds.length} / ${CATEGORY_COUNT}`
}

export function filterRacesByCategory(
  races: RaceSummary[],
  selectedCategories: RaceCategoryId[],
) {
  return races.filter((race) => selectedCategories.includes(race.category_id))
}

export function getVisibleRaces(
  races: RaceSummary[],
  filterState: CategoryFilterState,
  nowSeconds: number,
) {
  return sortRacesByAdvertisedStart(
    filterRacesByCategory(filterExpiredRaces(races, nowSeconds), getActiveCategoryIds(filterState)),
  ).slice(0, VISIBLE_RACE_COUNT)
}

export function getNextUpcomingRace(races: RaceSummary[], nowSeconds: number) {
  return races.find((race) => race.advertised_start.seconds >= nowSeconds) ?? null
}
