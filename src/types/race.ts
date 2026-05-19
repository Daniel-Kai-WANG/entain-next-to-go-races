export type RaceCategoryId =
  | '9daef0d7-bf3c-4f50-921d-8e818c60fe61'
  | '161d9be2-e909-4326-8c2c-35ed71fb460b'
  | '4a2788f8-e825-4d36-9894-efd4baf1cfae'

export type FilterMode = 'all' | 'custom'
export type FilterOptionId = 'all' | RaceCategoryId
export type CountdownState = 'normal' | 'warning' | 'urgent' | 'critical-live'

export type CategoryFilterState = {
  mode: FilterMode
  selectedCategoryIds: RaceCategoryId[]
}

export type RaceSummary = {
  race_id: string
  race_name: string
  race_number: number
  meeting_name: string
  category_id: RaceCategoryId
  advertised_start: {
    seconds: number
  }
  venue_name: string | null
  venue_country: string | null
  distance: number | null
  distance_unit: string | null
  weather: string | null
  track_condition: string | null
  race_comment: string | null
}

export type ThemeMode = 'light' | 'dark'
