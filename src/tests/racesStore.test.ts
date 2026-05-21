import { createPinia, setActivePinia } from 'pinia'
import { useRacesStore } from '@/stores/racesStore'
import { HORSE_CATEGORY_ID } from '@/constants/raceCategories'
import type { RaceSummary } from '@/types/race'

vi.mock('@/api/racesApi', () => ({
  fetchNextRaces: vi.fn(),
}))

import { fetchNextRaces } from '@/api/racesApi'

const mockedFetchNextRaces = vi.mocked(fetchNextRaces)

const createRace = (raceNumber: number, seconds: number): RaceSummary => ({
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
})

const createRaceBatch = (startRaceNumber: number, startSeconds: number) =>
  Array.from({ length: 5 }, (_, index) => createRace(startRaceNumber + index, startSeconds + index * 20))

const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useRacesStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    mockedFetchNextRaces.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the most recent fetch result when an earlier request resolves later', async () => {
    const store = useRacesStore()

    mockedFetchNextRaces.mockResolvedValueOnce(createRaceBatch(1, 200))

    const initialFetchPromise = store.fetchRaces(100)
    await vi.runAllTimersAsync()
    await initialFetchPromise

    let resolveFirstRequest: ((races: RaceSummary[]) => void) | undefined
    let rejectFirstRequest: ((error?: unknown) => void) | undefined

    mockedFetchNextRaces
      .mockImplementationOnce(
        () =>
          new Promise<RaceSummary[]>((resolve, reject) => {
            resolveFirstRequest = resolve
            rejectFirstRequest = reject
          }),
      )
      .mockResolvedValueOnce(createRaceBatch(11, 180))

    const firstRefreshPromise = store.fetchRaces(100)
    const secondRefreshPromise = store.fetchRaces(100)

    await flushPromises()

    expect(mockedFetchNextRaces).toHaveBeenCalledTimes(3)

    rejectFirstRequest?.(new DOMException('Aborted', 'AbortError'))

    await firstRefreshPromise
    await secondRefreshPromise

    expect(store.races.map((race) => race.race_id)).toEqual(
      createRaceBatch(11, 180).map((race) => race.race_id),
    )

    resolveFirstRequest?.(createRaceBatch(21, 190))
  })

  it('does not expose an error when a stale request is aborted by a newer one', async () => {
    const store = useRacesStore()

    mockedFetchNextRaces.mockResolvedValueOnce(createRaceBatch(1, 200))

    const initialFetchPromise = store.fetchRaces(100)
    await vi.runAllTimersAsync()
    await initialFetchPromise

    let rejectFirstRefresh: ((error?: unknown) => void) | undefined

    mockedFetchNextRaces
      .mockImplementationOnce(
        () =>
          new Promise<RaceSummary[]>((_, reject) => {
            rejectFirstRefresh = reject
          }),
      )
      .mockResolvedValueOnce(createRaceBatch(31, 220))

    const firstRefreshPromise = store.fetchRaces(100)
    const secondRefreshPromise = store.fetchRaces(100)

    rejectFirstRefresh?.(new DOMException('Aborted', 'AbortError'))

    await firstRefreshPromise
    await secondRefreshPromise

    expect(store.error).toBeNull()
    expect(store.races.map((race) => race.race_id)).toEqual(
      createRaceBatch(31, 220).map((race) => race.race_id),
    )
  })
})
