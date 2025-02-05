import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Playback } from "./Playback";

export function AddInvestigationCoins (amount?: number | FieldReference): Playback {
  return {
    name: 'EP hinzufügen',
    trigger: 'auto',
    cues: [
      {
        type: CueType.AddInvestigationCoins,
        options: {
          amount: FieldReference('amount')
        }
      }
    ],
    fields: {
      amount: amount ?? 0
    }
  }
}