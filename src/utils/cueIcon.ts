import { CueType } from "../shared/cue/CueTypes";

export const cueIconMap: Record<CueType, string> = {
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

  [CueType.AddShownSuspects]: 'mdi-account-search',

  [CueType.AddInvestigationCoins]: 'mdi-star-four-points-circle',
  [CueType.AddClues]: 'mdi-magnify-plus',
  [CueType.ClearNewClues]: 'mdi-magnify-remove',
  [CueType.UnlockClueForAll]: 'mdi-lock-open-variant',
  [CueType.MarkEntryForAll]: 'mdi-account-check',
  [CueType.AssignMainClueType]: 'mdi-tablet-cellphone',
  [CueType.AssignMainClueTypeRandomly]: 'mdi-dice-multiple',
  [CueType.SetAssignFurtherMainClueTypesRandomly]: 'mdi-dice-multiple',

  [CueType.SetMedia]: 'mdi-video',
  [CueType.WaitForMediaFinished]: 'mdi-video-off',
  [CueType.WhenMediaAt]: 'mdi-video-input-component',

  [CueType.CalculateResults]: 'mdi-calculator',
  [CueType.ClearAllForms]: 'mdi-eraser',
  [CueType.WaitForAllFormsSubmitted]: 'mdi-check-all',
}