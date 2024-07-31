import { condition } from '../cue/Condition'
import { CueType } from '../cue/CueTypes'
import { FieldReference } from '../cue/FieldRefrence'
import { Phase } from '../phase'
import { Playback } from './Playback'

export const Vote = (): Playback => ({
  name: 'Vote',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Vote
      }
    },
    {
      type: CueType.OpenVote,
      options: {
        pool: 'main',
        title: 'Vote'
      }
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration')
      }
    },
    { type: CueType.WaitForVote },
    { type: CueType.EndVote },
    { type: CueType.WaitForBoardSkip },
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('vote.results.next'), '==', 'tiebreaker')
      }
    },
    { type: CueType.StartTiebreaker },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('tiebreakerDuration')
      }
    },
    { type: CueType.WaitForVote },
    { type: CueType.EndVote },
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('vote.results.next'), '==', 'random')
      }
    },
    { type: CueType.SetRandomWinner },
    { type: CueType.WaitForBoardSkip },
    { type: CueType.EndIf },
    { type: CueType.EndIf },
    { type: CueType.CloseVote },
    {
      type: CueType.AddVoteOptions,
      options: {
        options: FieldReference('vote.results.finalWinner.options')
      }
    },
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('vote.results.finalWinner.removeSelf'), '==', true)
      }
    },
    {
      type: CueType.RemoveVoteOption,
      options: {
        pool: FieldReference('vote.session.pool'),
        option: FieldReference('vote.results.finalWinner.id')
      }
    },
    { type: CueType.EndIf },
    {
      type: CueType.AddClue,
      options: {
        clue: FieldReference('vote.results.finalWinner.clue')
      }
    }
  ],
  fields: {
    duration: 5000,
    tiebreakerDuration: 5000
  }
})