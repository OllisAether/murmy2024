import { CueType } from "../../../shared/cue/CueTypes";
import { Break, Else, ElseIf, EndIf, If } from "./Condition";
import { CueHandle } from "./CueHandle";
import { SetPhase } from "./SetPhase";
import { StartTimer } from "./StartTimer";
import { WaitForBoardSkip, WaitForSkip } from "./WaitForSkip";
import { WaitForTimer } from "./WaitForTimer";
import { AddVoteOptions, ClearVotePool, CloseVote, EndVote, OpenVote, PauseVote, RemoveVoteOption, ResumeVote, SetRandomWinner, StartTiebreaker, WaitForVote } from "./Vote";
import { AddClues, AddInvestigationCoins, AssignMainClueType, AssignMainClueTypeRandomly, ClearNewClues, MarkEntryForAll, SetAssignFurtherMainClueTypesRandomly, UnlockClueForAll } from "./Clue";
import { SetMedia, WaitForMediaFinished, WhenMediaAt } from "./Media";
import { CalculateResults, ClearAllForms, WaitForAllFormsSubmitted } from "./form";

export const CueTypes: Record<CueType, typeof CueHandle>= {
  [CueType.StartTimer]: StartTimer,
  [CueType.SetPhase]: SetPhase,

  [CueType.WaitForTimer]: WaitForTimer,
  [CueType.WaitForSkip]: WaitForSkip,
  [CueType.WaitForBoardSkip]: WaitForBoardSkip,

  // Conditions
  [CueType.If]: If,
  [CueType.ElseIf]: ElseIf,
  [CueType.Else]: Else,
  [CueType.EndIf]: EndIf,
  [CueType.Break]: Break,

  // Vote
  [CueType.OpenVote]: OpenVote,
  [CueType.CloseVote]: CloseVote,
  [CueType.AddVoteOptions]: AddVoteOptions,
  [CueType.RemoveVoteOption]: RemoveVoteOption,
  [CueType.ClearVotePool]: ClearVotePool,
  [CueType.StartTiebreaker]: StartTiebreaker,
  [CueType.SetRandomWinner]: SetRandomWinner,
  [CueType.EndVote]: EndVote,
  [CueType.PauseVote]: PauseVote,
  [CueType.ResumeVote]: ResumeVote,
  [CueType.WaitForVote]: WaitForVote,

  // Clue
  [CueType.AddInvestigationCoins]: AddInvestigationCoins,
  [CueType.AddClues]: AddClues,
  [CueType.ClearNewClues]: ClearNewClues,
  [CueType.UnlockClueForAll]: UnlockClueForAll,
  [CueType.MarkEntryForAll]: MarkEntryForAll,
  [CueType.AssignMainClueType]: AssignMainClueType,
  [CueType.AssignMainClueTypeRandomly]: AssignMainClueTypeRandomly,
  [CueType.SetAssignFurtherMainClueTypesRandomly]: SetAssignFurtherMainClueTypesRandomly,

  // Media
  [CueType.SetMedia]: SetMedia,
  [CueType.WaitForMediaFinished]: WaitForMediaFinished,
  [CueType.WhenMediaAt]: WhenMediaAt,

  // Form
  [CueType.CalculateResults]: CalculateResults,
  [CueType.ClearAllForms]: ClearAllForms,
  [CueType.WaitForAllFormsSubmitted]: WaitForAllFormsSubmitted,
}

export function getHandle (type: CueType): CueHandle {
  const handle = new (CueTypes[type] as any)()
  return handle
}