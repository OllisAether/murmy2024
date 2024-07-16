export interface Clue {
  id: string
  type: string
  duration?: number
  voteOptions?: string[]
  tieBreakerDuration?: number
}