import { Idle } from "../playback/idle"
import { Playback } from "../playback/Playback"
import { Tutorial } from "../playback/tutorial"
import { Media } from "../playback/media"
import { ShowNewClues } from "../playback/showNewClues"
import { Vote } from "../playback/vote"
import { AddInvestigationCoins } from "../playback/investigationCoins"
import { Work } from "../playback/work"
import { ClearAllForms, FilloutForms } from "../playback/forms"
import { Interlude } from "../playback/interlude"
import { CueType } from "../cue/CueTypes"
import { AddClues } from "../playback/addClue"

export const playbacks: (Playback | {
  divider: string
})[] = [
  { divider: '=== Setup ===' },

  {
    name: 'Setup',
    trigger: 'manual',
    cues: [
      {
        type: CueType.AddVoteOptions,
        options: {
          options: {
            mainClue: [
              'phone',
              'diary',
            ],
            main: [
              'cassy1',
              'hugo1',
              'justin1',
              'phoebe1'
            ]
          }
        }
      }
    ],
    fields: {}
  },

  { divider: '=== Prolog ===' },

  { divider: '- Einlass -' },

  Idle(0, {
    info: true
  }),
  Idle(30_000, {
    info: true
  }),

  { divider: '- Einführung -' },

  Tutorial(),

  { divider: '=== Akt 1 ===' },

  Media('durchsage.mp3'),

  { divider: '- Runde 1 -' },

  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(1.5 * 60_000),

  { divider: '- Runde 2 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(2 * 60_000),

  { divider: '- Runde 3 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(3 * 60_000),

  { divider: '- Runde 4 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 5 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  
  AddClues(['liebesRitual']),

  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '=== Interlude ===' },

  Interlude(),

  { divider: '=== Pause ===' },
  Idle(20 * 60_000, {
    break: true
  }),
  Idle(),

  { divider: '=== Akt 2 ===' },

  {
    name: 'Setup Akt 2',
    trigger: 'manual',
    cues: [
      {
        type: CueType.AddVoteOptions,
        options: {
          options: {
            main: [
              'hugo2',
              'justinsSprachaufnahme',
              'justin2',
            ]
          }
        }
      }
    ],
    fields: {}
  },

  { divider: '- Recap + Okkult-Video -' },

  Media('Recap.mp4'),

  { divider: '- Runde 6 -' },

  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 7 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 8 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 9 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 10 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 11 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 12 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '- Runde 13 -' },

  Idle(10_000, { next: 'vote' }),
  Vote(),
  Media(),
  ShowNewClues(),
  AddInvestigationCoins(10),

  Work(5 * 60_000),

  { divider: '=== Finale ===' },

  ClearAllForms(),
  FilloutForms(),
  Idle(0, {
    end: true
  }),

  { divider: '=== Epilog ===' },

  Idle(0, {
    results: true
  }),
]
