import { JsonMap } from "../json"

export interface Entry extends JsonMap {
  matterId: string
  suspectId: string

  title: string,
  description?: string,
  image?: {
    imageAssetId: string,
    imageCrop?: {
      x: number,
      y: number,
      width: number,
      height: number,
    }
  }
}