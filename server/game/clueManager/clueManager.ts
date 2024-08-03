import { Database } from '../../database'
import { Game } from '../game'
import { clues } from '../../../shared/assets/clues'

export class ClueManager {
  private availableClues: string[] = []
  private unlockedClues: {
    [teamId: string]: string[]
  } = {}
  private givenInvestigationCoins = 0
  private usedInvestigationCoins: {
    [teamId: string]: number
  } = {}

  save () {
    Database.get().saveCollection('clues', {
      availableClues: this.availableClues,
      unlockedClues: this.unlockedClues,
      givenInvestigationCoins: this.givenInvestigationCoins,
      usedInvestigationCoins: this.usedInvestigationCoins
    })
  }

  load () {
    console.log('[ClueManager] Loading data')
    const data = Database.get().getCollection('clues')
    
    if (!data) {
      return
    }

    if (!data.availableClues ||
      !Array.isArray(data.availableClues) ||
      data.availableClues?.some((clueId: any) => typeof clueId !== 'string')) {
      console.error('[ClueManager] Invalid availableClues data', data.availableClues)
      return
    }

    if (!data.unlockedClues ||
      typeof data.unlockedClues !== 'object' ||
      Array.isArray(data.unlockedClues) ||
      Object.keys(data.unlockedClues)
        ?.some(teamId => !Array.isArray((data.unlockedClues as Record<string, any>)?.[teamId])
        || (data.unlockedClues as Record<string, any>)?.[teamId]
          ?.some((clueId: any) => typeof clueId !== 'string'))) {
      console.error('[ClueManager] Invalid unlockedClues data', data.unlockedClues)
      return
    }

    if (typeof data.givenInvestigationCoins !== 'number') {
      console.error('[ClueManager] Invalid givenInvestigationCoins data', data.givenInvestigationCoins)
      return
    }

    if (typeof data.usedInvestigationCoins !== 'object' ||
      Array.isArray(data.usedInvestigationCoins) ||
      Object.keys(data.usedInvestigationCoins!)
        ?.some(teamId => typeof (data.usedInvestigationCoins as Record<string, any>)?.[teamId] !== 'number')) {
      console.error('[ClueManager] Invalid usedInvestigationCoins data', data.usedInvestigationCoins)
      return
    }

    this.availableClues = data.availableClues as string[]
    this.unlockedClues = data.unlockedClues as Record<string, string[]>
    this.givenInvestigationCoins = data.givenInvestigationCoins
    this.usedInvestigationCoins = data.usedInvestigationCoins as Record<string, number>
  }

  getAvailableClues() {
    return this.availableClues
  }

  getUnlockedClues(teamId: string) {
    return this.unlockedClues[teamId] || []
  }

  getInvestigationCoins(teamId: string) {
    return this.givenInvestigationCoins - (this.usedInvestigationCoins[teamId] || 0)
  }

  useInvestigationCoins(teamId: string, amount: number) {
    if (this.getInvestigationCoins(teamId) < amount) {
      console.error(`[ClueManager] Team ${teamId} does not have enough investigation coins`)
      return false
    }

    if (!this.usedInvestigationCoins[teamId]) {
      this.usedInvestigationCoins[teamId] = 0
    }

    this.usedInvestigationCoins[teamId] += amount

    Game.get().sendCluesToClients()
    this.save()

    return true
  }

  earnInvestigationCoins(teamId: string, amount: number) {
    if (!this.usedInvestigationCoins[teamId]) {
      this.usedInvestigationCoins[teamId] = 0
    }

    this.usedInvestigationCoins[teamId] -= amount

    Game.get().sendCluesToClients()
    this.save()
  }

  giveInvestigationCoins(amount: number) {
    this.givenInvestigationCoins += amount

    Game.get().sendCluesToClients()
    this.save()
  }

  addClues(clueIds: string[]) {
    this.availableClues.push(...clueIds)

    Game.get().sendCluesToClients()
    this.save()
  }

  unlockClue(teamId: string, clueId: string): boolean {
    if (!this.availableClues.includes(clueId)) {
      console.error(`[ClueManager] Clue ${clueId} is not available`)
      return false
    }

    const game = Game.get()
    const team = game.getTeamClient(teamId)

    const clue = clues.find(clue => clue.id === clueId)

    if (!clue) {
      console.error(`[ClueManager] Clue ${clueId} not found`)
      return false
    }

    if (!team) {
      console.error(`[ClueManager] Team ${teamId} not found`)
      return false
    }

    if (this.unlockedClues[teamId] && this.unlockedClues[teamId].includes(clueId)) {
      console.error(`[ClueManager] Clue ${clueId} already unlocked for team ${teamId}`)
      return false
    }

    if (this.getInvestigationCoins(teamId) < clue.cost) {
      console.error(`[ClueManager] Team ${teamId} does not have enough investigation coins`)
      return false
    }

    if (!this.usedInvestigationCoins[teamId]) {
      this.usedInvestigationCoins[teamId] = 0
    }

    this.usedInvestigationCoins[teamId] += clue.cost

    if (!this.unlockedClues[teamId]) {
      this.unlockedClues[teamId] = []
    }

    this.unlockedClues[teamId].push(clueId)

    game.sendCluesToClients(team)
    this.save()

    return true
  }
}