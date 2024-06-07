import { id } from "vuetify/locale";
import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue } from "./cue";

export class IdleCue extends Cue {
  type = CueType.Idle

  constructor (
    private duration?: number
  ) {
    super();
  }

  public init () {
    return {
      record: {
        id: 'idle',
        phase: Phase.Idle,
        duration: this.duration,
      }
    }
  }

  public getRecordNextFnById (id: string) {
    return undefined
  }

  public toJSON () {
    return {
      type: this.type,
      unlockClues: this.unlockClues,
      duration: this.duration
    }
  }
}