import { Entry } from "./suspectDatabase/entry"
import { TextContent } from "./textContent"
// import { TextContent } from "./textContent"

export type ClueTypes = 'images' | 'book'

export interface Clue <T extends ClueTypes> {
  id: string
  type: T
  cost: number
  title: string
  thumbnailAssetId: string
  description?: TextContent | string

  images: {
    assetIds: string[]
    entries?: ImageEntry[]
  }
}

export interface ImageEntry {
  index?: number
  rect: {
    x: number
    y: number
    width: number
    height: number
    transform?: string
  }
  entry?: Entry
  entryId?: string
}
