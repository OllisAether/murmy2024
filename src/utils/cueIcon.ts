import { CueType, CueTypes } from "../../shared/cue/CueTypes";

export const cueIconMap: {
  [key in CueTypes]?: string
} = {
  [CueType.SetPhase]: 'mdi-label-outline',
  [CueType.StartTimer]: 'mdi-timer-sand',

  [CueType.WaitForTimer]: 'mdi-timer-sand-empty',
  [CueType.WaitForSkip]: 'mdi-skip-next',
  [CueType.WaitForBoardSkip]: 'mdi-television-play',

  [CueType.If]: 'mdi-filter-variant',
  [CueType.ElseIf]: 'mdi-call-split',
  [CueType.Else]: 'mdi-arrow-right-bottom',
  [CueType.EndIf]: 'mdi-filter-variant-remove',
  [CueType.Break]: 'mdi-debug-step-out',

  [CueType.AddVoteOptions]: 'mdi-pen-plus',
  [CueType.RemoveVoteOption]: 'mdi-pen-minus',
  [CueType.ClearVotePool]: 'mdi-delete',
  [CueType.OpenVote]: 'mdi-chart-box-multiple',
  [CueType.CloseVote]: 'mdi-minus-box-multiple',
  [CueType.PauseVote]: 'mdi-pause-box-multiple',
  [CueType.ResumeVote]: 'mdi-play-box-multiple',
  [CueType.StartTiebreaker]: 'mdi-trophy-variant',
  [CueType.SetRandomWinner]: 'mdi-clover',
  [CueType.EndVote]: 'mdi-close-box-multiple',
  [CueType.WaitForVote]: 'mdi-text-box-check',
}