import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { TutorialState } from "../tutorial";
import { Playback } from "./Playback";

export const Tutorial = (): Playback => ({
  name: 'Tutorial',
  trigger: 'auto',
  cues: [
    // Setup
    { 
      type: CueType.AddClues,
      options: {
        clues: [
          'map'
        ]
      }
    },
    { 
      type: CueType.AddInvestigationCoins,
      options: {
        amount: 10
      }
    },
    {
      type: CueType.AddVoteOptions,
      options: {
        options: {
          mainClue: [
            'diary',
            'phone'
          ]
        }
      }
    },

    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Idle,
        meta: {
          board: true
        }
      }
    },

    {
      type: CueType.SetMedia,
      options: {
        media: 'Intro.mp4'
      }
    },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 500
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Vote,
        }
      },
      {
        type: CueType.OpenVote,
        options: {
          pool: 'mainClue',
          autoClose: false
        }
      },
      {
        type: CueType.StartTimer,
        options: {
          duration: 15_000
        }
      },
      { type: CueType.WaitForVote },
      { type: CueType.EndVote},
      {
        type: CueType.AssignMainClueType,
        options: {
          votes: FieldReference('vote.session.votes'),
        }
      },
      {
        type: CueType.SetAssignFurtherMainClueTypesRandomly,
        options: {
          value: true
        }
      },
      { type: CueType.CloseVote },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Idle,
          meta: {
            board: true
          }
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 33_000
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 36_000
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 44_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 46_000
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          meta: {
            tutorial: {
              highlight: 'mainClue'
            } satisfies TutorialState
          }
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 2 * 60_000 + 51_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 1_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 8_000
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          meta: {
            tutorial: {
              highlight: 'investigationCoins'
            } satisfies TutorialState
          }
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 10_000
      }
    },
      {
        type: CueType.AddInvestigationCoins,
        options: {
          amount: 10
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 19_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 28_000
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 3 * 60_000 + 36_000
      }
    },
      {
        type: CueType.UnlockClueForAll,
        options: {
          clueId: 'map'
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 4 * 60_000
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          meta: {
            tutorial: {
              action: 'markEntry',
              entryId: 'max-planck-gymnasium'
            } satisfies TutorialState
          }
        }
      },
    { type: CueType.EndIf },
    
    {
      type: CueType.WhenMediaAt,
      options: {
        time: 4 * 60_000 + 10_000
      }
    },
      {
        type: CueType.MarkEntryForAll,
        options: {
          entryId: 'max-planck-gymnasium'
        }
      },
      {
        type: CueType.SetPhase,
        options: {
          meta: {
            tutorial:  {
              action: 'unlockClue'
            } satisfies TutorialState
          }
        }
      },
    { type: CueType.EndIf },
    {
      type: CueType.WhenMediaAt,
      options: {
        time: 4 * 60_000 + 20_000
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 4 * 60_000 + 50_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 5 * 60_000
      }
    },
      {
        type: CueType.SetPhase,
        options: {
          phase: Phase.Idle,
          meta: {
            board: true
          }
        }
      },
    { type: CueType.EndIf },

    { type: CueType.WaitForMediaFinished },

    { type: CueType.ClearNewClues },
  ],
  fields: {},
})