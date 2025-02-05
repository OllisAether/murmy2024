import { JsonMap } from "../json"

export interface FieldReference extends JsonMap {
  $ref: string
}

export function FieldReference (ref: string): FieldReference {
  return { $ref: ref }
}
