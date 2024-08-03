import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { Playback } from "./Playback";

export const VoteMainClue = (duration?: number | FieldReference): Playback => ({
  name: 'Handy oder Tagebuch wählen',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Vote,
        meta: {
          private: true
        }
      }
    },
    {
      type: CueType.SetMedia,
      options: {
        media: FieldReference('media')
      }
    },
    {
      type: CueType.AddVoteOptions,
      options: {
        options: {
          mainClue: [
            'phone',
            'diary'
          ]
        }
      }
    },
    {
      type: CueType.OpenVote,
      options: {
        pool: 'mainClue',
      }
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration')
      }
    },
    { type: CueType.WaitForVote },
    { type: CueType.WaitForMediaFinished },
    { type: CueType.EndVote},
    {
      type: CueType.AssignMainClueType,
      options: {
        votes: FieldReference('vote.session.votes'),
      }
    },
    {
      type: CueType.SetAssignFurtherMainClueTypesRandomly,
      options: {
        value: true
      }
    },
    { type: CueType.CloseVote },
  ],
  fields: {
    duration: duration ?? 30_000,
    media: 'Interview Fleur.mp4',
  }
})