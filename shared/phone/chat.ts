import { Moment } from "moment"
import { ImageEntry } from "../clue"
import { TextContent } from "../textContent"
import { Entry } from "../suspectDatabase/entry"

export type Chat = GroupChat | PrivateChat

export interface ChatBase {
  type: 'private' | 'group'
  entry?: Entry | string
  messages: (ChatMessage | ChatTimestamp | ChatImage | ChatInfo)[]
}

export interface GroupChat extends ChatBase {
  type: 'group'
  name: string
  iconAssetId?: string
  participants: string[]
}

export interface PrivateChat extends ChatBase {
  type: 'private'
  number: string
}

export interface ChatMessage {
  type: 'message'
  sender: string | 'me'
  entry?: Entry | string
  content: TextContent | string
}

export interface ChatInfo {
  type: 'info'
  content: TextContent | string
}

export interface ChatImage {
  type: 'image'
  sender: string | 'me'
  imageAssetId: string
  entries?: ImageEntry[]
  explicit?: boolean
}

export interface ChatTimestamp {
  type: 'timestamp'
  timestamp: Moment
}
