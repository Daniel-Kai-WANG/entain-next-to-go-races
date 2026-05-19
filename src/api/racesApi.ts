import { isRaceCategoryId } from '@/constants/raceCategories'
import type { NextRacesApiResponse } from '@/types/api'
import type { RaceSummary } from '@/types/race'

const NEXT_RACES_ENDPOINT = '/api/racing/?method=nextraces&count=20'

function mapRaceSummaries(response: NextRacesApiResponse) {
  const raceSummaries = response.data?.race_summaries ?? {}

  return Object.values(raceSummaries).flatMap((race): RaceSummary[] => {
    if (!race?.race_id || typeof race.race_number !== 'number') {
      return []
    }

    if (!isRaceCategoryId(race.category_id)) {
      return []
    }

    if (typeof race.advertised_start?.seconds !== 'number') {
      return []
    }

    return [
      {
        race_id: race.race_id,
        race_name: race.race_name?.trim() || `Race ${race.race_number}`,
        race_number: race.race_number,
        meeting_name: race.meeting_name?.trim() || 'Unknown meeting',
        category_id: race.category_id,
        advertised_start: {
          seconds: race.advertised_start.seconds,
        },
        venue_name: race.venue_name?.trim() || null,
        venue_country: race.venue_country?.trim() || null,
        distance: race.race_form?.distance ?? null,
        distance_unit: race.race_form?.distance_type?.short_name?.trim() || null,
        weather:
          race.race_form?.weather?.name?.trim() || race.race_form?.weather?.short_name?.trim() || null,
        track_condition:
          race.race_form?.track_condition?.name?.trim() ||
          race.race_form?.track_condition?.short_name?.trim() ||
          null,
        race_comment: race.race_form?.race_comment?.trim() || null,
      },
    ]
  })
}

export async function fetchNextRaces(fetchImplementation: typeof fetch = fetch) {
  const response = await fetchImplementation(NEXT_RACES_ENDPOINT)

  if (!response.ok) {
    throw new Error(`Failed to load races (${response.status})`)
  }

  const data = (await response.json()) as NextRacesApiResponse
  return mapRaceSummaries(data)
}
