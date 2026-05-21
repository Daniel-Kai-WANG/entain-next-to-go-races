import { mount } from '@vue/test-utils'
import RaceList from '@/components/RaceList.vue'
import { HORSE_CATEGORY_ID } from '@/constants/raceCategories'
import type { RaceSummary } from '@/types/race'

const createRace = (raceNumber: number, seconds: number): RaceSummary => ({
  race_id: `race-${raceNumber}`,
  race_name: `Race ${raceNumber}`,
  race_number: raceNumber,
  meeting_id: null,
  meeting_name: `Meeting ${raceNumber}`,
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
})

const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation(() => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
}

describe('RaceList', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia(false),
    })
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    })
  })

  it('keeps rendered races visible while a background refill is loading', () => {
    const wrapper = mount(RaceList, {
      props: {
        blockingLoading: false,
        error: null,
        loading: true,
        nowSeconds: 100,
        races: [createRace(1, 160), createRace(2, 200), createRace(3, 240)],
      },
    })

    expect(wrapper.text()).toContain('Meeting 1')
    expect(wrapper.text()).toContain('Meeting 2')
    expect(wrapper.text()).not.toContain('Loading latest races')
  })

  it('shows the blocking loading state when there are no races yet', () => {
    const wrapper = mount(RaceList, {
      props: {
        blockingLoading: true,
        error: null,
        loading: true,
        nowSeconds: 100,
        races: [],
      },
    })

    expect(wrapper.text()).toContain('Loading latest races')
  })
})
