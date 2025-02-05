import { JsonMap } from '../json'

export interface Suspect extends JsonMap {
  id: string
  name: string
  imageAssetId?: string
  color: string
}