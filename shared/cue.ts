import { JsonMap } from './json'

export type VoteOptions = VoteOption[]
export interface VoteOption extends JsonMap {
  media: string,
  unlockClues?: string[]
}

export enum CueType {
  Idle = 'idle',
  Break = 'break',
  Tutorial = 'tutorial',
  Vote = 'vote',
  Clue = 'clue',
  Quiz = 'quiz'
}

export interface CueJson extends JsonMap {
  type: CueType,
  duration?: number,
  vote?: {
    voteOptions: VoteOptions,
    tieBreakerDuration: number
  },
  unlockClues: string[],
}