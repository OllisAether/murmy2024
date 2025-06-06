export type CueTypes = keyof typeof CueType

export enum CueType {
  StartTimer = 'StartTimer',
  SetPhase = 'SetPhase',

  WaitForTimer = 'WaitForTimer',
  WaitForSkip = 'WaitForSkip',
  WaitForBoardSkip = 'WaitForBoardSkip',

  If = 'If',
  ElseIf = 'ElseIf',
  Else = 'Else',
  EndIf = 'EndIf',
  Break = 'Break',

  OpenVote = 'OpenVote',
  CloseVote = 'CloseVote',
  AddVoteOptions = 'AddVoteOptions',
  RemoveVoteOption = 'RemoveVoteOption',
  ClearVotePool = 'ClearVotePool',
  StartTiebreaker = 'StartTiebreaker',
  SetRandomWinner = 'SetRandomWinner',
  EndVote = 'EndVote',
  PauseVote = 'PauseVote',
  ResumeVote = 'ResumeVote',
  WaitForVote = 'WaitForVote',

  AddShownSuspects = 'AddShownSuspects',

  AddInvestigationCoins = 'AddInvestigationCoins',
  AddClues = 'AddClues',
  ClearNewClues = 'ClearNewClues',
  UnlockClueForAll = 'UnlockClueForAll',
  MarkEntryForAll = 'MarkEntryForAll',
  AssignMainClueType = 'AssignMainClueType',
  AssignMainClueTypeRandomly = 'AssignMainClueTypeRandomly',
  SetAssignFurtherMainClueTypesRandomly = 'SetAssignFurtherMainClueTypesRandomly',

  SetMedia = 'SetMedia',
  WaitForMediaFinished = 'WaitForMediaFinished',
  WhenMediaAt = 'WhenMediaAt',

  CalculateResults = 'CalculateResults',
  ClearAllForms = 'ClearAllForms',
  WaitForAllFormsSubmitted = 'WaitForAllFormsSubmitted',
}