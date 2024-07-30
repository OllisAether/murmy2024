import { JsonMap } from "../../../shared/json"
import { Entry } from "../../../shared/suspectDatabase/entry"
import { Database } from "../../database"
import { Game } from "../game"

export interface SuspectDatabase extends JsonMap {
  entries: Entry[]
}

export class SuspectDatabaseManager {
  private databases: {
    [teamId: string]: SuspectDatabase
  } = {}

  public save (): void {
    Database.get().saveCollection("suspectDatabases", this.databases)
  }

  public load (): void {
    const data = Database.get().collections["suspectDatabases"]

    if (!data) {
      return
    }

    if (
      typeof data !== "object" ||
      Array.isArray(data) ||
      Object.keys(data).some((key) =>
        typeof key !== "string"
        || !(data[key] as SuspectDatabase).entries
        || !Array.isArray((data[key] as SuspectDatabase).entries))
    ) {
      console.error("[SuspectDatabaseManager] Invalid data", data)
      return
    }

    this.databases = data as { [teamId: string]: SuspectDatabase }
  }

  public getDatabase (teamId: string): SuspectDatabase {
    return this.databases[teamId] ?? { entries: [] }
  }

  public getDatabases (): { [teamId: string]: SuspectDatabase } {
    return this.databases
  }

  public addEntry (teamId: string, entry: Entry): void {
    const game = Game.get()
    const teamClient = game.getTeamClient(teamId)
    
    if (!teamClient) {
      console.error("[SuspectDatabaseManager] Invalid team", teamId)
      return
    }

    if (!this.databases[teamId]) {
      this.databases[teamId] = { entries: [] }
    }

    if (this.databases[teamId].entries.some((e) => e.matterId === entry.matterId)) {
      console.error("[SuspectDatabaseManager] Entry already exists", entry.matterId)
      return
    }

    this.databases[teamId].entries.push(entry)

    game.sendSuspectDatabaseToTeams(teamClient)
    this.save()
  }
}