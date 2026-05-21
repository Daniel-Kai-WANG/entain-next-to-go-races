import { HORSE_CATEGORY_ID } from '@/constants/raceCategories'
import type { RaceSummary } from '@/types/race'
import { sortRacesByAdvertisedStart } from '@/utils/raceSorting'

function createRace(raceNumber: number, seconds: number): RaceSummary {
  return {
    race_id: `race-${raceNumber}`,
    race_name: `Race ${raceNumber}`,
    race_number: raceNumber,
    meeting_id: null,
    meeting_name: 'Test meeting',
    category_id: HORSE_CATEGORY_ID,
    advertised_start: {
      seconds,
    },
    generated: null,
    silk_base_url: null,
    race_comment_alternative: null,
    venue_id: null,
    venue_name: null,
    venue_state: null,
    venue_country: null,
    distance: null,
    distance_unit: null,
    weather: null,
    track_condition: null,
    race_comment: null,
    race_form: {
      distance: null,
      distance_type: null,
      track_condition: null,
      weather: null,
      race_comment: null,
      additional_data_raw: null,
      revealed_race_info: null,
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
