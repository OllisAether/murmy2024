import { CueType } from "../cue/CueTypes";
import { Phase } from "../phase";
import { Playback } from "./Playback";

export const Interlude = (): Playback => ({
  name: 'Interlude',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Idle
      }
    },
    {
      type: CueType.AddClues,
      options: {
        clues: [
          'zeitung'
        ]
      }
    },
    {
      type: CueType.UnlockClueForAll,
      options: {
        clueId: 'zeitung'
      }
    },
    {
      type: CueType.SetMedia,
      options: {
        media: 'sounds/vote/vote.mp3'
      }
    },
    {
      type: CueType.WhenMediaAt,
      options: {
        time: 5_000
      }
    },
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work,
        meta: {
          showClue: 'zeitung'
        }
      }
    },
    { type: CueType.EndIf },
    { type: CueType.WaitForMediaFinished },
  ],
  fields: {}
})