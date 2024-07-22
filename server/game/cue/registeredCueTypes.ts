import { CueTypes } from "../../../shared/cue/CueTypes";
import { Break, Else, ElseIf, EndIf, If } from "./Condition";
import { CueHandle } from "./CueHandle";
import { SetPhase } from "./SetPhase";
import { StartTimer } from "./StartTimer";
import { WaitForSkip } from "./WaitForSkip";
import { WaitForTimer } from "./WaitForTimer";

export const cueTypes = {
  StartTimer,
  WaitForTimer,
  WaitForSkip,
  SetPhase,

  // Conditions
  If,
  ElseIf,
  Else,
  EndIf,
  Break
}

export function getHandle (type: CueTypes): CueHandle {
  const handle = new cueTypes[type]()
  return handle
}