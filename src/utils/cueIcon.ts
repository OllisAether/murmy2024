import { cueType, CueTypes } from "../../shared/cue/CueTypes";

export const cueIconMap: Record<CueTypes, string> = {
  [cueType.SetPhase]: 'mdi-label-outline',
  [cueType.StartTimer]: 'mdi-timer-sand',
  [cueType.WaitForTimer]: 'mdi-timer-sand-empty',
  [cueType.WaitForSkip]: 'mdi-skip-next',
  [cueType.If]: 'mdi-filter-variant',
  [cueType.ElseIf]: 'mdi-call-split',
  [cueType.Else]: 'mdi-arrow-right-bottom',
  [cueType.EndIf]: 'mdi-filter-variant-remove',
  [cueType.Break]: 'mdi-debug-step-out',
}