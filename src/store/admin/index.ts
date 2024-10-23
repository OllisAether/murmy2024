
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
import { Phase } from "../../../shared/phase";
import { FormFieldValue } from "../../../shared/form";
import { Result } from "../../../shared/results";

export interface AlertOptions {
  id: string
  icon: string | null
  title: string | null
  message: string | null
  closable: boolean
  closeAfter?: number
  close?: () => void
  type: 'info' | 'warning' | 'error' | 'success' | 'default',
  actions: {
    label: string
    action: () => void
  }[]
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
              closeAfter: 0,
              type: 'warning',
              actions: [
                {
                  label: 'Anfrage entfernen',
                  action: () => {
                    removeHelpRequest(teamId)
                  }
                }
              ]
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
      }),
      ws.onAction('adminClues', (cluesData) => {
        clues.value = cluesData
      }),
      ws.onAction('forms', (data) => {
        forms.value = data
      }),
    ]

    ws.send('getTeams')
    ws.send('getClients')
    ws.send('getHelpRequests')
    ws.send('getPlaybacks')
    ws.send('getCurrentPlayback')
    ws.send('getMediaState')
    ws.send('getSuspectDatabases')
    ws.send('getAdminClues')
    ws.send('getForms')

    await getAssets()
    console.log('Assets loaded')

    await useGameManager().initGameManager()
  }

  function deinitAdmin () {
    console.log('Deinitializing Admin')
    useGameManager().deinitGameManager()

    actions.forEach((a) => a())
    actions = []

    assets.value = {
      team: [],
      shared: [],
      board: []
    }

    teams.value = []

    clients.value = []

    needsHelp.value = []

    playbacks.value = []

    currentPlaybackIndex.value = -1

    media.value = {
      progress: 0,
      duration: 0,
      state: 'paused'
    }

    suspectDatabases.value = {}

    clues.value = {
      unlocked: {},
      investigationCoins: {
        total: 0,
        usedByTeam: {}
      },
      mainClueType: {},
      mainClueUnlocked: {},
      assignFurtherMainClueTypesRandomly: false
    }

    alerts.value = []
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
    active: boolean
    meta: JsonMap
  }[]>([])

  async function addTeam (team: {
    name: string
    code: string
    active: boolean
    meta: JsonMap
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
    active: boolean
    meta: JsonMap
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

  async function reloadClient (id: string) {
    const res = await ws.request('reloadClient', { id })

    if (!res.success) {
      console.error('Failed to reload client', res.message)
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

  // #region Phase
  function setPhase (phase: Phase, meta: JsonMap = {}) {
    ws.send('setPhase', { phase, meta })
  }
  // #endregion

  // #region Alerts
  const alerts = ref<AlertOptions[]>([])
  
  function alert (options: Partial<AlertOptions> = {}) {
    console.log('%c[Alert]', 'color: #ff00ff', options)

    const opt: AlertOptions = {
      id: options.id ?? idGen(),
      title: options.title ?? null,
      message: options.message ?? null,
      icon: options.icon ?? null,
      closable: options.closable ?? true,
      closeAfter: options.closeAfter ?? 5000,
      close: options.close,
      type: options.type ?? 'default',
      actions: options.actions ?? []
    }

    alerts.value.push(opt)

    if (window.navigator.vibrate) {
      window.navigator.vibrate([400, 100, 400])
    }

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
  const playbacks = ref<(Playback | {
    divider: string
  })[]>([])
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

  function addWatchedMedia (media: string) {
    ws.send('addWatchedMedia', { media })
  }

  function removeWatchedMedia (media: string) {
    ws.send('removeWatchedMedia', { media })
  }
  // #endregion

  // #region Suspect Databases
  const suspectDatabases = ref<{
    [teamId: string]: {
      entries: string[]
    }
  }>({})

  function removeEntry (teamId: string, id: string) {
    ws.send('removeEntry', { teamId, id })
  }

  function addEntry (teamId: string, entryId: string) {
    ws.send('addEntry', { teamId, entryId })
  }

  function removeShownSuspect (suspectId: string) {
    ws.send('removeShownSuspect', { suspectId })
  }

  function addShownSuspect (suspectId: string) {
    ws.send('addShownSuspect', { suspectId })
  }
  // #endregion

  // #region Clues
  const clues = ref<{
    unlocked: Record<string, string[]>
    investigationCoins: {
      total: number
      usedByTeam: Record<string, number>
    },
    mainClueType: Record<string, 'phone' | 'diary'>,
    mainClueUnlocked: Record<string, boolean>,
    assignFurtherMainClueTypesRandomly: boolean
  }>({
    unlocked: {},
    investigationCoins: {
      total: 0,
      usedByTeam: {}
    },
    mainClueType: {},
    mainClueUnlocked: {},
    assignFurtherMainClueTypesRandomly: false
  })

  function setGivenInvestigationCoins(amount: number) {
    ws.send('setGivenInvestigationCoins', { amount })
  }

  function setInvestigationCoinDelta(teamId: string, delta: number) {
    ws.send('setInvestigationCoinDelta', { teamId, delta })
  }

  function addClue (clueId: string) {
    ws.send('addClue', { clueId })
  }

  function removeClue (clueId: string) {
    ws.send('removeClue', { clueId })
  }

  function unlockClue (teamId: string, clueId: string) {
    ws.send('unlockClue', { teamId, clueId })
  }

  function lockClue (teamId: string, clueId: string) {
    ws.send('lockClue', { teamId, clueId })
  }

  function setAssignFurtherMainClueTypesRandomly (value: boolean) {
    ws.send('setAssignFurtherMainClueTypesRandomly', { value })
  }

  function setMainClueType (teamId: string, type: 'phone' | 'diary' | null) {
    ws.send('setMainClueType', { teamId, type })
  }

  function setMainClueUnlocked (teamId: string, unlocked: boolean) {
    ws.send('setMainClueUnlocked', { teamId, unlocked })
  }

  function assignRandomMainClueType (teamId: string) {
    ws.send('assignRandomMainClueType', { teamId })
  }

  function assignRandomMainClueTypeForAllTeams () {
    ws.send('assignRandomMainClueType')
  }
  // #endregion

  // #region Forms
  const forms = ref<{
    forms: Record<string, Record<string, FormFieldValue>>
    results: Result[]
  }>({
    forms: {},
    results: []
  })

  function clearForms () {
    ws.send('clearForms')
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
    reloadClient,
    setClientTeam,
    setClientBoard,
    removeHelpRequest,
    needsHelp,

    setPhase,

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
    addWatchedMedia,
    removeWatchedMedia,

    suspectDatabases,
    removeEntry,
    addEntry,
    removeShownSuspect,
    addShownSuspect,

    clues,
    setGivenInvestigationCoins,
    setInvestigationCoinDelta,
    addClue,
    removeClue,
    unlockClue,
    lockClue,
    setAssignFurtherMainClueTypesRandomly,
    setMainClueType,
    setMainClueUnlocked,
    assignRandomMainClueType,
    assignRandomMainClueTypeForAllTeams,

    forms,
    clearForms
  }
})