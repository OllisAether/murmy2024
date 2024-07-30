export type CueTypes = keyof typeof cueType

export enum cueType {
  StartTimer = "StartTimer",
  SetPhase = "SetPhase",

  WaitForTimer = "WaitForTimer",
  WaitForSkip = "WaitForSkip",
  WaitForBoardSkip = "WaitForBoardSkip",

  If = "If",
  ElseIf = "ElseIf",
  Else = "Else",
  EndIf = "EndIf",
  Break = "Break",

  OpenVote = "OpenVote",
  CloseVote = "CloseVote",
  AddVoteOptions = "AddVoteOptions",
  ClearVotePool = "ClearVotePool",
  StartTiebreaker = "StartTiebreaker",
  SetRandomWinner = "SetRandomWinner",
  EndVote = "EndVote",
  PauseVote = "PauseVote",
  ResumeVote = "ResumeVote",
  WaitForVote = "WaitForVote",

  AddInvestigationCoins = "AddInvestigationCoins"
}