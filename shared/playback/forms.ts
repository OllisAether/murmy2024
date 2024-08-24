import { CueType } from '../cue/CueTypes';
import { FieldReference } from '../cue/FieldRefrence';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const ClearAllForms = (): Playback => ({
  name: 'Lösungsbogen löschen',
  trigger: 'auto',
  cues: [
    { type: CueType.ClearAllForms },
  ],
  fields: {},
})

export const FilloutForms = (duration = 60_000 * 10): Playback => ({
  name: 'Lösungsbogen ausfüllen',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work,
        meta: {
          form: true,
        }
      },
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration'),
      },
    },
    { type: CueType.WaitForAllFormsSubmitted },
    { type: CueType.CalculateResults },
  ],
  fields: {
    duration
  },
})
