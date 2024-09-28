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

export const playbacks: (Playback | {
  divider: string
})[] = [
  { divider: '=== Prolog ===' },

  { divider: '- Einlass -' },

  Idle(0, {
    info: true
  }),
  Idle(30_000, {
    info: true
  }),

  { divider: '- Prolog -' },

  Tutorial(),

  { divider: '- Akt 1 -' },

  Vote(),
  Media(),
  ShowNewClues(),

  AddInvestigationCoins(10),
  Work(),
  Idle(10_000, {
    next: 'vote'
  }),
  Vote(),

  { divider: '=== Interlude ===' },

  Interlude(),

  { divider: '=== Pause ===' },
  Idle(15 * 60_000, {
    break: true
  }),
  Idle(),

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
