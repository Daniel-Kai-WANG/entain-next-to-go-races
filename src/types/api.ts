export type ApiRaceSummary = {
  race_id?: string
  race_number?: number
  meeting_name?: string
  category_id?: string
  advertised_start?: {
    seconds?: number
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
