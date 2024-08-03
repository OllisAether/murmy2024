import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { Playback } from "./Playback";

export function Media (media?: string | FieldReference): Playback {
  return {
    name: 'Medien abspielen',
    trigger: 'auto',
    cues: [
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Media,
        }
      },
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