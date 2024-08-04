
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWsClient } from "../wsClient";
import { Role } from "../../../shared/roles";
import { idGen } from "../../../shared/random";
import { Playback } from "../../../shared/playback/Playback";
import { Asset } from "../../../shared/asset";
import { VoteOption } from "../../../shared/vote";
import { useGameManager } from "../gameManager";
import { JsonMap } from "../../../shared/json";
import { Entry } from "../../../shared/suspectDatabase/entry";

export interface AlertOptions {
  id: string
  icon: string | null
  title: string | null
  message: string | null
  closable: boolean
  closeAfter?: number
  close?: () => void
  type: 'info' | 'warning' | 'error' | 'success' | 'default'
}

export const useAdmin = defineStore('admin', () => {
  const ws = useWsClient()

  let actions: (() => void)[] = []
  async function initAdmin () {
    console.log('Initializing Admin')

    actions = [
      ws.onAction('teams', (t) => {
        teams.value = t
      }),
      ws.onAction('clients', (c) => {
        console.log('Clients', c)
        clients.value = c
      }),
      ws.onAction('helpRequests', (n: string[]) => {
        const newAlerts = n.filter((id) => !needsHelp.value.includes(id))
        const removedAlerts = needsHelp.value.filter((id) => !n.includes(id))

        needsHelp.value = n
        
        newAlerts.forEach(teamId => {
          const team = teams.value.find(team => team.id === teamId)

          if (!team) return
          alert(
            {
              title: `"${team.name}" fordert Hilfe an`,
              id: `help:${teamId}`,
              closable: true,
              type: 'warning'
            }
          )
        })

        removedAlerts.forEach((teamId) => {
          closeAlert(`help:${teamId}`)
        })
      }),
      ws.onAction('playbacks', ({
        playbacks: pbs,
        manualTriggerOverride: mto
      }) => {
        playbacks.value = pbs
        manualTriggerOverride.value = mto
      }),
      ws.onAction('currentPlayback', (payload: {
        playback: number,
        cue: number
      }) => {
        currentPlaybackIndex.value = payload.playback
        currentCueIndex.value = payload.cue

        indexUpdateQueue.value.push({
          playback: payload.playback,
          cue: payload.cue
        })
        if (updatingIndex) return
        updatePlaybackIndex()
      }),
      ws.onAction('mediaProgress', (progress) => {
        media.value.progress = progress
      }),
      ws.onAction('mediaDuration', (duration) => {
        media.value.duration = duration
      }),
      ws.onAction('mediaState', (state) => {
        media.value.state = state
      }),
      ws.onAction('suspectDatabases', (dbs) => {
        suspectDatabases.value = dbs
      })
    ]

    ws.send('getTeams')
    ws.send('getClients')
    ws.send('getHelpRequests')
    ws.send('getPlaybacks')
    ws.send('getCurrentPlayback')
    ws.send('getMediaState')
    ws.send('getSuspectDatabases')

    await getAssets()
    console.log('Assets loaded')

    await useGameManager().initGameManager()
  }

  function deinitAdmin () {
    console.log('Deinitializing Admin')

    actions.forEach((a) => a())

    useGameManager().deinitGameManager()
  }

  // #region Assets
  const assets = ref<{
    team: Asset[],
    shared: Asset[]
    board: Asset[]
  }>({
    team: [],
    shared: [],
    board: []
  })

  async function getAssets () {
    const res = await fetch('/api/assets/all')
      .catch((err) => {
        console.error('Failed to fetch assets', err)
        return null
      })

    if (!res) return

    const data = await res.json()
    assets.value.team = data.team
    assets.value.shared = data.shared
    assets.value.board = data.board
  }
  // #endregion

  // #region Team management
  const teams = ref<{
    id: string
    name: string
    code: string
  }[]>([])

  async function addTeam (team: {
    name: string
    code: string
  }) {
    const res = await ws.request('addTeam', team)

    if (!res.success) {
      console.error('Failed to add team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function editTeam (team: {
    id: string
    name: string
    code: string
  }) {
    const res = await ws.request('editTeam', team)

    if (!res.success) {
      console.error('Failed to edit team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function removeTeam (id: string) {
    const res = await ws.request('removeTeam', { id })

    if (!res.success) {
      console.error('Failed to remove team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }
  // #endregion

  // #region Client management
  const clients = ref<{
    id: string
    type: Role
    teamId: string | null
    userAgent: string
  }[]>([])

  async function kickClient (id: string) {
    const res = await ws.request('kickClient', { id })

    if (!res.success) {
      console.error('Failed to kick client', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function logoutClient (id: string) {
    const res = await ws.request('logoutClient', { id })

    if (!res.success) {
      console.error('Failed to logout client', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  function setClientTeam (clientId: string, teamId: string) {
    ws.send('setClientTeam', { clientId, teamId })
  }

  function setClientBoard (clientId: string) {
    ws.send('setClientBoard', { clientId })
  }
  // #endregion

  // #region Help
  const needsHelp = ref<string[]>([])

  function removeHelpRequest (teamId: string) {
    ws.send('removeHelpRequest', { teamId })
  }
  // #endregion

  // #region Alerts
  const alerts = ref<AlertOptions[]>([])
  
  function alert (options: Partial<AlertOptions> = {}) {
    const opt: AlertOptions = {
      id: options.id ?? idGen(),
      title: options.title ?? null,
      message: options.message ?? null,
      icon: options.icon ?? null,
      closable: options.closable ?? true,
      closeAfter: options.closeAfter ?? 5000,
      close: options.close,
      type: options.type ?? 'default'
    }

    alerts.value.push(opt)

    opt.closeAfter && setTimeout(() => {
      closeAlert(opt.id)
    }, opt.closeAfter + 500)
  }

  function closeAlert (id: string) {
    alerts.value = alerts.value.filter((a) => a.id !== id)
  }
  // #endregion

  // #region Timer
  function pauseTimer () {
    ws.send('pauseTimer')
  }

  function resumeTimer () {
    ws.send('resumeTimer')
  }

  function setDuration (duration: number) {
    ws.send('setDuration', { duration })
  }

  function setTime (time: number) {
    ws.send('setTime', { time })
  }
  // #endregion

  // #region Vote
  async function addVoteOption (option: VoteOption) {
    const res = await ws.request('addVoteOption', { option })

    if (!res.success) {
      console.error('Failed to add vote option', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function editVoteOption (option: VoteOption) {
    const res = await ws.request('editVoteOption', { option })

    if (!res.success) {
      console.error('Failed to edit vote option', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function removeVoteOption (id: string) {
    const res = await ws.request('removeVoteOption', { id })

    if (!res.success) {
      console.error('Failed to remove vote option', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function addPool (pool: string) {
    const res = await ws.request('addPool', { pool })

    if (!res.success) {
      console.error('Failed to add pool', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function removePool (pool: string) {
    const res = await ws.request('removePool', { pool })

    if (!res.success) {
      console.error('Failed to remove pool', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function addOptionToPool (pool: string, option: string) {
    const res = await ws.request('addOptionToPool', { pool, option })

    if (!res.success) {
      console.error('Failed to add option to pool', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function removeOptionFromPool (pool: string, option: string) {
    const res = await ws.request('removeOptionFromPool', { pool, option })

    if (!res.success) {
      console.error('Failed to remove option from pool', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }
  // #endregion

  // #region Playbacks & Cues
  const playbacks = ref<Playback[]>([])
  const currentPlaybackIndex = ref<number>(-1)
  const currentCueIndex = ref<number>(-1)

  const manualTriggerOverride = ref<boolean>(false)

  const indexUpdateQueue = ref<{
    playback: number
    cue: number
  }[]>([])

  const delayedCurrentPlaybackIndex = ref<number>(-1)
  const delayedCurrentCueIndex = ref<number>(-1)
  let updatingIndex = false
  function updatePlaybackIndex () {
    updatingIndex = true
    const next = indexUpdateQueue.value.shift()

    if (!next) {
      updatingIndex = false
      return
    }

    console.log('Updating index', next)

    delayedCurrentPlaybackIndex.value = next.playback
    delayedCurrentCueIndex.value = next.cue

    requestAnimationFrame(updatePlaybackIndex)
  }

  function nextPlayback () {
    ws.send('nextPlayback')
  }

  function nextCue (index?: number) {
    ws.send('nextCue', { index })
  }

  function setCurrentPlayback (index: number) {
    ws.send('setCurrentPlayback', { index })
  }

  function setPlaybackFields (index: number, fields: JsonMap) {
    ws.send('setPlaybackFields', { index, fields })
  }

  function setPlaybackTrigger (index: number, trigger: 'auto' | 'manual') {
    ws.send('setPlaybackTrigger', { index, trigger })
  }

  function setManualTriggerOverride (value: boolean) {
    ws.send('setManualTriggerOverride', { value })
  }
  // #endregion

  // #region Media
  const media = ref<{
    progress: number
    duration: number
    state: 'playing' | 'paused'
  }>({
    progress: 0,
    duration: 0,
    state: 'paused'
  })
  
  function playMedia () {
    ws.send('playMedia')
  }

  function pauseMedia () {
    ws.send('pauseMedia')
  }

  function seekMedia (time: number) {
    ws.send('seekMedia', { time })
  }

  function setMedia (media: string) {
    ws.send('setMedia', { media })
  }

  function skipMedia () {
    ws.send('skipMedia')
  }
  // #endregion

  // #region Suspect Databases
  const suspectDatabases = ref<Record<string, {
    entries: Entry[]
  }>>({})

  function removeEntry (teamId: string, matterId: string) {
    ws.send('removeEntry', { teamId, matterId })
  }

  function addEntry (teamId: string, entry: Entry) {
    ws.send('addEntry', { teamId, entry })
  }
  // #endregion

  return {
    initAdmin,
    deinitAdmin,

    assets,

    addTeam,
    editTeam,
    removeTeam,
    kickClient,
    logoutClient,
    setClientTeam,
    setClientBoard,
    removeHelpRequest,
    needsHelp,
    teams,
    clients,
    alerts,
    alert,
    closeAlert,
    pauseTimer,
    resumeTimer,
    setDuration,
    setTime,

    addVoteOption,
    editVoteOption,
    removeVoteOption,
    addPool,
    removePool,
    addOptionToPool,
    removeOptionFromPool,

    playbacks,
    currentPlaybackIndex,
    currentCueIndex,
    manualTriggerOverride,
    delayedCurrentPlaybackIndex,
    delayedCurrentCueIndex,
    nextPlayback,
    nextCue,
    setCurrentPlayback,
    setPlaybackFields,
    setPlaybackTrigger,
    setManualTriggerOverride,

    media,
    playMedia,
    pauseMedia,
    seekMedia,
    setMedia,
    skipMedia,

    suspectDatabases,
    removeEntry,
    addEntry
  }
})