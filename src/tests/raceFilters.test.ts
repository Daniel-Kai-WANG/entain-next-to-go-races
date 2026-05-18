import type { RaceCategoryId, RaceSummary } from '@/types/race'
import {
  filterExpiredRaces,
  filterRacesByCategory,
  getVisibleRaces,
  isRaceExpired,
} from '@/utils/raceFilters'

function createRace(
  raceNumber: number,
  seconds: number,
  categoryId: RaceCategoryId = '4a2788f8-e825-4d36-9894-efd4baf1cfae',
): RaceSummary {
  return {
    race_id: `race-${raceNumber}`,
    race_number: raceNumber,
    meeting_name: 'Test meeting',
    category_id: categoryId,
    advertised_start: {
      seconds,
    },
  }
}

describe('raceFilters', () => {
  it('removes races more than 60 seconds past advertised start', () => {
    const races = [createRace(1, 100), createRace(2, 20), createRace(3, 41)]

    const result = filterExpiredRaces(races, 101)

    expect(result.map((race) => race.race_number)).toEqual([1, 3])
  })

  it('keeps races visible when they are exactly 60 seconds past advertised start', () => {
    expect(isRaceExpired(createRace(1, 100), 160)).toBe(false)
  })

  it('returns only races from selected categories', () => {
    const races = [
      createRace(1, 200, '4a2788f8-e825-4d36-9894-efd4baf1cfae'),
      createRace(2, 210, '161d9be2-e909-4326-8c2c-35ed71fb460b'),
    ]

    const result = filterRacesByCategory(races, ['161d9be2-e909-4326-8c2c-35ed71fb460b'])

    expect(result.map((race) => race.race_number)).toEqual([2])
  })

  it('returns only the first five visible races after filtering and sorting', () => {
    const races = [
      createRace(1, 300),
      createRace(2, 250),
      createRace(3, 200),
      createRace(4, 150),
      createRace(5, 100),
      createRace(6, 350),
    ]

    const result = getVisibleRaces(races, ['4a2788f8-e825-4d36-9894-efd4baf1cfae'], 50)

    expect(result.map((race) => race.race_number)).toEqual([5, 4, 3, 2, 1])
  })
})
