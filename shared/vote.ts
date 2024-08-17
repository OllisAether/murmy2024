import { JsonMap } from './json'

export interface VoteOption extends JsonMap {
  id: string,
  title: string,
  image?: string,
  description?: string,
  color?: string,
  placeImageOverBox?: boolean,

  // After option is selected, the following will be added
  removeSelf?: boolean,
  availableClues?: string[],
  options?: Record<string, string[]>
  media?: string
}

export type Votes = Record<string, string[]>

export interface VoteSession extends JsonMap {
  open: boolean
  paused: boolean
  pool: string

  title?: string

  votes: Votes
  passiveVotes: Votes
  totalPossibleVotes: number

  voteResults?: VoteResults

  isTiebreaker: boolean
  tiebreakerCandidates?: string[]
  tiebreakerVotes?: Votes
  passiveTiebreakerVotes?: Votes

  tiebreakerResults?: VoteResults

  isRandom: boolean
  winner?: string
}

export interface VoteResults extends JsonMap {
  votes: Record<string, number>
  winners: string[]
  next: "tiebreaker" | "random" | null
  
  finalWinner?: VoteOption
}