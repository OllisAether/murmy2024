import { JsonMap } from "./json"

export interface Result {
  team: {
    id: string
    name: string
    meta: JsonMap
  },
  score: number,
  entries: number
}