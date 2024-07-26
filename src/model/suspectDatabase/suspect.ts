import { JsonMap } from '../../../shared/json'

export interface Suspect extends JsonMap {
  id: string
  name: string
  image: string
}