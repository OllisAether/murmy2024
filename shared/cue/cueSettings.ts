import { CueType, CueTypes } from './CueTypes';

export const cueSettingsMap: {
  [cue in CueTypes]?: {
    [key: string]: {
      type: 'string' | 'number' | 'phase' | 'condition' | 'boolean',
      default: string | number | null | boolean
    }
  }
} = {
  [CueType.SetPhase]: {
    phase: {
      type: 'phase',
      default: null
    }
  },
  [CueType.StartTimer]: {
    duration: {
      type: 'number',
      default: null
    }
  },

  [CueType.If]: {
    condition: {
      type: 'condition',
      default: null
    }
  },
  [CueType.ElseIf]: {
    condition: {
      type: 'condition',
      default: null
    }
  },
  [CueType.AddVoteOptions]: {
    options: {
      type: 'string',
      default: null
    }
  },
  [CueType.RemoveVoteOption]: {
    options: {
      type: 'string',
      default: null
    }
  },
  [CueType.ClearVotePool]: {
    pool: {
      type: 'string',
      default: null
    }
  },
  [CueType.OpenVote]: {
    pool: {
      type: 'string',
      default: null
    },
    pauseOnOpen: {
      type: 'boolean',
      default: false
    }
  },
  [CueType.AddInvestigationCoins]: {
    amount: {
      type: 'number',
      default: null
    }
  },
  [CueType.AddClues]: {
    amount: {
      type: 'number',
      default: null
    }
  },
  [CueType.SetMedia]: {
    media: {
      type: 'string',
      default: null
    }
  },
}