export type ApiRaceSummary = {
  race_id?: string
  race_name?: string
  race_number?: number
  meeting_id?: string
  meeting_name?: string
  category_id?: string
  advertised_start?: {
    seconds?: number
  }
  generated?: number
  silk_base_url?: string
  race_comment_alternative?: string
  venue_id?: string
  venue_name?: string
  venue_state?: string
  venue_country?: string
  race_form?: {
    distance?: number
    distance_type?: {
      id?: string
      name?: string
      short_name?: string
    }
    track_condition?: {
      id?: string
      name?: string
      short_name?: string
    }
    weather?: {
      id?: string
      name?: string
      short_name?: string
      icon_uri?: string
    }
    race_comment?: string
    additional_data?: string
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
