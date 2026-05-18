import type { RaceSummary } from '@/types/race'

export function sortRacesByAdvertisedStart(races: RaceSummary[]) {
  return [...races].sort((left, right) => {
    return left.advertised_start.seconds - right.advertised_start.seconds
  })
}
