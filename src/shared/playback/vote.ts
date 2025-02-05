import { condition } from '../cue/Condition'
import { CueType } from '../cue/CueTypes'
import { FieldReference } from '../cue/FieldRefrence'
import { Phase } from '../phase'
import { Playback } from './Playback'

export const Vote = (
  pool?: string | FieldReference,
  title?: string | FieldReference,
  duration?: number | FieldReference,
  tiebreakerDuration?: number | FieldReference
): Playback => ({
  name: 'Umfrage',
  trigger: 'auto',
  cues: [
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('vote.pool.length'), '==', 0)
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Idle
        }
      },
      { type: CueType.WaitForSkip },
    { type: CueType.Else },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Vote
        }
      },
      {
        type: CueType.OpenVote,
        options: {
          pool: FieldReference('pool'),
          title: FieldReference('title'),
        }
      },
      {
        type: CueType.If,
        options: {
          condition: condition(FieldReference('vote.pool.length'), '>', 1)
        }
      },
        { type: CueType.WaitForBoardSkip },
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
          { type: CueType.EndIf },
          { type: CueType.WaitForBoardSkip },
        { type: CueType.EndIf },
      { type: CueType.Else },
        { type: CueType.WaitForBoardSkip },
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
        type: CueType.AddClues,
        options: {
          clues: FieldReference('vote.results.finalWinner.availableClues')
        }
      },
      {
        type: CueType.AddShownSuspects,
        options: {
          suspects: FieldReference('vote.results.finalWinner.suspectIds')
        }
      },
    { type: CueType.EndIf },
  ],
  fields: {
    duration: duration ?? 30000,
    tiebreakerDuration: tiebreakerDuration ?? 10000,
    pool: pool ?? 'main',
    title: title ?? null,
  }
})