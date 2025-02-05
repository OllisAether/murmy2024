import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { Playback } from "./Playback";

export function Media (media?: string | FieldReference, noIdle = false): Playback {
  return {
    name: typeof media === 'string' ? media : 'Medien abspielen',
    trigger: 'auto',
    cues: [
      ...(noIdle ? [] : [{
        type: CueType.SetPhase,
        options: {
          phase: Phase.Idle,
          meta: {
            board: true,
          }
        }
      }]),
      {
        type: CueType.SetMedia,
        options: {
          media: FieldReference('media')
        }
      },
      {
        type: CueType.WaitForMediaFinished
      }
    ],
    fields: {
      media: media ?? FieldReference('vote.results.finalWinner.media')
    }
  }
}