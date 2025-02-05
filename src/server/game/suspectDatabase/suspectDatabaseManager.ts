import { JsonMap } from "../../../shared/json"
import { colorize, Fg } from "../../console"
import { Database } from "../../database"
import { ENTRY_EARN_COINS, Game } from "../game"

export interface SuspectDatabase extends JsonMap {
  entries: string[]
}

export class SuspectDatabaseManager {
  private databases: {
    [teamId: string]: SuspectDatabase
  } = {}

  private shownSuspects: string[] = []

  public save (): void {
    Database.get().saveCollection("suspectDatabases", {
      databases: this.databases,
      shownSuspects: this.shownSuspects
    })
  }

  public load (): void {
    const data = Database.get().collections["suspectDatabases"]

    if (!data) {
      return
    }

    if (!data.databases ||
      typeof data.databases !== 'object' ||
      !Array.isArray(data.shownSuspects) ||
      Object.keys(data.databases).some(() => !Game.get().getTeam())) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Invalid data', data)
    } else {
      this.databases = data.databases as { [teamId: string]: SuspectDatabase }
    }


    if (!data.shownSuspects ||
      !Array.isArray(data.shownSuspects) ||
      data.shownSuspects.some((s) => typeof s !== 'string')) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Invalid shown suspects', data.shownSuspects)
    } else {
      this.shownSuspects = data.shownSuspects as string[]
    }
  }

  public clean (): void {
    Object.keys(this.databases).forEach((teamId) => {
      const team = Game.get().getTeam()

      if (!team) {
        console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Invalid team', teamId)
        delete this.databases[teamId]
      }
    })
    this.save()
    // Game.get().sendSuspectDatabasesToAdmins()
    Game.get().sendSuspectDatabaseToTeams()
  }

  public getDatabase (teamId: string): SuspectDatabase {
    return this.databases[teamId] ?? { entries: [] }
  }

  public getDatabases (): { [teamId: string]: SuspectDatabase } {
    return this.databases
  }

  public getShownSuspects (): string[] {
    return this.shownSuspects
  }

  public addShownSuspect (suspectId: string): void {
    if (this.shownSuspects.some((s) => s === suspectId)) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Suspect already shown', suspectId)
      return
    }

    console.log(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Adding shown suspect', suspectId)
    this.shownSuspects.push(suspectId)

    Game.get().sendShownSuspectsToClients()
    this.save()
  }

  public removeShownSuspect (suspectId: string): void {
    const index = this.shownSuspects.findIndex((s) => s === suspectId)

    if (index === -1) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Suspect not shown', suspectId)
      return
    }

    console.log(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Removing shown suspect', suspectId)
    this.shownSuspects.splice(index, 1)

    Game.get().sendShownSuspectsToClients()
    this.save()
  }

  public resetShownSuspects (): void {
    console.log(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Resetting shown suspects')
    this.shownSuspects = []

    Game.get().sendShownSuspectsToClients()
    this.save()
  }

  public addEntry (teamId: string, entryId: string): void {
    const game = Game.get()
    const team = game.getTeam()

    if (!team) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Invalid team', teamId)
      return
    }

    if (!this.databases[teamId]) {
      this.databases[teamId] = { entries: [] }
    }

    if (this.databases[teamId].entries.some((e) => e === entryId)) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Entry already exists', entryId)
      return
    }

    this.databases[teamId].entries.push(entryId)
    game.clueManager.earnInvestigationCoins(teamId, ENTRY_EARN_COINS)

    game.sendSuspectDatabaseToTeams()
    // game.sendSuspectDatabasesToAdmins()
    this.save()
  }

  public resetEntries (teamId: string): void {
    if (!this.databases[teamId]) {
      this.databases[teamId] = { entries: [] }
    }

    this.databases[teamId].entries = []

    // const teamClient = Game.get().getTeamClient(teamId)
    
    Game.get().sendSuspectDatabaseToTeams()
    // Game.get().sendSuspectDatabasesToAdmins()
    this.save()
  }

  public addEntryForAll (entryId: string): void {
    console.log(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Adding entry for all teams', entryId)
    const game = Game.get()

    const team = game.getTeam()

    // for (const team of game.getTeams()) {
      if (!this.databases[team.id]) {
        this.databases[team.id] = { entries: [] }
      }

      if (this.databases[team.id].entries.some((e) => e === entryId)) {
        console.log(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Entry already exists for team', team.id)
      } else {
        this.databases[team.id].entries.push(entryId)
        game.clueManager.earnInvestigationCoins(team.id, 5)
        
        const teamClient = game.getClient()
        teamClient && game.sendSuspectDatabaseToTeams()
      }
    // }

    // game.sendSuspectDatabasesToAdmins()
    this.save()
  }

  public removeEntry (teamId: string, entryId: string): void {
    const game = Game.get()
    const team = game.getTeam()

    if (!team) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Invalid team', teamId)
      return
    }

    if (!this.databases[teamId]) {
      this.databases[teamId] = { entries: [] }
    }

    const index = this.databases[teamId].entries.findIndex((e) => e === entryId)

    if (index === -1) {
      console.error(colorize('[SuspectDatabaseManager]', Fg.Cyan), 'Entry does not exist', entryId)
      return
    }

    this.databases[teamId].entries.splice(index, 1)

    // const teamClient = game.getTeamClient(teamId)

    game.sendSuspectDatabaseToTeams()
    // game.sendSuspectDatabasesToAdmins()
    this.save()
  }
}