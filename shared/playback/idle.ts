import { FieldReference } from "../cue/FieldRefrence";
import { Playback } from "./Playback";
import { condition } from "../cue/Condition";
import { CueType } from "../cue/CueTypes";
import { Phase } from "../phase";

export const Idle = (duration?: number): Playback => ({
  name: 'Idle',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Idle
      }
    },
    {
      type: CueType.If,
      options: {
        condition: condition(FieldReference('duration'), '>', 0)
      },
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration')
      }
    },
    { type: CueType.WaitForTimer },
    { type: CueType.Else },
    { type: CueType.WaitForSkip },
    { type: CueType.EndIf }
  ],
  fields: {
    duration: duration
  }
})