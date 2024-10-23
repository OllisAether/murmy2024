import { CueType } from '../cue/CueTypes';
import { FieldReference } from '../cue/FieldRefrence';
import { Phase } from '../phase';
import { Playback } from './Playback';

export const Work = (duration = 60_000 * 10, startTimerOnInput = false): Playback => ({
  name: 'Arbeitsphase',
  trigger: 'auto',
  cues: [
    {
      type: CueType.SetPhase,
      options: {
        phase: Phase.Work
      },
    },

    ...(startTimerOnInput ? [
      { type: CueType.WaitForSkip },
    ] : []),

    {
      type: CueType.StartTimer,
      options: {
        duration: FieldReference('duration'),
      },
    },
    { type: CueType.WaitForTimer },
    { type: CueType.ClearNewClues },
  ],
  fields: {
    duration
  },
})
