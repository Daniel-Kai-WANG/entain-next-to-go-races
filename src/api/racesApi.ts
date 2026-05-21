import { NEXT_RACES_METHOD, RACING_API_PATH } from '@/constants/apiEndpoints'
import { isRaceCategoryId } from '@/constants/raceCategories'
import type { ApiRaceSummary, NextRacesApiResponse } from '@/types/api'
import type { RaceFormDetails, RaceSummary, RevealedRaceInfo } from '@/types/race'

function getNextRacesEndpoint(count: number) {
  return `${RACING_API_PATH}?method=${NEXT_RACES_METHOD}&count=${count}`
}

function getTrimmedValue(value: string | undefined) {
  return value?.trim() || null
}

function parseRevealedRaceInfo(rawValue: string | undefined): RevealedRaceInfo | null {
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as {
      revealed_race_info?: {
        track_name?: string
        state?: string
        country?: string
        number?: number
        race_name?: string
        time?: string
        class?: string
        start_type?: string
        prizemonies?: Record<string, number>
        localised_prizemonies?: Record<string, Record<string, number>> | null
        rail_position?: string
        track_direction?: string
        track_surface?: string
        group?: string
        gait?: string
        track_home_straight_metres?: number
        track_circumference?: number
        race_comment_provider?: string
      }
    }
    const revealedRaceInfo = parsed.revealed_race_info

    if (!revealedRaceInfo) {
      return null
    }

    return {
      track_name: getTrimmedValue(revealedRaceInfo.track_name),
      state: getTrimmedValue(revealedRaceInfo.state),
      country: getTrimmedValue(revealedRaceInfo.country),
      number: revealedRaceInfo.number ?? null,
      race_name: getTrimmedValue(revealedRaceInfo.race_name),
      time: getTrimmedValue(revealedRaceInfo.time),
      class_name: getTrimmedValue(revealedRaceInfo.class),
      start_type: getTrimmedValue(revealedRaceInfo.start_type),
      prizemonies: revealedRaceInfo.prizemonies ?? null,
      localised_prizemonies: revealedRaceInfo.localised_prizemonies ?? null,
      rail_position: getTrimmedValue(revealedRaceInfo.rail_position),
      track_direction: getTrimmedValue(revealedRaceInfo.track_direction),
      track_surface: getTrimmedValue(revealedRaceInfo.track_surface),
      group: getTrimmedValue(revealedRaceInfo.group),
      gait: getTrimmedValue(revealedRaceInfo.gait),
      track_home_straight_metres: revealedRaceInfo.track_home_straight_metres ?? null,
      track_circumference: revealedRaceInfo.track_circumference ?? null,
      race_comment_provider: getTrimmedValue(revealedRaceInfo.race_comment_provider),
    }
  } catch {
    return null
  }
}

function mapRaceForm(race: ApiRaceSummary | undefined): RaceFormDetails {
  const additionalData = race?.race_form?.additional_data

  return {
    distance: race?.race_form?.distance ?? null,
    distance_type: race?.race_form?.distance_type
      ? {
          id: getTrimmedValue(race.race_form.distance_type.id),
          name: getTrimmedValue(race.race_form.distance_type.name),
          short_name: getTrimmedValue(race.race_form.distance_type.short_name),
        }
      : null,
    track_condition: race?.race_form?.track_condition
      ? {
          id: getTrimmedValue(race.race_form.track_condition.id),
          name: getTrimmedValue(race.race_form.track_condition.name),
          short_name: getTrimmedValue(race.race_form.track_condition.short_name),
        }
      : null,
    weather: race?.race_form?.weather
      ? {
          id: getTrimmedValue(race.race_form.weather.id),
          name: getTrimmedValue(race.race_form.weather.name),
          short_name: getTrimmedValue(race.race_form.weather.short_name),
          icon_uri: getTrimmedValue(race.race_form.weather.icon_uri),
        }
      : null,
    race_comment: getTrimmedValue(race?.race_form?.race_comment),
    additional_data_raw: additionalData ?? null,
    revealed_race_info: parseRevealedRaceInfo(additionalData),
  }
}

function mapRaceSummaries(response: NextRacesApiResponse) {
  const raceSummaries = response.data?.race_summaries ?? {}
  const orderedIds = response.data?.next_to_go_ids ?? []
  const knownIds = new Set(orderedIds)
  const orderedRaces = [
    ...orderedIds.map((id) => raceSummaries[id]),
    ...Object.entries(raceSummaries)
      .filter(([raceId]) => !knownIds.has(raceId))
      .map(([, race]) => race),
  ]

  return orderedRaces.flatMap((race): RaceSummary[] => {
    if (!race?.race_id || typeof race.race_number !== 'number') {
      return []
    }

    if (!isRaceCategoryId(race.category_id)) {
      return []
    }

    if (typeof race.advertised_start?.seconds !== 'number') {
      return []
    }

    const raceForm = mapRaceForm(race)

    return [
      {
        race_id: race.race_id,
        race_name: getTrimmedValue(race.race_name) || `Race ${race.race_number}`,
        race_number: race.race_number,
        meeting_id: getTrimmedValue(race.meeting_id),
        meeting_name: getTrimmedValue(race.meeting_name) || 'Unknown meeting',
        category_id: race.category_id,
        advertised_start: {
          seconds: race.advertised_start.seconds,
        },
        generated: race.generated ?? null,
        silk_base_url: getTrimmedValue(race.silk_base_url),
        race_comment_alternative: getTrimmedValue(race.race_comment_alternative),
        venue_id: getTrimmedValue(race.venue_id),
        venue_name: getTrimmedValue(race.venue_name),
        venue_state: getTrimmedValue(race.venue_state),
        venue_country: getTrimmedValue(race.venue_country),
        distance: raceForm.distance,
        distance_unit: raceForm.distance_type?.short_name || null,
        weather: raceForm.weather?.name || raceForm.weather?.short_name || null,
        track_condition: raceForm.track_condition?.name || raceForm.track_condition?.short_name || null,
        race_comment: raceForm.race_comment,
        race_form: raceForm,
      },
    ]
  })
}

export async function fetchNextRaces(
  count = 20,
  fetchImplementation: typeof fetch = fetch,
  signal?: AbortSignal,
) {
  const response = await fetchImplementation(getNextRacesEndpoint(count), { signal })

  if (!response.ok) {
    throw new Error(`Failed to load races (${response.status})`)
  }

  const data = (await response.json()) as NextRacesApiResponse
  return mapRaceSummaries(data)
}
