import { Request, Response } from "express"
import { WebSocketClient } from "../clients/client"
import { Team } from "./team"
import { GenericClient } from "../clients/genericClient"
import { AdminClient } from "../clients/adminClient"
import { TeamClient } from "../clients/teamClient"
import { Role } from "../../shared/roles"
import { Database } from "../database"
import { Timer } from "../timer"
import { Phase } from "../../shared/phase"
import { JsonArray, JsonMap } from "../../shared/json"
import { CueManager } from "./cue/CueManager"
import { VoteManager } from "./vote/voteManager"
import { SuspectDatabaseManager } from "./suspectDatabase/suspectDatabaseManager"
import { ClueManager } from "./clueManager/clueManager"
import { Bg, colorize, Fg } from "../console"
import { FormManager } from "./formManager/formManager"

export const ENTRY_EARN_COINS = 4

export class Game {
  private adminPassword: string
  private boardPassword: string

  private constructor(
    optoins: {
      adminPassword: string
      boardPassword: string
    }
  ) {
    this.adminPassword = optoins.adminPassword
    this.boardPassword = optoins.boardPassword

    this.timer.onFinished(this.timerFinished.bind(this))
    this.timer.onStart(this.timerStarted.bind(this))
    this.timer.onUpdated(this.timerUpdated.bind(this))
    this.timer.onPause(this.timerPaused.bind(this))
    this.timer.onStopped(this.timerStopped.bind(this))
    this.timer.onTick(this.timerTick.bind(this))
  }

  load () {
    this.loadTeams()
    this.loadTimer()
    this.loadPhase()
    this.loadMedia()
    this.voteManager.load()
    this.cueManager.load()
    this.suspectDatabaseManager.load()
    this.clueManager.load()
    this.formManager.load()
  }

  // #region Teams
  private teams: Team[] = []

  async saveTeams() {
    await Database.get().saveCollection('teams', {
      teams: this.teams.map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code,
        active: t.active,
        meta: t.meta
      }))
    })
  }

  loadTeams() {
    const teams = (Database.get().getCollection('teams')?.teams as JsonArray)?.map?.((t) => ({
      id: (t as JsonMap)?.id as string | undefined,
      name: (t as JsonMap)?.name as string | undefined,
      code: (t as JsonMap)?.code as string | undefined,
      active: ((t as JsonMap)?.active ?? true) as boolean,
      meta: ((t as JsonMap)?.meta ?? {}) as JsonMap
    }))

    if (!teams) {
      return
    }

    this.teams = teams.map((t) => {
      if (!t.id || !t.name || !t.code) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Invalid team data', t)
        return null
      }

      return new Team(t.id, t.name, t.code, t.active, t.meta)
    }).filter((t) => t) as Team[]
  }

  addTeam(team: Team) {
    this.teams.push(team)
    this.saveTeams()
  }

  removeTeam(team: Team) {
    this.teams.splice(this.teams.indexOf(team), 1)
    this.saveTeams()
  }

  getTeam(id: string) {
    return this.teams.find((t) => t.id === id)
  }
  
  getTeamByCode(code: string) {
    return this.teams.find((t) => t.code === code)
  }

  getTeams(): Team[] {
    return this.teams
  }

  getTeamClient (teamId: string): TeamClient | null {
    return (this.clients.find((c) => c.type === Role.Team && (c as TeamClient).teamId === teamId) ?? null) as TeamClient | null
  }
  // #endregion

  // #region Clients
  private clients: WebSocketClient[] = []

  sendClientsToAdmins(client?: AdminClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending clients to admins')

    const clients = this.clients.map((c) => ({
      id: c.id,
      type: c.type,
      teamId: c.type === Role.Team ? (c as TeamClient).teamId : null,
      userAgent: c.userAgent
    }))
  
    if (client) {
      client.send('clients', clients)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('clients', clients))
  }

  addClient(client: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Adding client', client.id)

    if (this.clients.some((c) => c.id === client.id)) {
      console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Client already exists', client.id)
      return
    }

    this.clients.push(client)
    this.sendClientsToAdmins()
  }

  replaceClient(client: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Replacing client', client.id)

    this.clients = this.clients.map((c) => c.id === client.id ? client : c)
    this.sendClientsToAdmins()
  }

  removeClient(client: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Removing client', client.id)

    this.clients = this.clients.filter((c) => c.id !== client.id)
    this.sendClientsToAdmins()
  }

  getClient(id: string) {
    return this.clients.find((c) => c.id === id)
  }

  getClients() {
    return this.clients
  }

  promoteClientToAdmin(id: string) {
    const client = this.getClient(id)

    if (!client) {
      return
    }

    if (client.type !== Role.Unauthorized) {
      return
    }

    const adminClient = (client as GenericClient).promoteToAdmin()
    this.replaceClient(adminClient)
  }

  promoteClientToBoard(id: string) {
    const client = this.getClient(id)

    if (!client) {
      return
    }
    
    if (client.type !== Role.Unauthorized) {
      return
    }

    const boardClient = (client as GenericClient).promoteToBoard(this.boardPassword)
    this.replaceClient(boardClient)
  }

  promoteClientToTeam(id: string, teamId: string) {
    const client = this.getClient(id)

    if (!client) {
      return
    }

    if (client.type !== Role.Unauthorized) {
      return
    }

    const team = this.getTeam(teamId)

    if (!team) {
      return
    }

    const teamClient = (client as GenericClient).promoteToTeam(
      team.id,
      team.name,
      team.code,
      team.active,
      team.meta
    )
    this.replaceClient(teamClient)
  }

  sendReloadRequestToClient (client: WebSocketClient) {
    client.send('reload', null, true)
  }
  // #endregion

  // #region Help
  private needsHelp: string[] = []

  sendHelpRequestsToAdmins(client?: AdminClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending help requests to admins')

    const requests = this.needsHelp

    if (client) {
      client.send('helpRequests', requests)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('helpRequests', requests))
  }

  addHelpRequest(id: string) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Adding help request', id)

    if (this.needsHelp.includes(id)) {
      return false
    }

    this.needsHelp.push(id)
    this.sendHelpRequestsToAdmins()

    return true
  }

  removeHelpRequest(id: string) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Removing help request', id)

    this.needsHelp = this.needsHelp.filter((i) => i !== id)
    this.sendHelpRequestsToAdmins()
  }

  getHelpRequests() {
    return this.needsHelp
  }
  // #endregion

  // #region Login
  handleLogin (req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')

    const clientId = req.body.clientId
    const code = req.body.code

    const client = this.getClient(clientId)

    if (!client) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client not found', clientId)
      res.status(404).send('Client not found')
      return
    }

    if (client.type !== Role.Unauthorized) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client already logged in', clientId)
      res.status(409).send('Client already logged in')
      return
    }

    const team = this.getTeamByCode(code)

    if (!team) {
      res.status(403).send('Invalid code')
      return
    }

    if (this.clients.some(
      (c) => c.type === 'team'
      && (c as TeamClient).teamId === team.id)
    ) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Team already logged in', team.id)
      res.status(409).send('Team already logged in')
      return
    }

    this.promoteClientToTeam(clientId, team.id)
    res.status(200).send('OK')
  }

  handleAdminLogin (req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')

    const clientId = req.body.clientId
    const password = req.body.password
    const role = req.body.role

    const client = this.getClient(clientId)

    if (!client) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client not found', clientId)
      res.status(404).send('Client not found')
      return
    }

    if (client.type !== Role.Unauthorized) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client already logged in', clientId)
      res.status(409).send('Client already logged in')
      return
    }

    if (role !== Role.Admin && role !== Role.Board) {
      console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Invalid role', role)
      res.status(400).send('Invalid role')
      return
    }

    if (role === Role.Admin) {
      if (password !== this.adminPassword) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Invalid password', password)
        res.status(403).send('Invalid password')
        return
      }

      this.promoteClientToAdmin(clientId)
    } else if (role === Role.Board) {
      if (password !== this.boardPassword) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Invalid password', password)
        res.status(403).send('Invalid password')
        return
      }

      if (this.clients.some((c) => c.type === Role.Board)) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Board already logged in')
        res.status(409).send('Board already logged in')
        return
      }

      this.promoteClientToBoard(clientId)
    }

    res.status(200).send('OK')
  }
  // #endregion

  // #region Timer
  private timer: Timer = new Timer()

  getTimer() {
    return this.timer
  }

  sendTimerToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending timer to clients')

    const timer = {
      startTime: this.timer.getStartTime(),
      duration: this.timer.getDuration(),
      currentTime: this.timer.getElapsedTime(),
      state: this.timer.getState()
    }

    if (client) {
      client.send('timer', timer)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('timer', timer))
  }

  async saveTimer () {
    await Database.get().saveCollection('timer', {
      startTime: this.timer.getStartTime(),
      currentTime: this.timer.getElapsedTime(),
      duration: this.timer.getDuration(),
      state: this.timer.getState()
    })
  }

  loadTimer () {
    const timer = Database.get().getCollection('timer') as {
      startTime: number,
      currentTime: number,
      duration: number,
      state: 'stopped' | 'paused' | 'running'
    }

    if (!timer) {
      return
    }

    switch (timer.state) {
      case 'stopped':
        this.timer.stop()
        break
      case 'paused':
        this.timer.setDuration(timer.duration)
        this.timer.setTime(timer.currentTime)
        this.timer.pause()
        break
      case 'running':
        this.timer.setDuration(timer.duration)
        this.timer.setTime(timer.currentTime)
        this.timer.resume()
        break
      default:
        console.error('Invalid timer state', timer.state)
    }
  }

  pauseTimer() {
    this.timer.pause()
  }

  resumeTimer() {
    this.timer.resume()
  }

  setDuration(duration: number) {
    this.timer.setDuration(duration)
  }

  setTime(time: number) {
    this.timer.setTime(time)
  }

  timerFinished() {
    this.sendTimerToClients()
    this.saveTimer()
  }

  timerStarted() {
    this.sendTimerToClients()
    this.saveTimer()
  }

  timerPaused() {
    this.sendTimerToClients()
    this.saveTimer()
  }

  timerUpdated() {
    this.sendTimerToClients()
    this.saveTimer()
  }

  timerStopped() {
    this.sendTimerToClients()
    this.saveTimer()
  }

  timerTick() {
    this.saveTimer()
  }
  // #endregion

  // #region Phase
  currentPhase: Phase = Phase.Idle
  phaseMeta: JsonMap = {}

  sendPhaseToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending phase to clients')

    const phase = {
      type: this.currentPhase,
      meta: this.phaseMeta
    }

    if (client) {
      client.send('phase', phase)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('phase', phase))
  }

  async savePhase() {
    await Database.get().saveCollection('phase', {
      phase: this.currentPhase,
      meta: this.phaseMeta
    })
  }

  loadPhase() {
    const phase = Database.get().getCollection('phase') as {
      phase: Phase,
      meta: JsonMap
    }

    if (!phase) {
      return
    }

    this.currentPhase = phase.phase
    this.phaseMeta = phase.meta
  }

  setPhase(phase: Phase, meta?: JsonMap) {
    this.currentPhase = phase
    this.phaseMeta = meta ?? {}

    this.savePhase()
    this.sendPhaseToClients()
  }
  // #endregion

  // #region Playbacks & Cues
  cueManager: CueManager = new CueManager()

  sendPlaybacksToAdmins (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending playbacks to admins')

    const cues = this.cueManager.getPlaybacks()

    if (client) {
      if (client.type !== Role.Admin) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not an admin')
        return
      }

      client.send('playbacks', {
        playbacks: cues,
        manualTriggerOverride: this.cueManager.getManualTriggerOverride()
      })
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('playbacks', {
        playbacks: cues,
        manualTriggerOverride: this.cueManager.getManualTriggerOverride(),
      }))
  }

  sendCurrentPlaybackToAdmins (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending current playback to admins')

    const playback = this.cueManager.getCurrentPlayback()

    if (client) {
      if (client.type !== Role.Admin) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not an admin')
        return
      }

      client.send('currentPlayback', playback)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('currentPlayback', playback))
  }
  // #endregion

  // #region Vote
  voteManager: VoteManager = new VoteManager()

  sendVotePoolsToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending vote pools to clients')

    const pools = this.voteManager.getPools()
    if (client) {
      client.send('votePools', pools)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('votePools', pools))
  }

  sendVoteSessionToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending vote session to clients')

    const session = this.voteManager.getActiveSession()

    if (client) {
      client.send('voteSession', session)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('voteSession', session))
  }

  sendVoteOptionsToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending vote options to clients')

    const options = this.voteManager.getVoteOptions()

    if (client) {
      client.send('voteOptions', options)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('voteOptions', options))
  }
  // #endregion

  // #region Board Skip
  boardSkipListeners: (() => void)[] = []
  boardSkip () {
    this.boardSkipListeners.forEach((l) => l())
  }

  onBoardSkip (listener: () => void) {
    this.boardSkipListeners.push(listener)

    return () => {
      this.offBoardSkip(listener)
    }
  }
  offBoardSkip (listener: () => void) {
    this.boardSkipListeners = this.boardSkipListeners.filter((l) => l !== listener)
  }
  onceBoardSkip (listener: () => void) {
    const off = this.onBoardSkip(() => {
      off()
      listener()
    })
    return off
  }
  // #endregion

  // #region Media
  private currentMedia: string | null = null
  private watchedMedia: Set<string> = new Set()
  private progress = 0

  saveMedia () {
    Database.get().saveCollection('media', {
      currentMedia: this.currentMedia,
      watchedMedia: Array.from(this.watchedMedia),
      progress: this.progress,
      lastMediaTime: this.lastMediaTime
    })
  }

  loadMedia () {
    const media = Database.get().getCollection('media') as {
      currentMedia: string
      watchedMedia: string[]
      progress: number
      lastMediaTime: number
    }

    if (!media) {
      return
    }

    this.currentMedia = media.currentMedia
    this.watchedMedia = new Set(media.watchedMedia)
    this.progress = media.progress ?? 0
    this.lastMediaTime = media.lastMediaTime ?? 0
  }

  sendMediaToClients (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending media to clients')

    if (client) {
      client.send('media', {
        currentMedia: this.currentMedia,
        watchedMedia: Array.from(this.watchedMedia)
      })
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('media', {
        currentMedia: this.currentMedia,
        watchedMedia: Array.from(this.watchedMedia)
      }))
  }

  getMedia () {
    return this.currentMedia
  }

  getProgress () {
    return this.progress
  }

  getWatchedMedia () {
    return Array.from(this.watchedMedia)
  }

  setMedia (media: string | null) {
    console.log(colorize('[Media]', Fg.Cyan), 'Setting media', media)

    this.currentMedia = media
    this.progress = 0
    this.lastMediaTime = 0
    
    if (media) {
      this.watchedMedia.add(media)
    }

    this.saveMedia()
    this.sendMediaToClients()
  }

  mediaFinishedListeners: (() => void)[] = []
  onMediaFinished (listener: () => void) {
    this.mediaFinishedListeners.push(listener)
  
    return () => {
      this.offMediaFinished(listener)
    }
  }
  mediaFinished () {
    console.log(colorize('[Media]', Fg.Cyan), 'Media finished')
    this.setMedia(null)
    this.mediaFinishedListeners.forEach((l) => l())
    this.progress = 0
    this.lastMediaTime = 0

    this.saveMedia()
  }
  offMediaFinished (listener: () => void) {
    this.mediaFinishedListeners = this.mediaFinishedListeners.filter((l) => l !== listener)
  }

  onMediaTimeListeners: { time: number /* in milliseconds */, listener: () => void }[] = []
  onMediaTime (time: number, listener: () => void) {
    this.onMediaTimeListeners.push({ time, listener })

    return () => {
      this.offMediaTime(time, listener)
    }
  }

  lastMediaTime = 0
  mediaTime (time: number /* in seconds */) {
    const start = this.lastMediaTime
    const end = Math.floor(time * 1000) // to milliseconds

    // Find listeners between start and end
    const listeners = this.onMediaTimeListeners.filter((l) => l.time > start && l.time <= end)

    listeners.forEach((l) => l.listener())

    this.progress = time
    this.sendMediaProgressToAdmins();
    this.lastMediaTime = end

    this.saveMedia()
  }
  offMediaTime (time: number, listener: () => void) {
    this.onMediaTimeListeners = this.onMediaTimeListeners.filter((l) => l.time !== time && l.listener !== listener)
  }

  playMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to play media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to play media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'play'
    })
  }

  pauseMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to pause media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to pause media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'pause'
    })
  }

  seekMedia (progress: number) {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to seek media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to seek media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'seek',
      progress
    }, true)
  }

  requestMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to request media duration. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.error(colorize('[Media]', Fg.Cyan), 'Failed to request media duration. No media set')
      return
    }

    board.send('getMedia', this.currentMedia)
  }

  removeWatchedMedia (media: string) {
    this.watchedMedia.delete(media)
    this.saveMedia()
    this.sendMediaToClients()
  }

  addWatchedMedia (media: string) {
    this.watchedMedia.add(media)
    this.saveMedia()
    this.sendMediaToClients()
  }

  sendMediaDurationToAdmins (duration: number) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending media duration to admins')

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaDuration', duration))
  }

  sendMediaStateToAdmins (state: 'playing' | 'paused') {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending media state to admins')

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaState', state))
  }

  sendMediaProgressToAdmins () {
    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaProgress', this.progress, true))
  }
  // #endregion

  // #region Suspect Database
  suspectDatabaseManager: SuspectDatabaseManager = new SuspectDatabaseManager()

  sendSuspectDatabasesToAdmins (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending suspect database to admins')

    const database = this.suspectDatabaseManager.getDatabases()

    if (client) {
      if (client.type !== Role.Admin) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not an admin')
        return
      }

      client.send('suspectDatabases', database)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('suspectDatabases', database))
  }

  sendSuspectDatabaseToTeams (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending suspect database to teams')

    if (client) {
      if (client.type !== Role.Team) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not a team')
        return
      }

      client.send('suspectDatabase', this.suspectDatabaseManager.getDatabase((client as TeamClient).teamId))
      return
    }

    this.clients
      .filter((c) => c.type === Role.Team)
      .forEach((c) => (c as TeamClient).send('suspectDatabase', this.suspectDatabaseManager.getDatabase((c as TeamClient).teamId)))
  }

  sendShownSuspectsToClients (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending shown suspects to clients')

    const shownSuspects = this.suspectDatabaseManager.getShownSuspects()

    if (client) {
      client.send('shownSuspects', shownSuspects)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('shownSuspects', shownSuspects))
  }
  // #endregion

  // #region Clues
  clueManager: ClueManager = new ClueManager()

  sendCluesToClients(client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending clues to clients')

    const getCluesObj = (client: WebSocketClient) => {
      if (client.type === Role.Team) {
        return {
          mainClueType: this.clueManager.getMainClueType((client as TeamClient).teamId),
          mainClueUnlocked: this.clueManager.getMainClueUnlocked((client as TeamClient).teamId),
          available: this.clueManager.getAvailableClues(),
          new: this.clueManager.getNewAvailableClues(),
          unlocked: this.clueManager.getUnlockedClues((client as TeamClient).teamId),
          investigationCoins: this.clueManager.getInvestigationCoins((client as TeamClient).teamId),
        }
      } else {
        // Admin or Board
        return {
          available: this.clueManager.getAvailableClues(),
          new: this.clueManager.getNewAvailableClues(),
        }
      }
    }

    if (client) {
      client.send('clues', getCluesObj(client))
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('clues', getCluesObj(c)))
  }

  sendCluesToAdmins (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending clues to admins')

    const clues = {
      unlocked: this.clueManager.getUnlockedClues(),
      investigationCoins: {
        total: this.clueManager.getGivenInvestigationCoins(),
        usedByTeam: this.clueManager.getInvestigationCoinDelta(),
      },
      mainClueType: this.clueManager.getMainClueType(),
      mainClueUnlocked: this.clueManager.getMainClueUnlocked(),
      assignFurtherMainClueTypesRandomly: this.clueManager.getAssignFurtherMainClueTypesRandomly(),
    }

    if (client) {
      if (client.type !== Role.Admin) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not an admin')
        return
      }

      client.send('adminClues', clues)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('adminClues', clues))
  }
  // #endregion

  // #region Form
  formManager: FormManager = new FormManager()

  sendFormToTeamClient (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending form to team client')

    if (client) {
      if (client.type !== Role.Team) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not a team')
        return
      }

      client.send('form', {
        fields: this.formManager.getForm((client as TeamClient).teamId),
        submitted: this.formManager.isFormSubmitted((client as TeamClient).teamId)
      })
      return
    }

    this.clients
      .filter((c) => c.type === Role.Team)
      .forEach((c) => (c as TeamClient).send('form', {
        fields: this.formManager.getForm((c as TeamClient).teamId),
        submitted: this.formManager.isFormSubmitted((c as TeamClient).teamId)
      }))
  }

  sendFormPageToTeamClient (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending form page to team client')

    if (client) {
      if (client.type !== Role.Team) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not a team')
        return
      }

      client.send('formPage', this.formManager.getFormPage((client as TeamClient).teamId))
      return
    }

    this.clients
      .filter((c) => c.type === Role.Team)
      .forEach((c) => (c as TeamClient).send('formPage', this.formManager.getFormPage((c as TeamClient).teamId)))
  }

  sendResultsToBoard (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending results to board')

    const results = this.formManager.getResults()

    if (client) {
      if (client.type !== Role.Board) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not a board')
        return
      }

      client.send('results', results)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Board)
      .forEach((c) => (c as AdminClient).send('results', results))
  }

  sendFormsToAdmins (client?: WebSocketClient) {
    console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Sending forms to admins')

    const forms = {
      // forms: this.formManager.getForms(),
      pages: this.formManager.getFormPages(),
      results: this.formManager.getResults(),
      submitted: this.formManager.getSubmittedForms()
    }

    if (client) {
      if (client.type !== Role.Admin) {
        console.warn(colorize('[Game]', Fg.White, Bg.Blue), 'Client is not an admin')
        return
      }

      client.send('forms', forms)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('forms', forms))
  }
  // #endregion

  // #region Singleton
  private static instance: Game
  public static get() {
    if (!Game.instance) {
      Game.instance = new Game({
        adminPassword: process.env.ADMIN_PASSWORD || 'admin',
        boardPassword: process.env.BOARD_PASSWORD || 'board'
      })

      Game.instance.load()

      console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Game created')
      console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Admin password:', Game.instance.adminPassword)
      console.log(colorize('[Game]', Fg.White, Bg.Blue), 'Board password:', Game.instance.boardPassword)
    }
    return Game.instance
  }
  // #endregion
}