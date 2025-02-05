import { JsonMap } from "./json"

export interface Result {
  team: {
    id: string
    name: string
    meta: JsonMap
    active: boolean
  },
  score: number,
  entries: number
}