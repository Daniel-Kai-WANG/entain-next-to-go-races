import { RACE_EXPIRY_BUFFER_SECONDS, VISIBLE_RACE_COUNT } from '@/constants/raceTiming'
import { sortRacesByAdvertisedStart } from '@/utils/raceSorting'
import type { RaceCategoryId, RaceSummary } from '@/types/race'

export function isRaceExpired(race: RaceSummary, nowSeconds: number) {
  return nowSeconds > race.advertised_start.seconds + RACE_EXPIRY_BUFFER_SECONDS
}

export function filterExpiredRaces(races: RaceSummary[], nowSeconds: number) {
  return races.filter((race) => !isRaceExpired(race, nowSeconds))
}

export function filterRacesByCategory(races: RaceSummary[], selectedCategories: RaceCategoryId[]) {
  return races.filter((race) => selectedCategories.includes(race.category_id))
}

export function getVisibleRaces(
  races: RaceSummary[],
  selectedCategories: RaceCategoryId[],
  nowSeconds: number,
) {
  return sortRacesByAdvertisedStart(
    filterRacesByCategory(filterExpiredRaces(races, nowSeconds), selectedCategories),
  ).slice(0, VISIBLE_RACE_COUNT)
}
