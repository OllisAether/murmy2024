import { Entry } from "./suspectDatabase/entry"
// import { TextContent } from "./textContent"

export type ClueTypes = 'images'

export interface Clue <T extends ClueTypes> {
  id: string
  type: T
  cost: number
  title: string
  thumbnailAssetId: string
  description?: string

  images?: T extends 'images' ? {
    assetIds: string[]
    entries?: ImageEntry[]
  } : never
  // text?: T extends 'text' ? {
  //   content: TextContent | string
  // } : never
  // video?: T extends 'video' ? {
  //   assetId: string
  // } : never
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