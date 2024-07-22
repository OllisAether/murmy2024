import { cueTypes } from "../../server/game/cue/registeredCueTypes";

export type CueTypes = keyof typeof cueTypes

export const cueType: {
  [key in CueTypes]: key
} = Object.fromEntries(
  (Object.keys(cueTypes) as CueTypes[])
    .map(key => [key, key]) as [CueTypes, CueTypes][]
) as { [key in CueTypes]: key }