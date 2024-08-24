import { CueType } from '../cue/CueTypes';
import { FieldReference } from '../cue/FieldRefrence';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const Work = (duration = 60_000 * 10): Playback => ({
  name: 'Arbeitsphase',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work
      },
    },
    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration'),
      },
    },
    { type: CueType.WaitForTimer },
  ],
  fields: {
    duration
  },
})
