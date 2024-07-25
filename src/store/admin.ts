
import { defineStore } from "pinia";
import { nextTick, ref, watch } from "vue";
import { useWsClient } from "./wsClient";
import { Role } from "../../shared/roles";
import { idGen } from "../../shared/random";
import { Playback } from "../../shared/playback/Playback";

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
  function initAdmin () {
    console.log('Admin initialized')

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
      ws.onAction('playbacks', (pbs) => {
        playbacks.value = pbs
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
      })
    ]

    ws.send('getTeams')
    ws.send('getClients')
    ws.send('getHelpRequests')
    ws.send('getPlaybacks')
    ws.send('getCurrentPlayback')
    ws.send('getMediaState')
  }

  function deinitAdmin () {
    console.log('Admin deinitialized')

    actions.forEach((a) => a())
  }

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

  // #region Playbacks & Cues
  const playbacks = ref<Playback[]>([])
  const currentPlaybackIndex = ref<number>(-1)
  const currentCueIndex = ref<number>(-1)

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
  // #endregion

  return {
    initAdmin,
    deinitAdmin,
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

    playbacks,
    currentPlaybackIndex,
    currentCueIndex,
    delayedCurrentPlaybackIndex,
    delayedCurrentCueIndex,
    nextPlayback,
    nextCue,
    setCurrentPlayback,

    media,
    playMedia,
    pauseMedia,
    seekMedia
  }
})