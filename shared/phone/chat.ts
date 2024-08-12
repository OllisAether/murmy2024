import { Moment } from "moment"
import { ImageEntry } from "../clue"
import { TextContent } from "../textContent"

export type Chat = GroupChat | PrivateChat

export interface ChatBase {
  type: 'private' | 'group'
  messages: (ChatMessage | ChatTimestamp | ChatImage)[]
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
  content: TextContent | string
}

export interface ChatImage {
  type: 'image'
  sender: string | 'me'
  imageAssetId: string
  entries?: ImageEntry[]
}

export interface ChatTimestamp {
  type: 'timestamp'
  timestamp: Moment
}
