import { CueTypes } from "../../../shared/cue/CueTypes";
import { Break, Else, ElseIf, EndIf, If } from "./Condition";
import { CueHandle } from "./CueHandle";
import { SetPhase } from "./SetPhase";
import { StartTimer } from "./StartTimer";
import { WaitForBoardSkip, WaitForSkip } from "./WaitForSkip";
import { WaitForTimer } from "./WaitForTimer";
import { AddVoteOptions, ClearVotePool, CloseVote, EndVote, OpenVote, PauseVote, ResumeVote, SetRandomWinner, StartTiebreaker, WaitForVote } from "./Vote";

export const cueTypes = {
  StartTimer,
  SetPhase,

  WaitForTimer,
  WaitForSkip,
  WaitForBoardSkip,

  // Conditions
  If,
  ElseIf,
  Else,
  EndIf,
  Break,

  // Vote
  OpenVote,
  CloseVote,
  AddVoteOptions,
  ClearVotePool,
  StartTiebreaker,
  SetRandomWinner,
  EndVote,
  PauseVote,
  ResumeVote,
  WaitForVote
}

export function getHandle (type: CueTypes): CueHandle {
  const handle = new cueTypes[type]()
  return handle
}