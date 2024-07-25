import { cueType, CueTypes } from "../../shared/cue/CueTypes";

export const cueIconMap: {
  [key in CueTypes]?: string
} = {
  [cueType.SetPhase]: 'mdi-label-outline',
  [cueType.StartTimer]: 'mdi-timer-sand',

  [cueType.WaitForTimer]: 'mdi-timer-sand-empty',
  [cueType.WaitForSkip]: 'mdi-skip-next',
  [cueType.WaitForBoardSkip]: 'mdi-television-play',

  [cueType.If]: 'mdi-filter-variant',
  [cueType.ElseIf]: 'mdi-call-split',
  [cueType.Else]: 'mdi-arrow-right-bottom',
  [cueType.EndIf]: 'mdi-filter-variant-remove',
  [cueType.Break]: 'mdi-debug-step-out',

  [cueType.AddVoteOptions]: 'mdi-pen-plus',
  [cueType.ClearVotePool]: 'mdi-delete',
  [cueType.OpenVote]: 'mdi-chart-box-multiple',
  [cueType.CloseVote]: 'mdi-minus-box-multiple',
  [cueType.PauseVote]: 'mdi-pause-box-multiple',
  [cueType.ResumeVote]: 'mdi-play-box-multiple',
  [cueType.StartTiebreaker]: 'mdi-trophy-variant',
  [cueType.SetRandomWinner]: 'mdi-clover',
  [cueType.EndVote]: 'mdi-close-box-multiple',
  [cueType.WaitForVote]: 'mdi-text-box-check',
}