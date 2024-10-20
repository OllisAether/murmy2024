import { FieldReference } from "../cue/FieldRefrence";
import { Playback } from "./Playback";
import { CueType } from "../cue/CueTypes";

export const AddClues = (clueIds: string[] | FieldReference): Playback => ({
  name: 'Clues hinzufügen',
  trigger: 'auto',
  cues: [
    {
      type: CueType.AddClues,
      options: {
        clues: FieldReference('clueIds')
      }
    }
  ],
  fields: {
    clueIds: clueIds ?? []
  }
})