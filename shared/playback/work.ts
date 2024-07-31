import { CueType } from '../cue/CueTypes';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const Work = (): Playback => ({
  name: 'Work',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work,
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
