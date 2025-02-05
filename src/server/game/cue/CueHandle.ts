import { JsonContent, JsonMap } from "../../../shared/json"
import { FieldReference } from "../../../shared/cue/FieldRefrence"
import { Playback } from "../../../shared/playback/Playback"

export interface CueHandleCtx<T extends JsonMap> {
  index: number
  playback: Playback
  getFieldValue: (ref: FieldReference | JsonContent) => JsonContent
  options: {
    [P in keyof T]: FieldReference | T[P]
  }
  meta: JsonMap
}

export type CueHandleNext = (index?: number, meta?: JsonMap) => void

export abstract class CueHandle {
  constructor () {}

  public abstract start (
    next: CueHandleNext,
    ctx: CueHandleCtx<JsonMap>
  ): void
  public abstract stop (): void
}