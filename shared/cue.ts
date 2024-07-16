import { JsonMap } from './json'

export type VoteOptions = VoteOption[]

export interface VoteOption extends JsonMap {
  media: string,
  unlockFiles?: string[]
}

export enum CueType {
  Idle = 'idle',
  Break = 'break',
  Tutorial = 'tutorial',
  Vote = 'vote',
  Work = 'work',
  Quiz = 'quiz',
  Media = 'media',
}

export const cueTypeNameMap = {
  [CueType.Idle]: 'Wartezeit',
  [CueType.Break]: 'Pause',
  [CueType.Tutorial]: 'Tutorial',
  [CueType.Vote]: 'Hinweisabstimmung',
  [CueType.Work]: 'Arbeitsphase',
  [CueType.Quiz]: 'Quiz',
  [CueType.Media]: 'Media',
}

export function cueTypeToName (type?: CueType): string | void {
  if (!type) return
  return cueTypeNameMap[type] ?? type
}

export interface CueJson extends JsonMap {
  type: CueType,
  duration?: number,
  vote?: {
    options: VoteOptions,
    tieBreakerDuration: number,
  }
  media?: string,
  unlockFiles: string[],
}