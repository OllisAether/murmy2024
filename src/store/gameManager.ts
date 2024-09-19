import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { computed, readonly, ref, watch, WatchStopHandle } from "vue";
import { UAParser } from "ua-parser-js";
import { Asset } from "@/../shared/asset";
import { useAuthManager } from "./authManager";
import { Role } from "../../shared/roles";
import { Phase } from "../../shared/phase";
import { VoteOption, VoteSession } from "../../shared/vote";
import { Entry } from "../../shared/suspectDatabase/entry";
import { useWakeLock } from "@vueuse/core";
import { clues as cluesAsset } from "@/../shared/assets/clues/index";
import { getEntries } from "../../shared/textContent";
import { gallery } from "../../shared/assets/phone/gallery";
import { chats } from "../../shared/assets/phone/chats";
import { transcripts } from "../../shared/assets/transcripts";
import { FormFieldValue } from "../../shared/form";
import { notes } from "../../shared/assets/phone/notes";
import { diaryEntries } from "../../shared/assets/diary/entries";
import { Result } from "../../shared/results";

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  const interacted = ref(false)

  window.addEventListener('pointerdown', () => {
    interacted.value = true
  }, { once: true })

  const loading = ref(false)
  const initialized = ref(false)
  async function initGameManager () {
    if (initialized.value) {
      console.log('GameManager already initialized')
      return
    }
    if (loading.value) {
      console.log('GameManager already initializing')
      return
    }

    loading.value = true

    const auth = useAuthManager()

    if (auth.loading) {
      console.log('Waiting for auth to load')
      await new Promise<void>(resolve => watch(auth, (value) => {
        if (!value.loading) {
          resolve()
        }
      }, { once: true }))
    }

    if (auth.role === Role.Unauthorized) {
      return
    }

    console.log('Initializing GameManager')

    await new Promise<void>(resolve => {
      ws.once('timer').then(resolve)
      ws.send('getTimer')
    })

    startTimeSync()
    syncTime()

    await Promise.all([
      ...(auth.role === Role.Team ? [
        new Promise<void>(resolve => {
          ws.once('suspectDatabase').then(() => {
            console.log('Fetched suspectDatabase')
            resolve()
          })
          ws.send('getSuspectDatabase')
        }),
        new Promise<void>(resolve => {
          ws.once('form').then(() => {
            console.log('Fetched form')
            resolve()
          })
          ws.send('getForm')
        }),
      ] : []),
      ...(auth.role === Role.Board ? [
        new Promise<void>(resolve => {
          ws.once('results').then(() => {
            console.log('Fetched results')
            resolve()
          })
          ws.send('getResults')
        }),
      ] : []),
      new Promise<void>(resolve => {
        ws.once('phase').then(() => {
          console.log('Fetched phase')
          resolve()
        })
        ws.send('getPhase')
      }),
      new Promise<void>(resolve => {
        ws.once('voteSession').then(() => {
          console.log('Fetched voteSession')
          resolve()
        })
        ws.send('getVoteSession')
      }),
      new Promise<void>(resolve => {
        ws.once('votePools').then(() => {
          console.log('Fetched votePools')
          resolve()
        })
        ws.send('getVotePools')
      }),
      new Promise<void>(resolve => {
        ws.once('voteOptions').then(() => {
          console.log('Fetched voteOptions')
          resolve()
        })
        ws.send('getVoteOptions')
      }),
      new Promise<void>(resolve => {
        ws.once('clues').then((res) => {
          console.log('Fetched clues')
          delayedInvestigationCoins.value = res.investigationCoins
          resolve()
        })
        ws.send('getClues')
      }),
      new Promise<void>(resolve => {
        ws.once('media').then(() => {
          console.log('Fetched media')
          resolve()
        })
        ws.send('getMedia')
      }),
      new Promise<void>(resolve => {
        ws.once('shownSuspects').then(() => {
          console.log('Fetched shownSuspects')
          resolve()
        })
        ws.send('getShownSuspects')
      }),
      (async () => {
        switch (auth.role) {
          case Role.Team:
            console.log('Fetching team assets')
            const teamRes = await fetch('/api/assets/team')
              .catch((e) => {
                console.error('Failed to fetch team assets', e)
                return null
              })

            if (!teamRes) {
              break
            }

            const teamAssets: Asset[] = await teamRes.json()
            await preloadAssets(teamAssets)
            break
          case Role.Board:
            console.log('Fetching board assets')
            const boardRes = await fetch('/api/assets/board')
              .catch((e) => {
                console.error('Failed to fetch board assets', e)
                return null
              })

            if (!boardRes) {
              break
            }

            const boardAssets: Asset[] = await boardRes.json()
            await preloadAssets(boardAssets)
            break
          case Role.Admin:
            console.log('Fetching admin assets')
            const { useAdmin } = await import('./admin')
            const admin = useAdmin()
            await preloadAssets(
              admin.assets.team.concat(admin.assets.shared, admin.assets.board)
                .filter((asset) => !asset.url.endsWith('.mp4'))
            )
            break
        }
      })()
    ])

    // Reinitialize game manager when tab is focused
    document.addEventListener('visibilitychange', onFocus)

    loading.value = false
    initialized.value = true
    console.log('GameManager initialized')
  }

  function deinitGameManager () {
    console.log('GameManager deinitialized')

    stopTimerInterval()
    timer.value = {
      startTime: null,
      currentTime: 0,
      duration: 0,
      state: 'stopped'
    }

    stopTimeSync()
    timeSync.value = {
      ping: null,
      diff: 0
    }

    phase.value = {
      type: Phase.Idle,
      meta: {}
    }

    vote.value = {
      pools: {},
      session: null
    }

    voteOptions.value = []

    currentMedia.value = null
    watchedMedia.value = []

    database.value = {
      entries: []
    }

    clues.value = {
      mainClueType: null,
      mainClueUnlocked: false,
      available: [],
      new: [],
      unlocked: [],
      investigationCoins: 0
    }

    form.value = {}

    stopInvestigationCoinsDelay()

    document.removeEventListener('visibilitychange', onFocus)
    initialized.value = false
  }

  async function reinitGameManager () {
    deinitGameManager()
    await initGameManager()
  }

  function onFocus () {
    if (document.visibilityState === 'visible') {
      reinitGameManager()
    }
  }

  // #region Fullscreen
  const canFullscreen = ref(false)
  const isPwa = ref(window.matchMedia('(display-mode: standalone)').matches)

  const ua = new UAParser(navigator.userAgent).getResult()

  console.log('User agent', ua)

  function checkCanFullscreen () {
    console.log('Checking fullscreen support')
    if (
      !(ua.browser.name === 'Safari' && ua.device.type === 'tablet') &&
      ua.os.name !== 'iOS' &&
      window.outerWidth >= 1366) {
      canFullscreen.value = true
    } else {
      canFullscreen.value = false
    }
  }
  checkCanFullscreen()

  window.addEventListener('resize', checkCanFullscreen)

  const isFullscreen = ref(false)

  document.addEventListener('fullscreenchange', function () {
    isFullscreen.value = !!document.fullscreenElement
  })

  function toggleFullscreen () {
    if (!canFullscreen.value) {
      return
    }

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }
  // #endregion

  // #region Help
  async function getHelp () {
    const res = await ws.request('help')

    if (!res.success) {
      console.error('Failed to get help', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }
  // #endregion

  // #region Assets
  const assetsProgress = ref<{
    loading: boolean
    loaded: boolean
    loadedAssets: number
    progresses: Record<string, number>
    totalAssets: number
  }>({
    loading: false,
    loaded: false,
    loadedAssets: 0,
    progresses: {},
    totalAssets: 0
  })
  const assets = ref<Asset[]>([])
  function preloadAssets (_assets: Asset[]) {
    assetsProgress.value.loading = true
    assetsProgress.value.loadedAssets = 0
    assetsProgress.value.progresses = {}
    assetsProgress.value.totalAssets = _assets.length
    assetsProgress.value.loaded = _assets.length === 0

    if (_assets.length === 0) {
      return Promise.resolve()
    }

    assets.value = _assets.map(asset => ({
      ...asset,
      content: undefined
    }))

    return new Promise<void>(async (resolve) => {
      function finishAsset (asset: Asset) {
        assetsProgress.value.loadedAssets++
        assetsProgress.value.progresses[asset.name] = 1

        if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
          assetsProgress.value.loaded = true
          assetsProgress.value.loading = false
          console.log('%c[GameManager]', 'color: #4CAF50', 'All assets loaded')
          resolve()
        }
      }

      for (const asset of assets.value) {
        assetsProgress.value.progresses[asset.name] = 0

        if (asset.content !== undefined) {
          finishAsset(asset)
          continue
        }

        if (import.meta.env.DEV && useAuthManager().role !== Role.Team) {
          console.log('%c[GameManager]', 'color: #4CAF50', 'Skipping asset preload', asset.name)
          asset.content = asset.url
          finishAsset(asset)
          continue
        }

        const xhr = new XMLHttpRequest()

        xhr.open('GET', asset.url, true)
        xhr.responseType = 'blob'

        xhr.onprogress = function (event) {
          if (event.lengthComputable) {
            assetsProgress.value.progresses[asset.name] = event.loaded / event.total
          }
        }

        xhr.onerror = function () {
          console.error('%c[GameManager]', 'color: #4CAF50', 'Failed to load asset', asset.url)

          finishAsset(asset)
        }

        xhr.onload = async function () {
          if (xhr.status === 200) {
            const blob = xhr.response

            const objectURL = URL.createObjectURL(blob)

            const metadata = await new Promise((resolve, reject) => {
              if (blob.type.startsWith('image')) {
                const img = new Image()
                img.onload = () => resolve({
                  mime: blob.type,
                  width: img.width,
                  height: img.height
                })
                img.onerror = reject
                img.src = objectURL
                return
              } else {
                resolve({
                  mime: blob.type
                })
              }
            }).catch((e) => {
              console.error('Failed to load metadata', blob.type, e)
              return {}
            })

            asset.metadata = metadata
            asset.content = objectURL
            console.log('%c[GameManager]', 'color: #4CAF50', 'Loaded asset', asset)
            finishAsset(asset)
          } else {
            console.error('%c[GameManager]', 'color: #4CAF50', 'Failed to load asset', asset.url)
            finishAsset(asset)
          }
        }

        xhr.send()
      }
    })
  }

  function getAsset (name?: string) {
    const asset = assets.value.find(asset => asset.name === name)

    if (!asset) {
      console.error('%c[GameManager]', 'color: #4CAF50', 'Asset not found', name)
      return null
    }

    return asset
  }
  // #endregion

  // #region Timer
  const timer = ref<{
    startTime: number | null
    currentTime: number
    duration: number
    state: 'running' | 'paused' | 'stopped'
  }>({
    startTime: null,
    currentTime: 0,
    duration: 0,
    state: 'stopped'
  })
  const timeSync = ref<{
    ping: number | null
    diff: number
  }>({
    ping: null,
    diff: 0
  })

  try {
    const timeSyncData = JSON.parse(localStorage.getItem('timeSync') || '{}')

    timeSync.value = {
      ping: timeSyncData.ping,
      diff: timeSyncData.diff
    }
  } catch (e) {
    console.error('Failed to load time sync data', e)
  }
  watch(timeSync, (value) => {
    localStorage.setItem('timeSync', JSON.stringify(value))
  })

  ws.onAction('timer', (data: {
    startTime: number | null
    duration: number
    currentTime: number
    state: 'running' | 'paused' | 'stopped'
  }) => {
    console.log('Timer data', data)

    timer.value.startTime = data.startTime
    timer.value.duration = data.duration
    timer.value.state = data.state

    if (timer.value.state === 'running') {
      if (timerInterval === null) {
        startTimerInterval()
      }
    } else if (timer.value.state === 'stopped') {
      timer.value.currentTime = data.currentTime
      stopTimerInterval()
    } else if (timer.value.state === 'paused') {
      timer.value.currentTime = data.currentTime
      stopTimerInterval()
    } else {
      console.error('Invalid timer state', timer.value.state)
    }
  })

  let timerInterval: number | null = null
  function startTimerInterval () {
    function updateTimer () {
      if (timer.value.state !== 'running') {
        return
      }

      timerInterval = requestAnimationFrame(updateTimer)

      // console.log('Timer:', timer.value.currentTime)

      timer.value.currentTime = Math.max(0, Math.min(timer.value.duration, Date.now() - (timer.value.startTime || 0) + timeSync.value.diff))
    }

    timerInterval = requestAnimationFrame(updateTimer)
  }

  function stopTimerInterval () {
    if (timerInterval) {
      cancelAnimationFrame(timerInterval)
      timerInterval = null
    }
  }

  async function syncTime() {
    const pingStart = Date.now()

    const serverTime = await ws.request('timeSync')

    const pingEnd = Date.now()

    const ping = pingEnd - pingStart

    if (timeSync.value.ping && timeSync.value.ping < ping) {
      return
    }

    const clientTime = Date.now() - ping / 2

    const diff = serverTime - clientTime

    timeSync.value = {
      ping,
      diff
    }

    console.log('Time sync', timeSync.value)
  }

  let timeSyncTimeout: number | null = null
  function startTimeSync () {
    const upperBound = 30000
    const interval = Math.min(upperBound, (1 / (Math.sqrt(timeSync.value.ping ?? 100))) * upperBound)

    console.log('Time sync interval', interval)

    timeSyncTimeout = setTimeout(() => {
      syncTime()

      startTimeSync()
    }, interval) as unknown as number
  }

  function stopTimeSync () {
    if (timeSyncTimeout) {
      clearInterval(timeSyncTimeout)
      timeSyncTimeout = null
    }
  }
  // #endregion

  // #region Phases
  const phase = ref<{
    type: Phase,
    meta: any
  }>({
    type: Phase.Idle,
    meta: {}
  })

  ws.onAction('phase', (data: {
    type: Phase,
    meta: any
  }) => {
    phase.value.meta = data.meta ?? {}
    phase.value.type = data.type ?? Phase.Idle
  })
  // #endregion

  // #region Vote
  const vote = ref<{
    pools: Record<string, string[]>,
    session: VoteSession | null
  }>({
    pools: {},
    session: null
  })
  const voteOptions = ref<VoteOption[]>([])

  ws.onAction('votePools', (data: Record<string, string[]>) => {
    vote.value.pools = data
  })

  ws.onAction('voteSession', (data: VoteSession) => {
    vote.value.session = data ?? null
  })

  ws.onAction('voteOptions', (data: VoteOption[]) => {
    voteOptions.value = data
  })

  const voted = computed(() => {
    if (!vote.value.session) return false

    const id = useAuthManager().team?.id ?? ''

    if (vote.value.session.isTiebreaker) {
      let found: string | false = false
      if (vote.value.session.tiebreakerVotes) {
        let _found = Object.keys(vote.value.session.tiebreakerVotes)
          .find(option => vote.value.session!.tiebreakerVotes![option].includes(id)) ?? false

        if (_found) {
          found = _found
        }
      }

      if (vote.value.session.passiveTiebreakerVotes) {
        let _found = Object.keys(vote.value.session.passiveTiebreakerVotes)
          .find(option => vote.value.session!.passiveTiebreakerVotes![option].includes(id)) ?? false

        if (_found) {
          found = _found
        }
      }
    
      return found
    }

    if (vote.value.session.isRandom) {
      return false
    }

    let found1 = Object.keys(vote.value.session.votes)
      .find(option => vote.value.session!.votes[option].includes(id)) ?? false

    if (found1) {
      return found1
    }

    let found2 = Object.keys(vote.value.session.passiveVotes)
      .find(option => vote.value.session!.passiveVotes[option].includes(id)) ?? false

    return found2
  })

  const pool = computed(() => {
    const pools = vote.value.pools
    const session = vote.value.session satisfies VoteSession | null

    if (!session) {
      return []
    }

    if (session.isTiebreaker) {
      return session.tiebreakerCandidates ?? []
    }

    return pools[session.pool]
  })

  const candidates = computed(() => {
    return pool.value?.map((candidate) => {
      const option = voteOptions.value
        .find((option) => option.id === candidate)
      
      if (!option) {
        return null
      }

      const votes = vote.value.session?.isTiebreaker
        ? vote.value.session.tiebreakerVotes?.[candidate] ?? []
        : vote.value.session?.votes[candidate] ?? []

      return {
        ...option,
        votes
      }
    }).filter((candidate) => !!candidate) as (VoteOption & {
      votes: string[]
    })[] ?? []
  })

  function addVote (option: string) {
    ws.send('vote', { option })
  }
  // #endregion

  // #region Board Skip
  function triggerBoardSkip () {
    ws.send('boardSkip')
  }
  // #endregion

  // #region Media
  const currentMedia = ref<string | null>(null)
  const watchedMedia = ref<string[]>([])

  const availableTranscripts = computed(() => transcripts.filter((transcript) => watchedMedia.value.includes(transcript.for)))

  ws.onAction('media', (data: {
    currentMedia: string | null
    watchedMedia: string[]
  }) => {
    currentMedia.value = data.currentMedia
    watchedMedia.value = data.watchedMedia
  })

  function mediaFinished () {
    ws.send('mediaFinished')
  }

  function mediaProgress (progress: number) {
    ws.send('mediaProgress', { progress })
  }

  function mediaDuration (duration: number) {
    ws.send('mediaDuration', { duration })
  }

  function mediaState (state: 'playing' | 'paused') {
    ws.send('mediaState', { state })
  }
  // #endregion

  // #region Suspect Database
  const database = ref<{
    entries: string[]
  }>({
    entries: []
  })

  const shownSuspects = ref<string[]>([])

  ws.onAction('suspectDatabase', (db: {
    entries: string[]
  }) => {
    database.value = db
  })

  ws.onAction('shownSuspects', (suspects: string[]) => {
    shownSuspects.value = suspects
  })

  function addDatabaseEntry (entryId: string) {
    ws.send('suspectDatabaseEntry', { entryId })
  }

  const allEntries = computed(() => collectAllEntries())
  function collectAllEntries () {
    const entries: Entry[] = []

    transcripts.forEach((transcript) => {
      transcript.content.forEach((line) => {
        entries.push(...getEntries(line[1]))
      })
    })

    cluesAsset.forEach((clue) => {
      clue.images?.entries?.forEach((entry) => {
        if (entry.entry) {
          entries.push(entry.entry)
        }
      })

      // getEntries(clue.text?.content ?? '').forEach((entry) => {
      //   entries.push(entry)
      // })
    })

    gallery.forEach((item) => {
      item.entries?.forEach((entry) => {
        if (entry.entry) {
          entries.push(entry.entry)
        }
      })
    })

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.type === 'message') {
          getEntries(message.content).forEach((entry) => {
            entries.push(entry)
          })
        }

        if (message.type === 'image') {
          message.entries?.forEach((entry) => {
            if (entry.entry) {
              entries.push(entry.entry)
            }
          })
        }
      })
    })

    notes.forEach((note) => {
      getEntries(note.content).forEach((entry) => {
        entries.push(entry)
      })
    })

    diaryEntries.forEach((entry) => {
      entries.push(entry)
    })

    return entries
  }
  // #endregion

  // #region Clues
  const clues = ref<{
    mainClueType: 'phone' | 'diary' | null
    mainClueUnlocked: boolean
    available: string[]
    new: string[]
    unlocked: string[]
    investigationCoins: number
  }>({
    mainClueType: null,
    mainClueUnlocked: false,
    available: [],
    new: [],
    unlocked: [],
    investigationCoins: 0
  })

  const delayedInvestigationCoins = ref<number>(0)
  let investigationCoinsWatcher: WatchStopHandle | null = null
  function startInvestigationCoinsDelay () {
    investigationCoinsWatcher = watch(clues, (value) => {
      if (value.investigationCoins !== delayedInvestigationCoins.value) {
        delayedInvestigationCoins.value = value.investigationCoins
      }
    }, { immediate: true })
  }

  function stopInvestigationCoinsDelay () {
    investigationCoinsWatcher?.()
  }

  ws.onAction('clues', (data: {
    mainClueType: 'phone' | 'diary' | null
    mainClueUnlocked: boolean
    available: string[]
    new: string[]
    unlocked: string[]
    investigationCoins: number
  }) => {
    clues.value = data
  })

  async function unlockClue (clueId: string) {
    return await ws.request('unlockClue', { clueId })
  }

  function setMainClueUnlocked (unlocked: boolean) {
    ws.send('setMainClueUnlocked', { unlocked })
  }
  // #endregion

  // #region Form
  const form = ref<Record<string, FormFieldValue>>({})
  const formSubmitted = ref(false)

  ws.onAction('form', (data: {
    fields: Record<string, FormFieldValue>,
    submitted: boolean
  }) => {
    form.value = data.fields ?? {}
    formSubmitted.value = data.submitted ?? false
  })

  function setFieldValue (fieldId: string, value: FormFieldValue) {
    ws.send('setField', { fieldId, value })
  }

  function submitForm () {
    ws.send('submitForm')
  }

  // Board only & Admin only
  const results = ref<Result[]>([])

  ws.onAction('results', (data: Result[]) => {
    results.value = data
  })
  // #endregion

  return {
    interacted: readonly(interacted),
    loading: readonly(loading),
    initialized: readonly(initialized),
    initGameManager,
    deinitGameManager,
    canFullscreen: readonly(canFullscreen),
    isPwa: readonly(isPwa),
    toggleFullscreen,
    getHelp,
    assetsProgress: readonly(assetsProgress),
    preloadAssets,
    getAsset,
    
    isFullscreen: readonly(isFullscreen),
    wakelock: useWakeLock(),
    wakelockShouldBeActive: ref(false),

    timer: readonly(timer),
    timeSync: readonly(timeSync),
    phase: readonly(phase),

    triggerBoardSkip,

    currentMedia: readonly(currentMedia),
    watchedMedia: readonly(watchedMedia),
    availableTranscripts,

    mediaFinished,
    mediaProgress,
    mediaDuration,
    mediaState,

    vote,
    voteOptions,
    voted,
    pool,
    candidates,
    addVote,

    database,
    shownSuspects,
    addDatabaseEntry,
    collectAllEntries,
    allEntries,

    clues,
    unlockClue,
    setMainClueUnlocked,

    delayedInvestigationCoins,
    startInvestigationCoinsDelay,
    stopInvestigationCoinsDelay,

    form,
    formSubmitted,
    setFieldValue,
    submitForm,
    results
  }
})