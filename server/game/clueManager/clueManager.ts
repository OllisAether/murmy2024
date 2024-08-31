import { Database } from '../../database'
import { Game } from '../game'
import { clues } from '../../../shared/assets/clues'
import { Votes } from '../../../shared/vote'
import { colorize, Fg } from '../../console'

export class ClueManager {
  private availableClues: string[] = []
  private newAvailableClues: string[] = []
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
  private mainClueUnlocked: {
    [teamId: string]: boolean
  } = {}

  save () {
    Database.get().saveCollection('clues', {
      availableClues: this.availableClues,
      newAvailableClues: this.newAvailableClues,
      unlockedClues: this.unlockedClues,
      givenInvestigationCoins: this.givenInvestigationCoins,
      usedInvestigationCoins: this.usedInvestigationCoins,
      mainClueType: this.mainClueType,
      mainClueUnlocked: this.mainClueUnlocked,
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
    } else {
      this.availableClues = data.availableClues as string[]
    }

    if (!data.newAvailableClues ||
      !Array.isArray(data.newAvailableClues) ||
      data.newAvailableClues?.some((clueId: any) => typeof clueId !== 'string')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid newAvailableClues data', data.newAvailableClues)
    } else {
      this.newAvailableClues = data.newAvailableClues as string[]
    }

    if (!data.unlockedClues ||
      typeof data.unlockedClues !== 'object' ||
      Array.isArray(data.unlockedClues) ||
      Object.keys(data.unlockedClues)
        ?.some(teamId => !Array.isArray((data.unlockedClues as Record<string, any>)?.[teamId])
        || (data.unlockedClues as Record<string, any>)?.[teamId]
          ?.some((clueId: any) => typeof clueId !== 'string'))) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid unlockedClues data', data.unlockedClues)
    } else {
      this.unlockedClues = data.unlockedClues as Record<string, string[]>
    }

    if (typeof data.givenInvestigationCoins !== 'number') {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid givenInvestigationCoins data', data.givenInvestigationCoins)
    } else {
      this.givenInvestigationCoins = data.givenInvestigationCoins
    }

    if (typeof data.usedInvestigationCoins !== 'object' ||
      Array.isArray(data.usedInvestigationCoins) ||
      Object.keys(data.usedInvestigationCoins!)
        ?.some(teamId => typeof (data.usedInvestigationCoins as Record<string, any>)?.[teamId] !== 'number')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid usedInvestigationCoins data', data.usedInvestigationCoins)
    } else {
      this.usedInvestigationCoins = data.usedInvestigationCoins as Record<string, number>
    }

    if (typeof data.mainClueType !== 'object' ||
      Array.isArray(data.mainClueType) ||
      Object.keys(data.mainClueType!)
        ?.some(teamId => (data.mainClueType as Record<string, any>)?.[teamId] !== 'phone'
        && (data.mainClueType as Record<string, any>)?.[teamId] !== 'diary')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid mainClueType data', data.mainClueType)
    } else {
      this.mainClueType = data.mainClueType as Record<string, 'phone' | 'diary'>
    }

    if (typeof data.mainClueUnlocked !== 'object' ||
      Array.isArray(data.mainClueUnlocked) ||
      Object.keys(data.mainClueUnlocked!)
        ?.some(teamId => typeof (data.mainClueUnlocked as Record<string, any>)?.[teamId] !== 'boolean')) {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid mainClueUnlocked data', data.mainClueUnlocked)
    } else {
      this.mainClueUnlocked = data.mainClueUnlocked as Record<string, boolean>
    }

    if (typeof data.assignFurtherMainClueTypesRandomly !== 'boolean') {
      console.error(colorize('[ClueManager]', Fg.Blue), 'Invalid assignFurtherMainClueTypesRandomly data', data.assignFurtherMainClueTypesRandomly)
    } else {
      this.assignFurtherMainClueTypesRandomly = data.assignFurtherMainClueTypesRandomly
    }

    // this.availableClues = data.availableClues as string[]
    // this.availableTranscripts = data.availableTranscripts as string[]
    // this.unlockedClues = data.unlockedClues as Record<string, string[]>
    // this.givenInvestigationCoins = data.givenInvestigationCoins
    // this.usedInvestigationCoins = data.usedInvestigationCoins as Record<string, number>
    // this.mainClueType = data.mainClueType as Record<string, 'phone' | 'diary'>
    // this.assignFurtherMainClueTypesRandomly = data.assignFurtherMainClueTypesRandomly
  }

  // #region Investigation Coins
  getInvestigationCoins(teamId?: string) {
    if (!teamId) {
      return this.givenInvestigationCoins
    }

    return this.givenInvestigationCoins - (this.usedInvestigationCoins[teamId] || 0)
  }

  getInvestigationCoinDelta(teamId?: string) {
    if (!teamId) {
      return this.usedInvestigationCoins
    }

    return this.usedInvestigationCoins[teamId] || 0
  }

  getGivenInvestigationCoins() {
    return this.givenInvestigationCoins
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

    const teamClient = Game.get().getTeamClient(teamId)

    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()

    return true
  }

  earnInvestigationCoins(teamId: string, amount: number) {
    if (!this.usedInvestigationCoins[teamId]) {
      this.usedInvestigationCoins[teamId] = 0
    }

    this.usedInvestigationCoins[teamId] -= amount

    const teamClient = Game.get().getTeamClient(teamId)

    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }

  setInvestigationCoinDelta(teamId: string, amount: number) {
    if (!this.usedInvestigationCoins[teamId]) {
      this.usedInvestigationCoins[teamId] = 0
    }

    this.usedInvestigationCoins[teamId] = amount

    const teamClient = Game.get().getTeamClient(teamId)

    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }

  giveInvestigationCoins(amount: number) {
    this.givenInvestigationCoins += amount

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
    this.save()
  }

  setInvestigationCoins(amount: number) {
    this.givenInvestigationCoins = amount

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
    this.save()
  }
  // #endregion

  // #region Clues
  getAvailableClues() {
    return this.availableClues
  }

  getNewAvailableClues() {
    return this.newAvailableClues
  }

  getUnlockedClues(teamId?: string) {
    if (!teamId) {
      return this.unlockedClues
    }

    return this.unlockedClues[teamId] || []
  }

  addClues(clueIds: string[]) {
    for (const clueId of clueIds) {
      if (!this.availableClues.includes(clueId)) {
        this.availableClues.push(clueId)

        if (!this.newAvailableClues.includes(clueId)) {
          this.newAvailableClues.push(clueId)
        }
      }
    }

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
    this.save()
  }

  addClue(clueId: string) {
    if (!this.availableClues.includes(clueId)) {
      this.availableClues.push(clueId)
      
      if (!this.newAvailableClues.includes(clueId)) {
        this.newAvailableClues.push(clueId)
      }
    }

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
    this.save()
  }

  removeClue(clueId: string) {
    this.availableClues = this.availableClues.filter(id => id !== clueId)

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
    this.save()
  }

  clearNewAvailableClues() {
    this.newAvailableClues = []

    Game.get().sendCluesToClients()
    this.save()
  }

  unlockClue(teamId: string, clueId: string): boolean {
    if (!this.availableClues.includes(clueId)) {
      console.error(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} is not available`)
      return false
    }

    const game = Game.get()
    const team = game.getTeam(teamId)

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

    const teamClient = game.getTeamClient(teamId)

    teamClient && game.sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()

    return true
  }

  unlockClueForAll(clueId: string) {
    const game = Game.get()

    const clue = clues.find(clue => clue.id === clueId)

    if (!clue) {
      console.error(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} not found`)
      return false
    }

    const teams = game.getTeams()

    for (const team of teams) {
      if (!this.unlockedClues[team.id]) {
        this.unlockedClues[team.id] = []
      }

      if (!this.usedInvestigationCoins[team.id]) {
        this.usedInvestigationCoins[team.id] = 0
      }

      if (this.unlockedClues[team.id].includes(clueId)) {
        console.warn(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} already unlocked for team ${team.id}`)
        continue
      }

      if (this.getInvestigationCoins(team.id) < clue.cost) {
        console.warn(colorize('[ClueManager]', Fg.Blue), `Team ${team.id} does not have enough investigation coins`)
        continue
      }

      this.usedInvestigationCoins[team.id] += clue.cost
      this.unlockedClues[team.id].push(clueId)

      const teamClient = game.getTeamClient(team.id)

      teamClient && game.sendCluesToClients(teamClient)
    }

    Game.get().sendCluesToAdmins()
    this.save()
  }

  unlockClueWithoutCost(teamId: string, clueId: string) {
    const game = Game.get()
    const team = game.getTeam(teamId)

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

    if (!this.unlockedClues[teamId]) {
      this.unlockedClues[teamId] = []
    }

    this.unlockedClues[teamId].push(clueId)

    const teamClient = game.getTeamClient(teamId)

    teamClient && game.sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }

  lockClue(teamId: string, clueId: string) {
    if (!this.unlockedClues[teamId] || !this.unlockedClues[teamId].includes(clueId)) {
      console.warn(colorize('[ClueManager]', Fg.Blue), `Clue ${clueId} not unlocked for team ${teamId}`)
    }

    this.unlockedClues[teamId] = this.unlockedClues[teamId].filter(id => id !== clueId)

    const teamClient = Game.get().getTeamClient(teamId)

    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }
  // #endregion

  // #region Main Clue Type
  assignRandomMainClueType(teamId?: string) {
    const game = Game.get()

    const teams = game.getTeams().map(team => team.id)

    let numberOfPhoneClues = Object.values(this.mainClueType).filter(type => type === 'phone').length
    let numberOfDiaryClues = Object.values(this.mainClueType).filter(type => type === 'diary').length

    if (teamId) {
      // if (numberOfPhoneClues <= numberOfDiaryClues) {
      //   this.mainClueType[teamId] = 'phone'
      //   numberOfPhoneClues++
      // } else {
      //   this.mainClueType[teamId] = 'diary'
      //   numberOfDiaryClues++
      // }

      const randomValue = Math.random()
      const phoneChance = 1 - numberOfPhoneClues / (teams.length - 1)
      const diaryChance = 1 - numberOfDiaryClues / (teams.length - 1)

      const chance = (phoneChance + diaryChance) === 0
        ? 0.5
        : phoneChance / (phoneChance + diaryChance)

      console.log(randomValue, chance, phoneChance, diaryChance)

      if (randomValue < chance) {
        this.mainClueType[teamId] = 'phone'
        numberOfPhoneClues++
      } else {
        this.mainClueType[teamId] = 'diary'
        numberOfDiaryClues++
      }

      console.log(colorize('[ClueManager]', Fg.Blue), 'Main clue type assigned randomly to team', teamId, this.mainClueType[teamId])
    } else {
      const teamsWithoutMainClueType = teams.filter(teamId => !this.mainClueType[teamId])
        .sort(() => Math.random() - 0.5)
      
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

    if (teamId) {
      const teamClient = game.getTeamClient(teamId)
      
      teamClient && game.sendCluesToClients(teamClient)
    } else {
      game.sendCluesToClients()
    }

    Game.get().sendCluesToAdmins()
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
    Game.get().sendCluesToAdmins()
    this.save()
  }

  private assignFurtherMainClueTypesRandomly: boolean = false
  setAssignFurtherMainClueTypesRandomly(value: boolean) {
    console.log(colorize('[ClueManager]', Fg.Blue), 'Assign further main clue types randomly', value)

    this.assignFurtherMainClueTypesRandomly = value

    Game.get().sendCluesToClients()
    Game.get().sendCluesToAdmins()
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
        this.assignRandomMainClueType(teamId)
      }
    }

    return this.mainClueType[teamId] ?? null
  }

  getMainClueUnlocked(teamId?: string) {
    if (!teamId) {
      return this.mainClueUnlocked
    }

    return this.mainClueUnlocked[teamId] || false
  }

  setMainClueType(teamId: string, type: 'phone' | 'diary' | null) {
    if (!type) {
      delete this.mainClueType[teamId]
    } else {
      this.mainClueType[teamId] = type
    }

    const teamClient = Game.get().getTeamClient(teamId)
    
    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }

  setMainClueUnlocked(teamId: string, value: boolean) {
    this.mainClueUnlocked[teamId] = value

    const teamClient = Game.get().getTeamClient(teamId)
    
    teamClient && Game.get().sendCluesToClients(teamClient)
    Game.get().sendCluesToAdmins()
    this.save()
  }
  // #endregion
}