import { FieldReference } from "../cue/FieldRefrence";
import { Playback } from "./Playback";
import { condition } from "../cue/Condition";
import { cueType } from "../cue/CueTypes";
import { Phase } from "../phase";

export const Idle = (duration?: number): Playback => ({
  name: 'Idle',
  trigger: 'auto',
  cues: [
    {
      type: cueType.SetPhase,
      options: {
        phase: Phase.Idle
      }
    },
    {
      type: cueType.If,
      options: {
        condition: condition(FieldReference('duration'), '>', 0)
      },
    },
    {
      type: cueType.StartTimer,
      options: {
        duration: FieldReference('duration')
      }
    },
    { type: cueType.WaitForTimer },
    { type: cueType.Else },
    { type: cueType.WaitForSkip },
    { type: cueType.EndIf }
  ],
  fields: {
    duration: duration
  }
})