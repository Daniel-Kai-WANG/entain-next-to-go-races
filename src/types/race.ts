import { RACE_CATEGORY_IDS } from '@/constants/raceCategories'

export type RaceCategoryId = (typeof RACE_CATEGORY_IDS)[number]

export type FilterMode = 'all' | 'custom'
export type FilterOptionId = 'all' | RaceCategoryId
export type CountdownState = 'normal' | 'warning' | 'urgent' | 'critical-live'

export type CategoryFilterState = {
  mode: FilterMode
  selectedCategoryIds: RaceCategoryId[]
}

export type RaceDistanceType = {
  id: string | null
  name: string | null
  short_name: string | null
}

export type RaceTrackCondition = {
  id: string | null
  name: string | null
  short_name: string | null
}

export type RaceWeather = {
  id: string | null
  name: string | null
  short_name: string | null
  icon_uri: string | null
}

export type RevealedRaceInfo = {
  track_name: string | null
  state: string | null
  country: string | null
  number: number | null
  race_name: string | null
  time: string | null
  class_name: string | null
  start_type: string | null
  prizemonies: Record<string, number> | null
  localised_prizemonies: Record<string, Record<string, number>> | null
  rail_position: string | null
  track_direction: string | null
  track_surface: string | null
  group: string | null
  gait: string | null
  track_home_straight_metres: number | null
  track_circumference: number | null
  race_comment_provider: string | null
}

export type RaceFormDetails = {
  distance: number | null
  distance_type: RaceDistanceType | null
  track_condition: RaceTrackCondition | null
  weather: RaceWeather | null
  race_comment: string | null
  additional_data_raw: string | null
  revealed_race_info: RevealedRaceInfo | null
}

export type RaceSummary = {
  race_id: string
  race_name: string
  race_number: number
  meeting_id: string | null
  meeting_name: string
  category_id: RaceCategoryId
  advertised_start: {
    seconds: number
  }
  generated: number | null
  silk_base_url: string | null
  race_comment_alternative: string | null
  venue_id: string | null
  venue_name: string | null
  venue_state: string | null
  venue_country: string | null
  distance: number | null
  distance_unit: string | null
  weather: string | null
  track_condition: string | null
  race_comment: string | null
  race_form: RaceFormDetails
}

export type ThemeMode = 'light' | 'dark'
