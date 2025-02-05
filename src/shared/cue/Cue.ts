import { JsonContent, JsonMap } from "../json"
import { CueType } from "./CueTypes"
import { FieldReference } from "./FieldRefrence"

export interface Cue extends JsonMap {
  type: CueType
  options?: Record<string, JsonContent | FieldReference>
}