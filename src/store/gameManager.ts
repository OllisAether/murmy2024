import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { computed, readonly, ref, watch } from "vue";
import { boardAssets, teamAssets } from "../assets/assets";
import { UAParser } from "ua-parser-js";
import { Asset } from "@/model/asset";
import { useAuthManager } from "./authManager";
import { Role } from "../../shared/roles";
import { Phase } from "../../shared/phase";
import { VoteOption, VoteSession } from "../../shared/vote";
import { Entry } from "../../shared/suspectDatabase/entry";

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  const interacted = ref(false)

  window.addEventListener('pointerdown', () => {
    interacted.value = true
  }, { once: true })

  const loading = ref(false)
  const initialized = ref(false)
  async function initGameManager () {
    if (initialized.value) return
    if (loading.value) return

    loading.value = true

    const auth = useAuthManager()

    if (auth.loading) {
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

    switch (auth.role) {
      case Role.Team:
        await preloadAssets(teamAssets)
        break
      case Role.Board:
        await preloadAssets(boardAssets)
        await new Promise<void>(resolve => {
          ws.once('currentMedia').then(resolve)
          ws.send('getMedia')
        })
        break
    }

    await new Promise<void>(resolve => {
      ws.once('timer').then(resolve)
      ws.send('getTimer')
    })

    startTimeSync()
    syncTime()

    await new Promise<void>(resolve => {
      ws.once('phase').then(resolve)
      ws.send('getPhase')
    })

    await new Promise<void>(resolve => {
      ws.once('voteSession').then(resolve)
      ws.send('getVoteSession')
    })
    await new Promise<void>(resolve => {
      ws.once('votePools').then(resolve)
      ws.send('getVotePools')
    })
    await new Promise<void>(resolve => {
      ws.once('voteOptions').then(resolve)
      ws.send('getVoteOptions')
    })
    await new Promise<void>(resolve => {
      ws.once('suspectDatabase').then(resolve)
      ws.send('getSuspectDatabase')
    })
    await new Promise<void>(resolve => {
      ws.once('clues').then(resolve)
      ws.send('getClues')
    })

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

    initialized.value = false
  }

  // #region Fullscreen
  const canFullscreen = ref(false)
  const isPwa = ref(window.matchMedia('(display-mode: standalone)').matches)

  const ua = new UAParser(navigator.userAgent).getResult()

  console.log('User agent', ua)

  if (!(ua.browser.name === 'Safari' && ua.device.type === 'tablet') && ua.os.name !== 'iOS') {
    canFullscreen.value = true
  }

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
    loaded: boolean
    loadedAssets: number
    progresses: Record<string, number>
    totalAssets: number
  }>({
    loaded: false,
    loadedAssets: 0,
    progresses: {},
    totalAssets: 0
  })
  const assets = ref<Asset[]>([])
  function preloadAssets (_assets: Asset[]) {
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

    return new Promise<void>((resolve) => {
      function finishAsset (asset: Asset) {
        assetsProgress.value.loadedAssets++
        assetsProgress.value.progresses[asset.name] = 1

        if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
          assetsProgress.value.loaded = true
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

        const xhr = new XMLHttpRequest()

        xhr.open('GET', asset.url, true)
        xhr.responseType = 'blob'

        xhr.onprogress = function (event) {
          if (event.lengthComputable) {
            assetsProgress.value.progresses[asset.name] = event.loaded / event.total
          }
        }

        xhr.onload = async function () {
          if (xhr.status === 200) {
            const blob = xhr.response

            const objectURL = URL.createObjectURL(blob)

            const metadata = await new Promise((resolve, reject) => {
              const img = new Image()
              img.onload = () => resolve({ width: img.width, height: img.height })
              img.onerror = reject
              img.src = objectURL
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

        xhr.onerror = function () {
          console.error('%c[GameManager]', 'color: #4CAF50', 'Failed to load asset', asset.url)

          finishAsset(asset)
        }

        xhr.send()
      }
    })
  }

  function getAsset (name: string) {
    return assets.value.find(asset => asset.name === name)
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
      if (!vote.value.session.tiebreakerVotes) {
        return false
      }

      return Object.keys(vote.value.session.tiebreakerVotes)
        .find(option => vote.value.session!.tiebreakerVotes![option].includes(id)) ?? false
    }

    if (vote.value.session.isRandom) {
      return false
    }

    return Object.keys(vote.value.session.votes)
      .find(option => vote.value.session!.votes[option].includes(id)) ?? false
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

  ws.onAction('currentMedia', (data: string) => {
    console.log('Current media', data)
    currentMedia.value = data
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
    entries: Entry[]
  }>({
    entries: []
  })

  ws.onAction('suspectDatabase', (db: {
    entries: Entry[]
  }) => {
    database.value = db
  })

  function addDatabaseEntry (entry: Entry) {
    ws.send('suspectDatabaseEntry', { entry })
  }
  // #endregion

  // #region Clues
  const clues = ref<{
    available: string[]
    unlocked: string[]
    investigationCoins: number
  }>({
    available: [],
    unlocked: [],
    investigationCoins: 0
  })

  ws.onAction('clues', (data: {
    available: string[]
    unlocked: string[]
    investigationCoins: number
  }) => {
    clues.value = data
  })

  function unlockClue (clueId: string) {
    ws.send('unlockClue', { clueId })
  }
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

    timer: readonly(timer),
    timeSync: readonly(timeSync),
    phase: readonly(phase),

    triggerBoardSkip,

    currentMedia: readonly(currentMedia),
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
    addDatabaseEntry,

    clues,
    unlockClue
  }
})