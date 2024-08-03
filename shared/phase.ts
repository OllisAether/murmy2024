export enum Phase {
  Idle = 'idle',
  Break = 'break',
  Work = 'work',
  Vote = 'vote',
  Quiz = 'quiz',
}

export const phaseNameMap = {
  [Phase.Idle]: 'Warten',
  [Phase.Break]: 'Pause',
  [Phase.Work]: 'Arbeitsphase',
  [Phase.Vote]: 'Abstimmung',
  [Phase.Quiz]: 'Quiz',
}

export function phaseToName (phase?: Phase): string | void {
  if (!phase) return
  return phaseNameMap[phase] ?? phase
}