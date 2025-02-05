import { JsonMap } from "../json"
import { Cue } from "../cue/Cue"

export interface Playback extends JsonMap {
  name: string
  trigger: 'auto' | 'manual'
  cues: Cue[],
  fields: JsonMap
}