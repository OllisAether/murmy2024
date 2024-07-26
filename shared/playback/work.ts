import { cueType } from '../cue/CueTypes';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const Work = (): Playback => ({
  name: 'Work',
  trigger: 'auto',
  cues: [
    {
      type: cueType.SetPhase,
      options: {
        phase: Phase.Work,
      },
    },
    {
      type: cueType.StartTimer,
      options: {
        duration: 1000 * 60 * 10,
      },
    },
    { type: cueType.WaitForTimer },
  ],
  fields: {
  },
})
