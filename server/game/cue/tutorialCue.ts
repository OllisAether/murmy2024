import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue } from "./cue";

export class TutorialCue extends Cue {
  type = CueType.Tutorial

  constructor () {
    super();
  }

  public init () {
    return {
      record: {
        id: 'tutorial',
        phase: Phase.Tutorial,
        duration: 30000
      }
    }
  }

  public getRecordNextFnById (id: string) {
    return undefined
  }

  public toJSON () {
    return {
      type: this.type,
      unlockClues: this.unlockClues
    }
  }
}