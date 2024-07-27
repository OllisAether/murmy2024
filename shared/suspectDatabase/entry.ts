import { JsonMap } from "../json"

export interface Entry extends JsonMap {
  matterId: string
  suspectId: string
  title: string
}