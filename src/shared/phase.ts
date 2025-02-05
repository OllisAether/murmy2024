export enum Phase {
  Idle = 'idle',
  Work = 'work',
  Vote = 'vote',
}

export const phaseNameMap = {
  [Phase.Idle]: 'Wartephase',
  [Phase.Work]: 'Arbeitsphase',
  [Phase.Vote]: 'Abstimmung',
}

export function phaseToName (phase?: Phase): string | void {
  if (!phase) return
  return phaseNameMap[phase] ?? phase
}