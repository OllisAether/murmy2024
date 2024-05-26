import { Request, Response } from "express"
import { WebSocketClient } from "../clients/client"
import { Team } from "./team"
import { GenericClient } from "../clients/genericClient"
import { AdminClient } from "../clients/adminClient"
import { BoardClient } from "../clients/boardClient"
import { TeamClient } from "../clients/teamClient"
import { Role } from "../../shared/roles"
import { Database, JsonArray, JsonMap } from "../database"

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
  }

  // #region Teams
  private teams: Team[] = (Database.get().getCollection('teams')?.teams as JsonArray)?.map?.((t) => ({
    id: (t as JsonMap)?.id as string,
    name: (t as JsonMap)?.name as string,
    code: (t as JsonMap)?.code as string
  })) ?? []

  async saveTeams() {
    await Database.get().saveCollection('teams', {
      teams: this.teams.map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code
      }))
    })
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
    console.log('Sending clients to admins')

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
    console.log('Adding client', client.id)

    this.clients.push(client)
    this.sendClientsToAdmins()
  }

  removeClient(client: WebSocketClient) {
    console.log('Removing client', client.id)

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

    this.removeClient(client)

    const adminClient = (client as GenericClient).promoteToAdmin()

    this.addClient(adminClient)
  }

  promoteClientToBoard(id: string) {
    const client = this.getClient(id)

    if (!client) {
      return
    }
    
    if (client.type !== Role.Unauthorized) {
      return
    }

    this.removeClient(client)
    console.log('Promoting to board', client.userAgent)

    const boardClient = (client as GenericClient).promoteToBoard(this.boardPassword)
    console.log('Promoted to board', boardClient.userAgent)

    this.addClient(boardClient)
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

    this.removeClient(client)

    const teamClient = (client as GenericClient).promoteToTeam(
      team.id,
      team.name,
      team.code
    )

    this.addClient(teamClient)
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

    console.log('Admin login', clientId, role)

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

      console.log('Promoting to admin', clientId)
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

      console.log('Promoting to board', clientId)
      this.promoteClientToBoard(clientId)
    }

    res.status(200).send('OK')
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
      console.log('Game created')
      console.log('Admin password:', Game.instance.adminPassword)
      console.log('Board password:', Game.instance.boardPassword)
    }
    return Game.instance
  }
  // #endregion
}