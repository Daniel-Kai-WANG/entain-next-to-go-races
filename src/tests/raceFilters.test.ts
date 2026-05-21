import {
  GREYHOUND_CATEGORY_ID,
  HARNESS_CATEGORY_ID,
  HORSE_CATEGORY_ID,
} from '@/constants/raceCategories'
import type { CategoryFilterState, RaceCategoryId, RaceSummary } from '@/types/race'
import {
  createAllCategoryFilterState,
  filterExpiredRaces,
  filterRacesByCategory,
  getActiveFiltersLabel,
  getNextUpcomingRace,
  getVisibleRaces,
  isRaceExpired,
  toggleCategoryFilter,
} from '@/utils/raceFilters'

const createRace = (
  raceNumber: number,
  seconds: number,
  categoryId: RaceCategoryId = HORSE_CATEGORY_ID,
): RaceSummary => {
  return {
    race_id: `race-${raceNumber}`,
    race_name: `Race ${raceNumber}`,
    race_number: raceNumber,
    meeting_id: null,
    meeting_name: 'Test meeting',
    category_id: categoryId,
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

describe('raceFilters', () => {
  it('defaults to the All filter state', () => {
    expect(createAllCategoryFilterState()).toEqual({
      mode: 'all',
      selectedCategoryIds: [],
    })
  })

  it('clicking All clears individual category selections', () => {
    const currentState: CategoryFilterState = {
      mode: 'custom',
      selectedCategoryIds: [HARNESS_CATEGORY_ID],
    }

    expect(toggleCategoryFilter(currentState, 'all')).toEqual(createAllCategoryFilterState())
  })

  it('clicking an individual category clears All and selects that category', () => {
    expect(toggleCategoryFilter(createAllCategoryFilterState(), HARNESS_CATEGORY_ID))
      .toEqual({
        mode: 'custom',
        selectedCategoryIds: [HARNESS_CATEGORY_ID],
      })
  })

  it('restores All when all three individual categories become selected', () => {
    let state = createAllCategoryFilterState()
    state = toggleCategoryFilter(state, GREYHOUND_CATEGORY_ID)
    state = toggleCategoryFilter(state, HARNESS_CATEGORY_ID)
    state = toggleCategoryFilter(state, HORSE_CATEGORY_ID)

    expect(state).toEqual(createAllCategoryFilterState())
  })

  it('restores All when the final individual category is deselected', () => {
    const currentState: CategoryFilterState = {
      mode: 'custom',
      selectedCategoryIds: [HARNESS_CATEGORY_ID],
    }

    expect(toggleCategoryFilter(currentState, HARNESS_CATEGORY_ID)).toEqual(
      createAllCategoryFilterState(),
    )
  })

  it('returns a clear active filters label', () => {
    expect(getActiveFiltersLabel(createAllCategoryFilterState())).toBe('All Categories')
  })

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
      createRace(1, 200, HORSE_CATEGORY_ID),
      createRace(2, 210, HARNESS_CATEGORY_ID),
    ]

    const result = filterRacesByCategory(races, [HARNESS_CATEGORY_ID])

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

    const result = getVisibleRaces(
      races,
      {
        mode: 'custom',
        selectedCategoryIds: [HORSE_CATEGORY_ID],
      },
      50,
    )

    expect(result.map((race) => race.race_number)).toEqual([5, 4, 3, 2, 1])
  })

  it('returns the next race that has not started yet', () => {
    const result = getNextUpcomingRace([createRace(1, 90), createRace(2, 130)], 100)

    expect(result?.race_number).toBe(2)
  })

  it('returns null when every visible race is already live', () => {
    expect(getNextUpcomingRace([createRace(1, 90), createRace(2, 99)], 100)).toBeNull()
  })
})
