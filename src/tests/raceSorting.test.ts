import type { RaceSummary } from '@/types/race'
import { sortRacesByAdvertisedStart } from '@/utils/raceSorting'

function createRace(raceNumber: number, seconds: number): RaceSummary {
  return {
    race_id: `race-${raceNumber}`,
    race_number: raceNumber,
    meeting_name: 'Test meeting',
    category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
    advertised_start: {
      seconds,
    },
  }
}

describe('sortRacesByAdvertisedStart', () => {
  it('sorts races by advertised start time ascending', () => {
    const races = [createRace(1, 140), createRace(2, 40), createRace(3, 90)]

    const result = sortRacesByAdvertisedStart(races)

    expect(result.map((race) => race.race_number)).toEqual([2, 3, 1])
  })
})
