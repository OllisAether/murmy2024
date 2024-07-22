import { cueType, CueTypes } from './CueTypes';

export const cueSettingsMap: Record<CueTypes, {
  [key: string]: {
    type: 'string' | 'number' | 'phase' | 'condition' | 'boolean',
    default: string | number | null | boolean
  }
}> = {
  [cueType.SetPhase]: {
    phase: {
      type: 'phase',
      default: null
    }
  },
  [cueType.StartTimer]: {
    duration: {
      type: 'number',
      default: null
    }
  },
  [cueType.WaitForTimer]: {},
  [cueType.WaitForSkip]: {},

  [cueType.If]: {
    condition: {
      type: 'condition',
      default: null
    }
  },
  [cueType.ElseIf]: {
    condition: {
      type: 'condition',
      default: null
    }
  },
  [cueType.Else]: {},
  [cueType.EndIf]: {},
  [cueType.Break]: {}
}