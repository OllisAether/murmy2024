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
    // this.loadCues()
    this.loadVote()
    this.loadMedia()
  }

  // #region Teams
  private teams: Team[] = []

  async saveTeams() {
    await Database.get().saveCollection('teams', {
      teams: this.teams.map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code
      }))
    })
  }

  loadTeams() {
    const teams = (Database.get().getCollection('teams')?.teams as JsonArray)?.map?.((t) => ({
      id: (t as JsonMap)?.id as string,
      name: (t as JsonMap)?.name as string,
      code: (t as JsonMap)?.code as string,
      meta: (t as JsonMap)?.meta as JsonMap
    }))

    if (!teams) {
      return
    }

    this.teams = teams.map((t) => new Team(t.id, t.name, t.code, t.meta))
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
  // #endregion

  // #region Clients
  private clients: WebSocketClient[] = []

  sendClientsToAdmins(client?: AdminClient) {
    console.log('[Clients] Sending clients to admins')

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
    console.log('[Clients] Adding client', client.id)

    if (this.clients.some((c) => c.id === client.id)) {
      console.log('[Clients] Client already exists', client.id)
      return
    }

    this.clients.push(client)
    this.sendClientsToAdmins()
  }

  replaceClient(client: WebSocketClient) {
    console.log('[Clients] Replacing client', client.id)

    this.clients = this.clients.map((c) => c.id === client.id ? client : c)
    this.sendClientsToAdmins()
  }

  removeClient(client: WebSocketClient) {
    console.log('[Clients] Removing client', client.id)

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
      team.code
    )
    this.replaceClient(teamClient)
  }
  // #endregion

  // #region Help
  private needsHelp: string[] = []

  sendHelpRequestsToAdmins(client?: AdminClient) {
    console.log('Sending help requests to admins')

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
    console.log('Adding help request', id)

    if (this.needsHelp.includes(id)) {
      return false
    }

    this.needsHelp.push(id)
    this.sendHelpRequestsToAdmins()

    return true
  }

  removeHelpRequest(id: string) {
    console.log('Removing help request', id)

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
      console.log('Client not found', clientId)
      res.status(404).send('Client not found')
      return
    }

    if (client.type !== Role.Unauthorized) {
      console.log('Client already logged in', clientId)
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
      console.log('Team already logged in', team.id)
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
      console.log('Client not found', clientId)
      res.status(404).send('Client not found')
      return
    }

    if (client.type !== Role.Unauthorized) {
      console.log('Client already logged in', clientId)
      res.status(409).send('Client already logged in')
      return
    }

    if (role !== Role.Admin && role !== Role.Board) {
      console.log('Invalid role', role)
      res.status(400).send('Invalid role')
      return
    }

    if (role === Role.Admin) {
      if (password !== this.adminPassword) {
        console.log('Invalid password', password)
        res.status(403).send('Invalid password')
        return
      }

      this.promoteClientToAdmin(clientId)
    } else if (role === Role.Board) {
      if (password !== this.boardPassword) {
        console.log('Invalid password', password)
        res.status(403).send('Invalid password')
        return
      }

      if (this.clients.some((c) => c.type === Role.Board)) {
        console.log('Board already logged in')
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
    console.log('Sending timer to clients')

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

    console.log('Loading timer', timer)

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
    console.log('Sending phase to clients')

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

    // switch (phase) {
    //   case Phase.Vote:
    //     if (!options?.vote) {
    //       console.log('[Cue] No vote options provided')
    //       return
    //     }

    //     this.startVote(options.vote)
    //     break
    //   case Phase.Media:
    //     if (!options?.media) {
    //       console.log('[Cue] No media provided')
    //       return
    //     }

    //     this.setMedia(options.media)
    //     break
    // }

    this.savePhase()
    this.sendPhaseToClients()
  }
  // #endregion

  // #region Playbacks & Cues
  cueManager: CueManager = new CueManager()

  sendPlaybacksToAdmins (client?: WebSocketClient) {
    console.log('Sending playbacks to admins')

    const cues = this.cueManager.getPlaybacks()

    if (client) {
      if (client.type !== Role.Admin) {
        console.log('Client is not an admin')
        return
      }

      client.send('playbacks', cues)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => (c as AdminClient).send('cues', cues))
  }

  sendCurrentPlaybackToAdmins (client?: WebSocketClient) {
    console.log('Sending current playback to admins')

    const playback = this.cueManager.getCurrentPlayback()

    if (client) {
      if (client.type !== Role.Admin) {
        console.log('Client is not an admin')
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
  private vote: {
    optionsPool: VoteOptions,
    voteOptions: VoteOptions
    votes: string[][],
    winners: string[],
    lastWinners: string[],
    collecting: boolean
  } = {
    optionsPool: [],
    voteOptions: [],
    votes: [],
    winners: [],
    lastWinners: [],
    collecting: false
  }

  sendVoteToClients (client?: WebSocketClient) {
    console.log('Sending vote to clients')

    const vote = {
      voteOptions: this.vote.voteOptions.map((v) => v.media),
      votes: this.vote.votes.map((v) => v.length),
      winners: this.vote.winners
    }

    if (client) {
      client.send('vote', vote)
      return
    }

    this.clients
      .filter((c) => c.type !== Role.Unauthorized)
      .forEach((c) => c.send('vote', vote))
  }

  saveVote () {
    Database.get().saveCollection('vote', {
      vote: this.vote
    })
  }

  loadVote () {
    const vote = Database.get().getCollection('vote') as Partial<{
      vote: {
        optionsPool: VoteOptions,
        voteOptions: VoteOptions,
        votes: string[][],
        winners: string[],
        lastWinners: string[],
        collecting: boolean
      }
    }>

    if (!vote) {
      return
    }

    this.vote = {
      optionsPool: vote.vote?.optionsPool ?? [],
      voteOptions: vote.vote?.voteOptions ?? [],
      votes: vote.vote?.votes ?? [],
      winners: vote.vote?.winners ?? [],
      lastWinners: vote.vote?.lastWinners ?? [],
      collecting: vote.vote?.collecting ?? false
    }

    if (this.vote.voteOptions.length !== this.vote.votes.length) {
      console.log('[Vote] Fixing votes length')
      this.vote.votes = Array(this.vote.voteOptions.length).fill([]).map((v, i) => this.vote.votes[i] ?? v)
    }
  }

  startVote (voteOptions: VoteOptions, fromPool = false, preserveWinners = false) {
    console.log('[Vote] Starting vote')

    const pool = [
      ...(this.vote?.voteOptions ?? []),
      ...voteOptions
    ].filter((v, i, a) => a.findIndex((x) => x.media === v.media) === i)

    this.vote = {
      optionsPool: pool,
      voteOptions: fromPool ? pool : voteOptions,
      votes: Array(voteOptions.length).fill([]),
      winners: [],
      lastWinners: preserveWinners ? this.vote.winners : [],
      collecting: true
    }

    this.sendVoteToClients()
    this.saveVote()
  }

  endVote () {
    if (!this.vote.collecting) {
      console.log('[Vote] Failed to end vote. Vote already ended')
      return
    }

    this.vote.collecting = false
    const maxVotes = Math.max(...this.vote.votes.map((v) => v.length))

    this.vote.winners = this.vote.votes
      .map((v, i) => ({ media: this.vote.voteOptions[i].media, votes: v.length }))
      .filter((v) => v.votes === maxVotes)
      .map((v) => v.media)

    this.sendVoteToClients()
    this.saveVote()
  }

  setRandomWinner () {
    if (this.vote.collecting) {
      console.log('[Vote] Failed to set random winner. Vote still collecting')
      return
    }

    if (this.vote.winners.length === 0) {
      console.log('[Vote] Failed to set random winner. No winners')
      return
    }

    if (this.vote.winners.length === 1) {
      console.log('[Vote] Failed to set random winner. Only one winner')
      return
    }

    console.log('[Vote] Setting random winner')

    const winner = this.vote.winners[Math.floor(Math.random() * this.vote.winners.length)]

    this.vote.winners = [winner]

    this.sendVoteToClients()
    this.saveVote()
  }

  getVoteResults () {
    return this.vote.winners
  }

  addVote (teamId: string, vote: number) {
    if (!this.vote.collecting) {
      console.log('[Vote] Failed to add vote. Vote not collecting')
      return false
    }

    if (vote < 0 || vote >= this.vote.voteOptions.length) {
      console.log('[Vote] Failed to add vote. Invalid vote', vote)
      return false
    }

    if (this.vote.votes[vote]?.includes(teamId)) {
      console.log('[Vote] Failed to add vote. Team already voted', teamId)
      return false
    }

    if (!this.vote.votes[vote]) {
      this.vote.votes[vote] = []
    }

    this.vote.votes[vote].push(teamId)
    
    if (this.teams.length === this.vote.votes.reduce((a, v) => a + v.length, 0)) {
      this.endVote()
      return true
    }

    this.sendVoteToClients()
    this.saveVote()
    return true
  }

  getVoted (teamId: string) {
    const index = this.vote.votes.findIndex((v) => v.includes(teamId))
    return index === -1 ? null : index
  }
  // #endregion

  // #region Media
  private currentMedia: string | null = null

  saveMedia () {
    Database.get().saveCollection('media', {
      currentMedia: this.currentMedia
    })
  }

  loadMedia () {
    const media = Database.get().getCollection('media') as {
      currentMedia: string
    }

    if (!media) {
      return
    }

    this.currentMedia = media.currentMedia
  }

  sendCurrentMediaToBoardAndAdmins (client?: WebSocketClient) {
    console.log('Sending media to board and admins')

    if (client) {
      if (client.type !== Role.Admin && client.type !== Role.Board) {
        console.log('Client is not an admin or board')
        return
      }

      client.send('currentMedia', this.currentMedia)
      return
    }

    this.clients
      .filter((c) => c.type === Role.Admin || c.type === Role.Board)
      .forEach((c) => c.send('currentMedia', this.currentMedia))
  }

  setMedia (media: string | null) {
    this.currentMedia = media
    this.saveMedia()
    this.sendCurrentMediaToBoardAndAdmins()
  }

  mediaFinishedListeners: (() => void)[] = []
  onMediaFinished (listener: () => void) {
    this.mediaFinishedListeners.push(listener)
  }
  mediaFinished () {
    this.mediaFinishedListeners.forEach((l) => l())
  }

  playMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.log('[Media] Failed to play media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.log('[Media] Failed to play media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'play'
    })
  }

  pauseMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.log('[Media] Failed to pause media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.log('[Media] Failed to pause media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'pause'
    })
  }

  seekMedia (progress: number) {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.log('[Media] Failed to seek media. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.log('[Media] Failed to seek media. No media set')
      return
    }

    board.send('mediaControl', {
      action: 'seek',
      progress
    })
  }

  requestMedia () {
    const board = this.clients.find((c) => c.type === Role.Board)

    if (!board) {
      console.log('[Media] Failed to request media duration. Board not connected')
      return
    }

    if (!this.currentMedia) {
      console.log('[Media] Failed to request media duration. No media set')
      return
    }

    board.send('getMedia', this.currentMedia)
  }

  sendMediaDurationToAdmins (duration: number) {
    console.log('Sending media duration to admins')

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaDuration', duration))
  }

  sendMediaStateToAdmins (state: 'playing' | 'paused') {
    console.log('Sending media state to admins')

    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaState', state))
  }

  sendMediaProgressToAdmins (progress: number) {
    this.clients
      .filter((c) => c.type === Role.Admin)
      .forEach((c) => c.send('mediaProgress', progress))
  }
  // #endregion

  // #region Clues
  private clues: string[] = []

  addClue (clue: string) {
    this.clues.push(clue)
  }

  removeClue (clue: string) {
    this.clues = this.clues.filter((c) => c !== clue)
  }

  addClues (clues: string[]) {
    this.clues.push(...clues)
  }

  getClues () {
    return this.clues
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

      console.log('Game created')
      console.log('Admin password:', Game.instance.adminPassword)
      console.log('Board password:', Game.instance.boardPassword)
    }
    return Game.instance
  }
  // #endregion
}