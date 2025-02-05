import { Moment } from "moment"
import { ImageEntry } from "../clue"

export interface GalleryItem {
  assetId: string,
  date: Moment,
  entries?: ImageEntry[]
}

export type Gallery = GalleryItem[]