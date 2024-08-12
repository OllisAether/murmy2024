import { ImageEntry } from "../clue"

export interface GalleryItem {
  assetId: string,
  date: string,
  entries?: ImageEntry[]
}

export type Gallery = GalleryItem[]