import { TextContent } from "./textContent";

export type TranscriptLine = [null | string | TranscriptSpeakerOverride, TextContent | string]
export type TranscriptContent = TranscriptLine[]

export interface TranscriptSpeakerBase {
  name: TextContent | string
  color?: string
  alignment?: 'left' | 'right'
  avatarAssetId?: string,
  flipAvatar?: boolean
}

export interface TranscriptSpeaker extends TranscriptSpeakerBase {
  id: string
}

export interface TranscriptSpeakerOverride extends Partial<TranscriptSpeakerBase> {
  speaker: string,
  withLastSpeaker?: boolean
}

export interface Transcript {
  id: string
  for: string
  title: string
  speakers: TranscriptSpeaker[]
  content: TranscriptContent
  thumbnailAssetId: string
}
