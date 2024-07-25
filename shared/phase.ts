export enum Phase {
  Idle = 'idle',
  Break = 'break',
  Work = 'work',
  Media = 'media',
  Vote = 'vote',
  Quiz = 'quiz',
  Tutorial = 'tutorial',
}

export const phaseNameMap = {
  [Phase.Idle]: 'Warten',
  [Phase.Break]: 'Pause',
  [Phase.Work]: 'Arbeitsphase',
  [Phase.Media]: 'Medienphase',
  [Phase.Vote]: 'Abstimmung',
  [Phase.Quiz]: 'Quiz',
  [Phase.Tutorial]: 'Tutorial',
}

export function phaseToName (phase?: Phase): string | void {
  if (!phase) return
  return phaseNameMap[phase] ?? phase
}