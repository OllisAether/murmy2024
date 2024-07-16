import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue, CueObject } from "./cue";

export class WorkCue extends Cue {
  type = CueType.Work

  constructor(
    private duration: number
  ) {
    super();
  }

  public init(): CueObject {
    return {
      record: {
        id: 'work',
        phase: Phase.Work,
        duration: this.duration,
      }
    }
  }

  public toJSON() {
    return {
      type: this.type,
      unlockFiles: this.unlockFiles,
      duration: this.duration
    }
  }
}