import { Entry } from "./suspectDatabase/entry"
import { TextContent } from "./textContent"

export type ClueTypes =
  'image' | 'imageStack' |
  'text' | 'video'

export interface Clue <T extends ClueTypes> {
  id: string
  type: T
  cost: number
  title: string
  thumbnailAssetId: string
  description?: string

  image?: T extends 'image' ? {
    assetId: string
    entries: ImageEntry[]
  } : never
  imageStack?: T extends 'imageStack' ? {
    assetIds: string[]
    entries: ImageEntry[]
  } : never
  text?: T extends 'text' ? {
    content: TextContent[]
  } : never
  video?: T extends 'video' ? {
    assetId: string
  } : never
}

export interface ImageEntry {
  index?: number
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  entry: Entry
}

export interface VideoEntry {
  timespan: {
    start: number
    end: number
  }
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  entry: Entry
}