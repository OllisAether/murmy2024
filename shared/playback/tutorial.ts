import { CueType } from "../cue/CueTypes";
import { FieldReference } from "../cue/FieldRefrence";
import { Phase } from "../phase";
import { TutorialState } from "../tutorial";
import { Playback } from "./Playback";

export const Tutorial = (): Playback => ({
  name: 'Tutorial (Arbeitsphase)',
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
      type: CueType.AddVoteOptions,
      options: {
        options: {
          mainClue: [
            'phone',
            'diary'
          ]
        }
      }
    },

    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Idle,
      }
    },

    {
      type: CueType.SetMedia,
      options: {
        media: 'Intro.mp3'
      }
    },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 120_000
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
        }
      },
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 154_000
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
        time: 157_000
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
        time: 168_000
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
        time: 171_000
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
        time: 175_000
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
        time: 183_000
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
        time: 189_000
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
        time: 192_000
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
        time: 200_000
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
        time: 205_000
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
        time: 210_000
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
        time: 215_000
      }
    },
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
    { type: CueType.EndIf },

    {
      type: CueType.WhenMediaAt,
      options: {
        time: 210_000
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

    { type: CueType.ClearNewClues },
  ],
  fields: {},
})