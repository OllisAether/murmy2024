import { clues } from "../assets/clues";
import { CueType } from "../cue/CueTypes";
import { Phase } from "../phase";
import { TutorialState } from "../tutorial";
import { Playback } from "./Playback";

export const Tutorial = (): Playback => ({
  name: 'Tutorial (Arbeitsphase)',
  trigger: 'auto',
  cues: [
    { 
      type: CueType.AddClues,
      options: {
        clues: [ 'fp1' ]
      }
    },
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work,
        meta: {
          tutorial: {} satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlight: 'workspace'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlight: 'database'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlight: 'transcripts'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlight: 'clues'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.AddInvestigationCoins,
      options: {
        amount: 10
      }
    },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            action: 'unlockClue'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.UnlockClueForAll,
      options: {
        clueId: 'fp1'
      }
    },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            action: 'markEntry'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.MarkEntryForAll,
      options: {
        entryId: 'camera1'
      }
    },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlight: 'database'
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
    {
      type: CueType.SetPhase,
      options: {
        meta: {
          tutorial: {
            highlightOracle: true
          } satisfies TutorialState
        }
      }
    },
    { type: CueType.WaitForSkip },
  ],
  fields: {},
})