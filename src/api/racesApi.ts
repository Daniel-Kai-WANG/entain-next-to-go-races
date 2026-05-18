import { isRaceCategoryId } from '@/constants/raceCategories'
import type { NextRacesApiResponse } from '@/types/api'
import type { RaceSummary } from '@/types/race'

const NEXT_RACES_ENDPOINT = '/api/racing/?method=nextraces&count=10'

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
        race_number: race.race_number,
        meeting_name: race.meeting_name?.trim() || 'Unknown meeting',
        category_id: race.category_id,
        advertised_start: {
          seconds: race.advertised_start.seconds,
        },
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
