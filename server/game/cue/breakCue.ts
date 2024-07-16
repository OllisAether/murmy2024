import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue, CueNext, CueObject } from "./cue";

export class BreakCue extends Cue {
  type = CueType.Break

  constructor (
    private duration?: number
  ) {
    super();
  }

  public init (): CueObject {
    return {
      record: {
        id: 'break',
        phase: Phase.Break,
        duration: this.duration
      }
    }
  }

  public getRecordNextFnById(id: string): void | CueNext {
    return undefined
  }

  public toJSON () {
    return {
      type: this.type,
      unlockFiles: this.unlockFiles,
      duration: this.duration
    }
  }
}