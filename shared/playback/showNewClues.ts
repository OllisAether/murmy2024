import { condition } from "../cue/Condition";
import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { Playback } from "./Playback";

export const ShowNewClues = (): Playback => ({
  name: 'ShowNewClues',
  trigger: 'auto',
  cues: [
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('clues.new.length'), '>', 0),
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Idle,
          meta: {
            showNewClues: true,
          }
        }
      },
      {
        type: CueType.StartTimer,
        options: {
          duration: FieldReference('duration'),
        }
      },
      { type: CueType.WaitForTimer },
    { type: CueType.EndIf }
  ],
  fields: {
    duration: 5000
  }
})