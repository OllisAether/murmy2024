import { JsonContent, JsonMap } from "../json"
import { CueTypes } from "./CueTypes"
import { FieldReference } from "./FieldRefrence"

export interface Cue extends JsonMap {
  type: CueTypes
  options?: Record<string, JsonContent | FieldReference>
}