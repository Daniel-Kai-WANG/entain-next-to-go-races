export type ApiRaceSummary = {
  race_id?: string
  race_name?: string
  race_number?: number
  meeting_name?: string
  category_id?: string
  advertised_start?: {
    seconds?: number
  }
  venue_name?: string
  venue_country?: string
  race_form?: {
    distance?: number
    distance_type?: {
      short_name?: string
    }
    track_condition?: {
      name?: string
      short_name?: string
    }
    weather?: {
      name?: string
      short_name?: string
    }
    race_comment?: string
  }
}

export type NextRacesApiResponse = {
  status?: number
  message?: string
  data?: {
    next_to_go_ids?: string[]
    race_summaries?: Record<string, ApiRaceSummary | undefined>
  }
}
