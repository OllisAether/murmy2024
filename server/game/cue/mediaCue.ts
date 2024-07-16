import { CueType } from "../../../shared/cue";
import { Phase } from "../../../shared/phase";
import { Cue, CueObject } from "./cue";

export class MediaCue extends Cue {
  type = CueType.Media

  constructor(
    private media: string
  ) {
    super();
  }

  public init(): CueObject {
    return {
      record: {
        id: 'media',
        phase: Phase.Media,
        options: {
          media: this.media
        }
      }
    }
  }

  public toJSON() {
    return {
      type: this.type,
      unlockFiles: this.unlockFiles,
      media: this.media
    }
  }
}