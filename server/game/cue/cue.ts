import { CueJson, CueType, VoteOptions } from "../../../shared/cue";
import { JsonMap } from "../../../shared/json";
import { Phase } from "../../../shared/phase";

export interface PhaseOptions extends JsonMap {
  vote?: VoteOptions
  media?: string
}

export type CueNext = () => CueRecord | void

export interface CueRecord {
  id: string,
  phase: Phase,
  duration?: number,
  delay?: number,
  meta?: JsonMap,
  options?: PhaseOptions,
  next?: CueNext
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
  record: CueRecord
  onStop?: () => void
  onPaused?: () => void
  onStart?: () => void
}

export abstract class Cue {
  abstract type: CueType

  public unlockClues: string[] = []

  constructor () {}

  abstract init(): CueObject

  public abstract toJSON (): CueJson
  
  public abstract getRecordNextFnById (id: string): CueNext | void
}
