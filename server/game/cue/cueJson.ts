import { ca } from "vuetify/locale"
import { CueJson, CueType } from "../../../shared/cue"
import { BreakCue } from "./breakCue"
import { Cue } from "./cue"
import { IdleCue } from "./idleCue"
import { MediaCue } from "./mediaCue"
import { TutorialCue } from "./tutorialCue"
import { VoteCue } from "./voteCue"
import { WorkCue } from "./workCue"

export function fromCueJson (json: CueJson): Cue {
  switch (json.type) {
    case CueType.Idle:
      if (json.duration && typeof json.duration !== 'number') {
        throw new Error('Invalid idle cue')
      }

      return new IdleCue(json.duration)
    case CueType.Tutorial:
      return new TutorialCue()
    case CueType.Vote:
      if (!json.vote || !json.vote.options || !json.vote.tieBreakerDuration) {
        throw new Error('Invalid vote cue')
      }

      return new VoteCue(json.vote.options, json.duration, json.vote.tieBreakerDuration)
    case CueType.Break:
      if (!json.duration || typeof json.duration !== 'number') {
        throw new Error('Invalid break cue')
      }

      return new BreakCue(json.duration)
    case CueType.Media:
      if (!json.media || typeof json.media !== 'string') {
        throw new Error('Invalid media cue')
      }

      return new MediaCue(json.media)
    case CueType.Work:
      if (!json.duration || typeof json.duration !== 'number') {
        throw new Error('Invalid work cue')
      }

      return new WorkCue(json.duration)
    default:
      throw new Error(`Unknown cue type: ${json.type}`)
  }
}

export function validateCueJson (json: CueJson): boolean {
  try {
    fromCueJson(json)
    return true
  } catch (e) {
    return false
  }
}