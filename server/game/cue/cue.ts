import { CueJson, CueType, VoteOptions } from "../../../shared/cue";
import { JsonMap } from "../../../shared/json";
import { Phase } from "../../../shared/phase";

export interface PhaseOptions extends JsonMap {
  vote?: VoteOptions
  media?: string
}

export type CueNext = (lastRecord?: CueRecord) => CueRecord | void

export interface CueRecord {
  id: string,
  phase: Phase,
  duration?: number,
  delay?: number,
  meta?: JsonMap,
  options?: PhaseOptions,
  next?: CueRecord
}

export interface CueRecordJson extends JsonMap {
  id: string,
  phase: Phase,
  duration?: number,
  delay?: number,
  meta?: JsonMap,
  options?: PhaseOptions,
}

export interface CueObject {
  record?: CueRecord
  next?: CueNext
  onStop?: () => void
  onPaused?: () => void
  onStart?: () => void
}

export abstract class Cue {
  abstract type: CueType

  public unlockFiles: string[] = []

  constructor () {}

  abstract init(): CueObject

  public abstract toJSON (): CueJson
  
  // public abstract getRecordNextFnById (id: string): CueNext | void
}
