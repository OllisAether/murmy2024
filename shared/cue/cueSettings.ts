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
  [cueType.Break]: {},
  [cueType.AddVoteOptions]: {
    pool: {
      type: 'string',
      default: null
    },
    options: {
      type: 'condition',
      default: null
    }
  },
  [cueType.ClearVotePool]: {
    pool: {
      type: 'string',
      default: null
    }
  },
  [cueType.OpenVote]: {
    pool: {
      type: 'string',
      default: null
    },
    pauseOnOpen: {
      type: 'boolean',
      default: false
    }
  },
  [cueType.CloseVote]: {},
  [cueType.StartTiebreaker]: {},
  [cueType.SetRandomWinner]: {},
  [cueType.EndVote]: {},
  [cueType.PauseVote]: {},
  [cueType.ResumeVote]: {},
  [cueType.WaitForVote]: {},
  [cueType.WaitForBoardSkip]: {},
  [cueType.AddInvestigationCoins]: {
    amount: {
      type: 'number',
      default: null
    }
  }
}