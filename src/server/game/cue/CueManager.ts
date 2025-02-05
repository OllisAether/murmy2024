import { JsonContent, JsonMap } from "../../../shared/json";
import { Cue } from "../../../shared/cue/Cue";
import { CueHandle } from "./CueHandle";
import { FieldReference } from "../../../shared/cue/FieldRefrence";
import { Playback } from "../../../shared/playback/Playback";
import { getHandle } from "./registeredCueTypes";
import { Game } from "../game";
import { Database } from "../../database";
import { colorize, Fg } from "../../console";
import { playbacks } from "../../../shared/assets/playbacks";
import { ref } from "vue";

export class CueManager {
  currentPlayback: Playback | null = null
  currentPlaybackIndex = ref<number>(-1)

  currentCue: Cue | null = null
  currentCueMeta: JsonMap = {}
  currentCueIndex = ref<number>(-1)
  currentCueHandle: CueHandle | null = null

  private playbacks: (Playback | {
    divider: string
  })[] = playbacks

  public save () {
    console.log(colorize('[CueManager]', Fg.Magenta), 'Save playbacks & cue')
    Database.get().saveCollection('playbacks', {
      // playbacks: this.getOnlyPlaybacks() ?? [],
      currentPlaybackIndex: this.currentPlaybackIndex.value ?? -1,

      currentCueIndex: this.currentCueIndex.value ?? -1,
      currentCueMeta: this.currentCueMeta ?? {}
    })
  }

  public load () {
    console.log(colorize('[CueManager]', Fg.Magenta), 'Load playbacks & cue')
    const data = Database.get().getCollection('playbacks')
    console.log(data)

    if (!data) {
      return
    }

    // if (!Array.isArray(data.playbacks) || 
    //   data.playbacks.some((p) =>
    //       p === null ||
    //       typeof p !== 'object' ||
    //       Array.isArray(p) ||
    //       !p.name ||
    //       !p.trigger ||
    //       !Array.isArray(p.cues) ||
    //       p.cues.some((c) =>
    //         c === null ||
    //         typeof c !== 'object' ||
    //         Array.isArray(c) ||
    //         !c.type
    //       ) ||
    //       !p.fields)) {
    //   console.error(colorize('[CueManager]', Fg.Magenta), 'Invalid playbacks data')
    //   return
    // }

    // this.getOnlyPlaybacks() = data.playbacks as Playback[] ?? this.getOnlyPlaybacks()
    this.currentPlaybackIndex.value = data.currentPlaybackIndex as number ?? -1
    this.currentCueIndex.value = data.currentCueIndex as number ?? -1
    this.currentCueMeta = data.currentCueMeta as JsonMap ?? {}

    console.log(colorize('[CueManager]', Fg.Magenta), 'Load playbacks & cue')

    if (this.currentPlaybackIndex.value >= 0) {
      console.log(colorize('[CueManager]', Fg.Magenta), `Init playback ${this.currentPlaybackIndex.value}`, this.getOnlyPlaybacks()[this.currentPlaybackIndex.value])
      this.currentPlayback = this.getOnlyPlaybacks()[this.currentPlaybackIndex.value]

      if (this.currentCueIndex.value >= 0) {
        this.nextCue(this.currentCueIndex.value, this.currentCueMeta)
      }
    }

    // Game.get().sendCurrentPlaybackToAdmins()
  }

  public getPlaybacks(): (Playback | {
    divider: string
  })[] {
    return this.playbacks
  }
  public getOnlyPlaybacks(): Playback[] {
    return this.playbacks.filter(p => !p.divider) as Playback[]
  }

  public getCurrentPlayback() {
    return {
      playback: this.currentPlaybackIndex.value,
      cue: this.currentCueIndex.value
    }
  }

  public setPlaybackFields(playbackIndex: number, fields: JsonMap): void {
    if (playbackIndex < 0 || playbackIndex >= this.getOnlyPlaybacks().length) {
      console.error(colorize('[CueManager]', Fg.Magenta), `Playback index ${playbackIndex} out of bounds`)
      return
    }

    this.getOnlyPlaybacks()[playbackIndex].fields = fields
    // Game.get().sendPlaybacksToAdmins()
    this.save()
  }

  setPlaybackTrigger(playbackIndex: number, trigger: 'auto' | 'manual'): void {
    if (playbackIndex < 0 || playbackIndex >= this.getOnlyPlaybacks().length) {
      console.error(colorize('[CueManager]', Fg.Magenta), `Playback index ${playbackIndex} out of bounds`)
      return
    }

    this.getOnlyPlaybacks()[playbackIndex].trigger = trigger
    // Game.get().sendPlaybacksToAdmins()
    this.save()
  }

  private manualTriggerOverride: boolean = false
  setManualTriggerOverride(value: boolean): void {
    this.manualTriggerOverride = value

    // Game.get().sendPlaybacksToAdmins()
    this.save()
  }

  getManualTriggerOverride(): boolean {
    return this.manualTriggerOverride
  }

  public setCurrentPlayback(index: number): void {
    console.log(colorize('[CueManager]', Fg.Magenta), `Set current playback ${index}`)
    this.deinitCurrentCue()

    if (index >= this.getOnlyPlaybacks().length || index < 0) {
      console.error(colorize('[CueManager]', Fg.Magenta), `Playback index ${index} out of bounds`)
      return
    }

    // console.log(colorize('[CueManager]', Fg.Magenta), `Init playback ${this.currentPlaybackIndex.value}`)

    this.currentPlaybackIndex.value = index
    this.currentPlayback = this.getOnlyPlaybacks()[this.currentPlaybackIndex.value]
    this.currentCueIndex.value = -1

    // Game.get().sendCurrentPlaybackToAdmins()
    this.save()
  }

  /**
   * Initialize the next playback and deinit the current playback
   * If there are no more playbacks, do nothing
   */
  public nextPlayback(): void {
    console.log(colorize('[CueManager]', Fg.Magenta), 'Next playback')
    this.deinitCurrentCue()

    if (this.currentPlayback !== null) {
      // console.log(colorize('[CueManager]', Fg.Magenta), 'Deinit playback')
      this.currentPlayback = null
    }

    this.currentPlaybackIndex.value++

    if (this.currentPlaybackIndex.value >= this.getOnlyPlaybacks().length) {
      console.warn(colorize('[CueManager]', Fg.Magenta), 'No more playbacks')
      this.currentPlaybackIndex.value = -1
      this.currentCueIndex.value = -1

      // Game.get().sendCurrentPlaybackToAdmins()
      this.save()

      // Database.get().createBackup('End of playbacks')
      return
    }

    // console.log(colorize('[CueManager]', Fg.Magenta), `Init playback ${this.currentPlaybackIndex.value}`)
    this.currentPlayback = this.getOnlyPlaybacks()[this.currentPlaybackIndex.value]
    this.currentCueIndex.value = -1

    if (!this.manualTriggerOverride && this.currentPlayback.trigger === 'auto') {
      console.log(colorize('[CueManager]', Fg.Magenta), 'Auto trigger')
      this.nextCue()
    } else {
      this.manualTriggerOverride = false
      // Game.get().sendCurrentPlaybackToAdmins()
      // Game.get().sendPlaybacksToAdmins()
      this.save()
    }

    // Database.get().createBackup(`Next playback ${this.currentPlaybackIndex.value} ${this.currentPlayback?.name}`)
  }

  public deinitCurrentCue(): void {
    if (this.currentCue !== null) {
      // console.log(colorize('[CueManager]', Fg.Magenta), 'Deinit current cue')
      this.currentCueHandle?.stop()
      this.currentCue = null
      this.currentCueHandle = null
      this.currentCueMeta = {}
    }
  }

  /**
   * Go to the next cue in the current playback and deinit the current cue
   * If there are no more cues, init the next playback
   *
   * @param gotoIndex If provided, will go to the cue at the given index
   * @param meta Some meta data to pass to the cue
   */
  public nextCue(gotoIndex?: number, meta?: JsonMap) {
    if (this.currentPlayback === null) {
      console.warn(colorize('[CueManager]', Fg.Magenta), 'No current playback')
      return
    }

    this.deinitCurrentCue()

    // Find next cue
    if (gotoIndex !== undefined) {
      this.currentCueIndex.value = gotoIndex
    } else {
      this.currentCueIndex.value++
    }

    if (this.currentCueIndex.value >= this.currentPlayback.cues.length) {
      // console.warn(colorize('[CueManager]', Fg.Magenta), 'No more cues. Next playback')
      this.currentCueIndex.value = -1
      this.nextPlayback()
      return
    }

    this.currentCue = this.currentPlayback.cues[this.currentCueIndex.value]
    this.currentCueMeta = meta ?? {}

    // Init next cue
    this.currentCueHandle = getHandle(this.currentCue.type)

    if (this.currentCueHandle === null) {
      console.error(colorize('[CueManager]', Fg.Magenta), `No handle for cue type ${this.currentCue.type}`)
      return
    }

    console.log(colorize('[CueManager]', Fg.Magenta), `Init cue ${this.currentCueIndex.value} of playback ${this.currentPlaybackIndex.value}`)

    const index = this.currentCueIndex.value
    const playback = this.currentPlayback
    const options = this.currentCue.options ?? {}

    // Game.get().sendCurrentPlaybackToAdmins()
    this.save()

    this.currentCueHandle.start(this.nextCue.bind(this), {
      index,
      playback,
      getFieldValue: (ref) => this.getFieldValue(ref, playback),
      options,
      meta: this.currentCueMeta
    })
  }

  globalVariables: Record<string, () => JsonContent> = {
    'vote': () => {
      const game = Game.get()
      const voteManager = game.voteManager

      const activeSession = voteManager.getActiveSession()

      return {
        results: voteManager.getResults(),
        pool: activeSession
          ? voteManager.getPools()[activeSession.pool]
          : null,
        session: activeSession
      }
    },
    'clues': () => {
      const game = Game.get()

      return {
        new: game.clueManager.getNewAvailableClues()
      }
    }
  }

  public getFieldValue(fieldReference: FieldReference | JsonContent, playback: Playback): JsonContent {
    if ((fieldReference as FieldReference)?.$ref === undefined) {
      return fieldReference
    }

    const ref = (fieldReference as FieldReference).$ref

    const path = ref.split('.')
    const variable = path[0]
    let value: JsonContent = playback.fields[variable]
      ?? this.globalVariables[variable]?.()
      ?? null

      // console.log(colorize('[CueManager]', Fg.Magenta), `Get field value for ${ref}`, value)

    if (value === null) {
      console.error(colorize('[CueManager]', Fg.Magenta), `No variable found for ${variable}`)
      return null
    }

    for (const key of path.slice(1)) {
      if (value === null) {
        console.error(colorize('[CueManager]', Fg.Magenta), `No variable found for ${variable}`)
        return null
      }

      if (typeof value !== 'object') {
        console.error(colorize('[CueManager]', Fg.Magenta), `Field reference ${key} is not an object or array`, value)
        return null
      }

      if (Array.isArray(value)) {
        if (key === 'length') {
          value = value.length
          continue
        }

        const index = parseInt(key, 10)

        if (isNaN(index)) {
          console.error(colorize('[CueManager]', Fg.Magenta), `Field reference ${index} is not an array index`)
          return null
        }

        value = value[index]
      } else {
        value = value[key]
      }
    }

    console.log(colorize('[CueManager]', Fg.Magenta), `Get field value for ${ref}`, value)

    return this.getFieldValue(value, playback)
  }
}