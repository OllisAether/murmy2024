import { Database } from '../../database'
import { Game } from '../game'
import { clues } from '../../../shared/assets/clues'
import { VoteResults, Votes } from '../../../shared/vote'
import { colorize, Fg } from '../../console'

export class ClueManager {
  private availableClues: string[] = []
  private unlockedClues: {
    [teamId: string]: string[]
  } = {}
  private givenInvestigationCoins = 0
  private usedInvestigationCoins: {
    [teamId: string]: number
  } = {}

  private mainClueType: {
    [teamId: string]: 'phone' | 'diary'
  } = {}

  save () {
    Database.get().saveCollection('clues', {
      availableClues: this.availableClues,
      unlockedClues: this.unlockedClues,
      givenInvestigationCoins: this.givenInvestigationCoins,
      usedInvestigationCoins: this.usedInvestigationCoins,
      mainClueType: this.mainClueType,
      assignFurtherMainClueTypesRandomly: this.assignFurtherMainClueTypesRandomly
    })
  }

  load () {
    const data = Database.get().getCollection('clues')
    
    if (!data) {
      return
    }

    if (!data.availableClues ||
      !Array.isArray(data.availableClues) ||
      data.availableClues?.some((clueId: any) => typeof clueId !== 'string')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid availableClues data', data.availableClues)
      return
    }

    if (!data.unlockedClues ||
      typeof data.unlockedClues !== 'object' ||
      Array.isArray(data.unlockedClues) ||
      Object.keys(data.unlockedClues)
        ?.some(teamId => !Array.isArray((data.unlockedClues as Record<string, any>)?.[teamId])
        || (data.unlockedClues as Record<string, any>)?.[teamId]
          ?.some((clueId: any) => typeof clueId !== 'string'))) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid unlockedClues data', data.unlockedClues)
      return
    }

    if (typeof data.givenInvestigationCoins !== 'number') {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid givenInvestigationCoins data', data.givenInvestigationCoins)
      return
    }

    if (typeof data.usedInvestigationCoins !== 'object' ||
      Array.isArray(data.usedInvestigationCoins) ||
      Object.keys(data.usedInvestigationCoins!)
        ?.some(teamId => typeof (data.usedInvestigationCoins as Record<string, any>)?.[teamId] !== 'number')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid usedInvestigationCoins data', data.usedInvestigationCoins)
      return
    }

    if (typeof data.mainClueType !== 'object' ||
      Array.isArray(data.mainClueType) ||
      Object.keys(data.mainClueType!)
        ?.some(teamId => (data.mainClueType as Record<string, any>)?.[teamId] !== 'phone'
        && (data.mainClueType as Record<string, any>)?.[teamId] !== 'diary')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid mainClueType data', data.mainClueType)
      return
    }

    if (typeof data.assignFurtherMainClueTypesRandomly !== 'boolean') {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid assignFurtherMainClueTypesRandomly data', data.assignFurtherMainClueTypesRandomly)
      return
    }

    this.availableClues = data.availableClues as string[]
    this.unlockedClues = data.unlockedClues as Record<string, string[]>
    this.givenInvestigationCoins = data.givenInvestigationCoins
    this.usedInvestigationCoins = data.usedInvestigationCoins as Record<string, number>
    this.mainClueType = data.mainClueType as Record<string, 'phone' | 'diary'>
    this.assignFurtherMainClueTypesRandomly = data.assignFurtherMainClueTypesRandomly
  }

  getAvailableClues() {
    return this.availableClues
  }

  getUnlockedClues(teamId?: string) {
    if (!teamId) {
      return this.unlockedClues
    }

    return this.unlockedClues[teamId] || []
  }

  getInvestigationCoins(teamId?: string) {
    if (!teamId) {
      return this.givenInvestigationCoins
    }

    return this.givenInvestigationCoins - (this.usedInvestigationCoins[teamId] || 0)
  }

  useInvestigationCoins(teamId: string, amount: number) {
    if (this.getInvestigationCoins(teamId) < amount) {
      console.warn(colorize('[ClueManager]', Fg.Blue), `Team ${teamId} does not have enough investigation coins`)
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
    this.availableClues
      .push(...clueIds.filter(clueId => !this.availableClues.includes(clueId)))

    Game.get().sendCluesToClients()
    this.save()
  }

  unlockClue(teamId: string, clueId: string): boolean {
    if (!this.availableClues.includes(clueId)) {
      console.error(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} is not available`)
      return false
    }

    const game = Game.get()
    const team = game.getTeamClient(teamId)

    const clue = clues.find(clue => clue.id === clueId)

    if (!clue) {
      console.error(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} not found`)
      return false
    }

    if (!team) {
      console.error(colorize('[ClueManager]', Fg.Blue), `Team ${teamId} not found`)
      return false
    }

    if (this.unlockedClues[teamId] && this.unlockedClues[teamId].includes(clueId)) {
      console.warn(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} already unlocked for team ${teamId}`)
      return false
    }

    if (this.getInvestigationCoins(teamId) < clue.cost) {
      console.warn(colorize('[ClueManager]', Fg.Blue), `Team ${teamId} does not have enough investigation coins`)
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

  assignRandomMainClueType(teamId?: string) {
    const game = Game.get()

    const teams = game.getTeams().map(team => team.id)

    let numberOfPhoneClues = Object.values(this.mainClueType).filter(type => type === 'phone').length
    let numberOfDiaryClues = Object.values(this.mainClueType).filter(type => type === 'diary').length

    if (teamId) {
      if (numberOfPhoneClues <= numberOfDiaryClues) {
        this.mainClueType[teamId] = 'phone'
        numberOfPhoneClues++
      } else {
        this.mainClueType[teamId] = 'diary'
        numberOfDiaryClues++
      }

      console.log(colorize('[ClueManager]', Fg.Blue), 'Main clue type assigned randomly to team', teamId, this.mainClueType[teamId])
    } else {
      const teamsWithoutMainClueType = teams.filter(teamId => !this.mainClueType[teamId])
      
      for (const teamId of teamsWithoutMainClueType) {
        if (numberOfPhoneClues <= numberOfDiaryClues) {
          this.mainClueType[teamId] = 'phone'
          numberOfPhoneClues++
        } else {
          this.mainClueType[teamId] = 'diary'
          numberOfDiaryClues++
        }
      }
      console.log(colorize('[ClueManager]', Fg.Blue), 'Main clue types assigned randomly', this.mainClueType)
    }

    game.sendCluesToClients()
    this.save()
  }

  assignMainClueTypeFromVote (votes: Votes) {
    const phoneVotes = votes.phone ?? []
    const diaryVotes = votes.diary ?? []

    for (const teamId of phoneVotes) {
      this.mainClueType[teamId] = 'phone'
    }

    for (const teamId of diaryVotes) {
      this.mainClueType[teamId] = 'diary'
    }

    console.log(colorize('[ClueManager]', Fg.Blue), 'Main clue types assigned from vote')
    console.log(colorize('[ClueManager]', Fg.Blue), 'Phone votes', phoneVotes)
    console.log(colorize('[ClueManager]', Fg.Blue), 'Diary votes', diaryVotes)

    Game.get().sendCluesToClients()
    this.save()
  }

  private assignFurtherMainClueTypesRandomly: boolean = false
  setAssignFurtherMainClueTypesRandomly(value: boolean) {
    console.log(colorize('[ClueManager]', Fg.Blue), 'Assign further main clue types randomly', value)

    this.assignFurtherMainClueTypesRandomly = value

    Game.get().sendCluesToClients()
    this.save()
  }

  getAssignFurtherMainClueTypesRandomly() {
    return this.assignFurtherMainClueTypesRandomly
  }

  getMainClueType(teamId?: string) {
    if (!teamId) {
      return this.mainClueType
    }

    if (!this.mainClueType[teamId]) {
      if (this.assignFurtherMainClueTypesRandomly) {
        this.assignRandomMainClueType()
      }
    }

    return this.mainClueType[teamId] ?? null
  }

  setMainClueType(teamId: string, type: 'phone' | 'diary') {
    this.mainClueType[teamId] = type

    Game.get().sendCluesToClients()
    this.save()
  }
}