import { condition } from '../cue/Condition'
import { cueType } from '../cue/CueTypes'
import { FieldReference } from '../cue/FieldRefrence'
import { Phase } from '../phase'
import { Playback } from './Playback'

export const Vote = (): Playback => ({
  name: 'Vote',
  trigger: 'auto',
  cues: [
    {
      type: cueType.SetPhase,
      options: {
        phase: Phase.Vote
      }
    },
    {
      type: cueType.AddVoteOptions,
      options: {
        pool: 'main',
        options: [
          'yes',
          'no'
        ] satisfies string[]
      }
    },
    {
      type: cueType.OpenVote,
      options: {
        pool: 'main',
        title: 'Vote'
      }
    },
    {
      type: cueType.StartTimer,
      options: {
        duration: 5000
      }
    },
    { type: cueType.WaitForVote },
    { type: cueType.EndVote },
    { type: cueType.WaitForBoardSkip },
    {
      type: cueType.If,
      options: {
        condition: condition(FieldReference('vote.results.next'), '==', 'tiebreaker')
      }
    },
    { type: cueType.StartTiebreaker },
    {
      type: cueType.StartTimer,
      options: {
        duration: 5000
      }
    },
    { type: cueType.WaitForVote },
    { type: cueType.EndVote },
    {
      type: cueType.If,
      options: {
        condition: condition(FieldReference('vote.results.next'), '==', 'random')
      }
    },
    { type: cueType.SetRandomWinner },
    { type: cueType.WaitForBoardSkip },
    { type: cueType.EndIf },
    { type: cueType.EndIf },
    { type: cueType.CloseVote },
  ],
  fields: {
  }
})