import { JsonContent, JsonMap } from "../../../shared/json";
import { Cue } from "../../../shared/cue/Cue";
import { CueHandle } from "./CueHandle";
import { FieldReference } from "../../../shared/cue/FieldRefrence";
import { Idle } from "../../../shared/playback/idle";
import { Vote } from "../../../shared/playback/vote";
import { Work } from "../../../shared/playback/work";
import { Playback } from "../../../shared/playback/Playback";
import { getHandle } from "./registeredCueTypes";
import { Game } from "../game";
import { Database } from "../../database";

export class CueManager {
  currentPlayback: Playback | null = null
  currentPlaybackIndex: number = -1

  currentCue: Cue | null = null
  currentCueMeta: JsonMap = {}
  currentCueIndex: number = -1
  currentCueHandle: CueHandle | null = null

  private playbacks: Playback[] = [
    Idle(),
    Idle(10000),
    Vote(),
    {
      name: 'Add investigation coins',
      trigger: 'auto',
      cues: [
        {
          type: 'AddInvestigationCoins',
          options: {
            amount: 100
          }
        }
      ],
      fields: {}
    },
    Work(),
  ]

  public save () {
    Database.get().saveCollection('playbacks', {
      playbacks: this.playbacks ?? [],
      currentPlaybackIndex: this.currentPlaybackIndex ?? -1,

      currentCueIndex: this.currentCueIndex ?? -1,
      currentCueMeta: this.currentCueMeta ?? {}
    })
  }

  public load () {
    const data = Database.get().getCollection('playbacks')

    if (!data) {
      console.error('[CueManager] No data found')
      return
    }

    if (!Array.isArray(data.playbacks) || 
      data.playbacks.some((p) =>
          p === null ||
          typeof p !== 'object' ||
          Array.isArray(p) ||
          !p.name ||
          !p.trigger ||
          !Array.isArray(p.cues) ||
          p.cues.some((c) =>
            c === null ||
            typeof c !== 'object' ||
            Array.isArray(c) ||
            !c.type
          ) ||
          !p.fields)) {
      console.error('[CueManager] No playbacks found')
      return
    }

    // this.playbacks = data.playbacks as Playback[] ?? this.playbacks
    this.currentPlaybackIndex = data.currentPlaybackIndex as number ?? -1
    this.currentCueIndex = data.currentCueIndex as number ?? -1
    this.currentCueMeta = data.currentCueMeta as JsonMap ?? {}

    console.log(`[CueManager] Load playbacks & cue`, data)

    if (this.currentPlaybackIndex >= 0) {
      console.log(`[CueManager] Init playback ${this.currentPlaybackIndex}`)
      this.currentPlayback = this.playbacks[this.currentPlaybackIndex]

      if (this.currentCueIndex >= 0) {
        this.nextCue(this.currentCueIndex, this.currentCueMeta)
      }
    }

    Game.get().sendCurrentPlaybackToAdmins()
  }

  public getPlaybacks(): Playback[] {
    return this.playbacks
  }

  public getCurrentPlayback() {
    return {
      playback: this.currentPlaybackIndex,
      cue: this.currentCueIndex
    }
  }

  private manualTriggerOverride: boolean = false
  setManualTriggerOverride(value: boolean): void {
    this.manualTriggerOverride = value
  }

  getManualTriggerOverride(): boolean {
    return this.manualTriggerOverride
  }

  public setCurrentPlayback(index: number): void {
    console.log(`[CueManager] Set current playback ${index}`)
    this.deinitCurrentCue()

    if (index >= this.playbacks.length || index < 0) {
      console.error(`[CueManager] Playback index ${index} out of bounds`)
      return
    }

    console.log(`[CueManager] Init playback ${this.currentPlaybackIndex}`)
    
    this.currentPlaybackIndex = index
    this.currentPlayback = this.playbacks[this.currentPlaybackIndex]
    this.currentCueIndex = -1

    Game.get().sendCurrentPlaybackToAdmins()
    this.save()
  }

  /**
   * Initialize the next playback and deinit the current playback
   * If there are no more playbacks, do nothing
   */
  public nextPlayback(): void {
    console.log('[CueManager] Next playback')
    this.deinitCurrentCue()

    if (this.currentPlayback !== null) {
      console.log('[CueManager] Deinit playback')
      this.currentPlayback = null
    }

    this.currentPlaybackIndex++

    if (this.currentPlaybackIndex >= this.playbacks.length) {
      console.error('[CueManager] No more playbacks')
      this.currentPlaybackIndex = -1
      this.currentCueIndex = -1

      Game.get().sendCurrentPlaybackToAdmins()
      this.save()

      Database.get().createBackup('End of playbacks')
      return
    }

    console.log(`[CueManager] Init playback ${this.currentPlaybackIndex}`)
    this.currentPlayback = this.playbacks[this.currentPlaybackIndex]
    this.currentCueIndex = -1

    if (!this.manualTriggerOverride && this.currentPlayback.trigger === 'auto') {
      console.log('[CueManager] Auto trigger')
      this.nextCue()
    } else {
      this.manualTriggerOverride = false
      Game.get().sendCurrentPlaybackToAdmins()
      this.save()
    }

    Database.get().createBackup(`Next playback ${this.currentPlaybackIndex} ${this.currentPlayback?.name}`)
  }

  public deinitCurrentCue(): void {
    if (this.currentCue !== null) {
      console.log('[CueManager] Deinit current cue')
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
      console.error('[CueManager] No current playback')
      return
    }

    this.deinitCurrentCue()

    // Find next cue
    if (gotoIndex !== undefined) {
      this.currentCueIndex = gotoIndex
    } else {
      this.currentCueIndex++
    }

    if (this.currentCueIndex >= this.currentPlayback.cues.length) {
      console.error('[CueManager] No more cues. Next playback')
      this.currentCueIndex = -1
      this.nextPlayback()
      return
    }

    this.currentCue = this.currentPlayback.cues[this.currentCueIndex]
    this.currentCueMeta = meta ?? {}

    // Init next cue
    this.currentCueHandle = getHandle(this.currentCue.type)

    if (this.currentCueHandle === null) {
      console.error(`[CueManager] No handle for cue type ${this.currentCue.type}`)
      return
    }

    console.log(`[CueManager] Init cue ${this.currentCueIndex} of playback ${this.currentPlaybackIndex}`)

    const index = this.currentCueIndex
    const playback = this.currentPlayback
    const options = this.currentCue.options ?? {}

    Game.get().sendCurrentPlaybackToAdmins()
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

      return {
        results: voteManager.getResults(),
        session: voteManager.getActiveSession()
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

      console.log(`[CueManager] Get field value for ${ref}`)

    if (value === null) {
      console.error(`[CueManager] No variable found for ${variable}`)
      return null
    }

    for (const key of path.slice(1)) {
      if (value === null) {
        console.error(`[CueManager] No variable found for ${variable}`)
        return null
      }

      if (typeof value !== 'object') {
        console.error(`[CueManager] Field reference ${key} is not an object or array`, value)
        return null
      }

      if (Array.isArray(value)) {
        const index = parseInt(key, 10)

        if (isNaN(index)) {
          console.error(`[CueManager] Field reference ${index} is not an array index`)
          return null
        }

        value = value[index]
      } else {
        value = value[key]
      }
    }

    return value
  }
}