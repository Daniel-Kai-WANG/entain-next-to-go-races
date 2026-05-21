import { fetchNextRaces } from '@/api/racesApi'
import { GREYHOUND_CATEGORY_ID, HORSE_CATEGORY_ID } from '@/constants/raceCategories'

describe('fetchNextRaces', () => {
  it('maps the full race payload and preserves next_to_go_ids order', async () => {
    const responsePayload = {
      status: 200,
      data: {
        next_to_go_ids: ['race-2', 'race-1'],
        race_summaries: {
          'race-1': {
            race_id: 'race-1',
            race_name: ' Late Runner ',
            race_number: 2,
            meeting_id: 'meeting-1',
            meeting_name: ' Warwick ',
            category_id: HORSE_CATEGORY_ID,
            advertised_start: { seconds: 200 },
            generated: 1,
            silk_base_url: 'cdn.example.com',
            race_comment_alternative: 'Alt comment',
            venue_id: 'venue-1',
            venue_name: ' Warwick ',
            venue_state: 'GBR',
            venue_country: 'UK',
            race_form: {
              distance: 3822,
              distance_type: {
                id: 'distance-type-1',
                name: 'Metres',
                short_name: 'm',
              },
              track_condition: {
                id: 'track-condition-1',
                name: 'Good',
                short_name: 'good',
              },
              weather: {
                id: 'weather-1',
                name: 'OCAST',
                short_name: 'ocast',
                icon_uri: 'OCAST',
              },
              race_comment: 'Primary comment',
              additional_data: JSON.stringify({
                revealed_race_info: {
                  track_name: 'Warwick',
                  state: 'GBR',
                  country: 'UK',
                  number: 2,
                  race_name: 'Late Runner',
                  time: '2026-05-20T13:30:00Z',
                  class: 'HDLE MDN, C4',
                  start_type: '',
                  prizemonies: { total_value: 18450 },
                  localised_prizemonies: {
                    AUD: { '1st': 10295, total_value: 18450 },
                  },
                  rail_position: '',
                  track_direction: 'Left',
                  track_surface: 'Turf',
                  group: '',
                  gait: 'Gallop',
                  track_home_straight_metres: 0,
                  track_circumference: 0,
                  race_comment_provider: 'racingandsports',
                },
              }),
            },
          },
          'race-2': {
            race_id: 'race-2',
            race_name: 'Early Runner',
            race_number: 1,
            meeting_name: 'Hove Bags',
            category_id: GREYHOUND_CATEGORY_ID,
            advertised_start: { seconds: 100 },
            race_form: {
              distance: 500,
              distance_type: {
                short_name: 'm',
              },
            },
          },
        },
      },
    }

    const fetchImplementation = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => responsePayload,
    })

    const races = await fetchNextRaces(10, fetchImplementation as unknown as typeof fetch)

    expect(races.map((race) => race.race_id)).toEqual(['race-2', 'race-1'])
    expect(races[1]).toMatchObject({
      race_id: 'race-1',
      meeting_id: 'meeting-1',
      meeting_name: 'Warwick',
      generated: 1,
      silk_base_url: 'cdn.example.com',
      race_comment_alternative: 'Alt comment',
      venue_id: 'venue-1',
      venue_name: 'Warwick',
      venue_state: 'GBR',
      venue_country: 'UK',
      distance: 3822,
      distance_unit: 'm',
      weather: 'OCAST',
      track_condition: 'Good',
      race_comment: 'Primary comment',
    })
    expect(races[1].race_form.distance_type).toMatchObject({
      id: 'distance-type-1',
      name: 'Metres',
      short_name: 'm',
    })
    expect(races[1].race_form.revealed_race_info).toMatchObject({
      track_name: 'Warwick',
      class_name: 'HDLE MDN, C4',
      track_surface: 'Turf',
      race_comment_provider: 'racingandsports',
    })
  })
})
