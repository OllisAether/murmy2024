import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue, CueObject } from "./cue";

export class TutorialCue extends Cue {
  type = CueType.Tutorial

  constructor () {
    super();
  }

  public init (): CueObject {
    return {
      next: (lastRecord) => {
        switch (lastRecord?.id) {
          case undefined:
            return {
              id: 'intro',
              phase: Phase.Media,
              options: {
                media: 'intro'
              }
            }
          case 'intro':
            return {
              id: 'tutorial',
              phase: Phase.Tutorial,
            }
        }
      }
    }
  }


  public toJSON () {
    return {
      type: this.type,
      unlockFiles: this.unlockFiles
    }
  }
}