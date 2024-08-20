import { CueType } from '../cue/CueTypes';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const Work = (form?: boolean): Playback => ({
  name: 'Arbeitsphase' + (form ? ' (mit Lösungsbogen)' : ''),
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work,
        meta: {
          form,
        }
      },
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: 1000 * 60 * 10,
      },
    },
    { type: CueType.WaitForTimer },
  ],
  fields: {
  },
})
