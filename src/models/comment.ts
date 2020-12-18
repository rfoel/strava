import { SummaryAthlete } from '.'

export interface Comment {
  id: number
  activity_id: number
  text: string
  athlete: SummaryAthlete
  created_at: string
}
