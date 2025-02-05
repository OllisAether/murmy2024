import { Game } from '../game'
import { VoteOption, VoteResults, VoteSession } from '../../../shared/vote'
import { Database } from '../../database'
import { voteOptions } from '../../../shared/assets/voteOptions'
import { colorize, Fg } from '../../console'

export interface OpenVoteOptions {
  title?: string,
  pool: string,
  pauseOnOpen?: boolean,
  autoClose?: boolean
}

export class VoteManager {
  private voteOptions: VoteOption[] = voteOptions
  private pools: Record<string, Set<string>> = {}
  private activeSession: VoteSession | null = null
  // private voteHistory: VoteSession[] = []

  load () {
    this.loadVoteOptions()
    this.loadPools()
    this.loadActiveSession()
  }

  saveVoteOptions () {
    Database.get().saveCollection('voteOptions', {
      voteOptions: this.voteOptions
    })
  }

  savePools () {
    Database.get().saveCollection('votePools', {
      pools: this.getPools()
    })
  }

  saveActiveSession () {
    Database.get().saveCollection('voteActiveSession', {
      activeSession: this.getActiveSession()
    })
  }

  loadVoteOptions () {
    // const data = Database.get().getCollection('voteOptions')

    // if (data) {
    //   this.voteOptions = (data.voteOptions as VoteOption[]) ?? []
    // }
  }

  loadPools () {
    const data = Database.get().getCollection('votePools')

    if (data) {
      this.pools = Object.fromEntries(Object.entries(data.pools as Record<string, string[]>)
        .map(([pool, options]) => [pool, new Set(options)]))
    }
  }

  loadActiveSession () {
    const data = Database.get().getCollection('voteActiveSession')

    if (data) {
      this.activeSession = data.activeSession as VoteSession
    }
  }

  getActiveSession () {
    return this.activeSession
  }

  getPools () {
    const pools = Object.fromEntries(
      Object.entries(this.pools)
        .map(([pool, options]) => [pool, Array.from(options)])
    )

    return pools
  }

  getVoteOptions () {
    return this.voteOptions
  }

  addPool (pool: string) {
    console.log(colorize('[VoteManager]', Fg.Green), `Add pool ${pool}`)

    this.pools[pool] = new Set()

    Game.get().sendVotePoolsToClients()
    this.savePools()
  }

  removePool (pool: string) {
    console.log(colorize('[VoteManager]', Fg.Green), `Remove pool ${pool}`)

    delete this.pools[pool]

    Game.get().sendVotePoolsToClients()
    this.savePools()
  }

  addOptionsToPool (pool: string, option: string[]) {
    console.log(colorize('[VoteManager]', Fg.Green), `Add options to pool ${pool}`, option)

    if (!this.pools[pool]) {
      this.addPool(pool)
    }

    option.forEach(o => this.pools[pool].add(o))

    Game.get().sendVotePoolsToClients()
    this.savePools()
  }

  removeOptionFromPool (pool: string, option: string) {
    console.log(colorize('[VoteManager]', Fg.Green), `Remove options from pool ${pool}`, option)

    if (!this.pools[pool]) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Pool not found')
      return
    }

    this.pools[pool].delete(option)

    Game.get().sendVotePoolsToClients()
    this.savePools()
  }

  addOptions (options: VoteOption[]) {
    console.log(colorize('[VoteManager]', Fg.Green), 'Add options', options)

    this.voteOptions.push(...options)

    Game.get().sendVoteOptionsToClients()
    this.saveVoteOptions()
  }

  editOption (option: VoteOption) {
    console.log(colorize('[VoteManager]', Fg.Green), 'Edit option', option)

    const index = this.voteOptions.findIndex(o => o.id === option.id)

    if (index === -1) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Option not found')
      return
    }

    this.voteOptions[index] = option

    Game.get().sendVoteOptionsToClients()
    this.saveVoteOptions()
  }

  removeOption (optionId: string) {
    console.log(colorize('[VoteManager]', Fg.Green), `Remove option ${optionId}`)

    this.voteOptions = this.voteOptions.filter(o => o.id !== optionId)

    Game.get().sendVoteOptionsToClients()
    this.saveVoteOptions()
  }

  clearPool (pool: string) {
    console.log(colorize('[VoteManager]', Fg.Green), `Clear pool ${pool}`)

    this.pools[pool].clear()

    Game.get().sendVotePoolsToClients()
    this.savePools()
  }

  openVote (opt: OpenVoteOptions) {
    if (this.activeSession?.open) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Vote already open')
      return
    }

    if (!this.pools[opt.pool]) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Pool not found')
      return
    }

    if (this.pools[opt.pool].size === 0) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Pool is empty')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Open vote', opt)

    // if (this.activeSession) {
    //   this.voteHistory.push(this.activeSession)
    // }

    this.activeSession = {
      open: true,
      paused: opt.pauseOnOpen || false,
      pool: opt.pool,
      candidateIds: Array.from(this.pools[opt.pool]),

      title: opt.title ?? undefined,

      autoClose: opt.autoClose ?? true,

      votes: {},
      passiveVotes: {},
      totalPossibleVotes: [Game.get().getTeam()].filter(t => t.active).length,

      isTiebreaker: false,
      isRandom: false
    }

    if (this.pools[opt.pool].size === 1) {
      // Skip vote if only one option
      const option = Array.from(this.pools[opt.pool])[0]

      this.activeSession.open = false
      this.activeSession.isRandom = true
      this.activeSession.winner = option

      if (!this.activeSession.votes[option]) {
        this.activeSession.votes[option] = []
      }

      this.activeSession.votes[option] = [Game.get().getTeam()].filter(t => t.active).map(t => t.id)
    }

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  closeVote () {
    if (!this.activeSession?.open) {
      console.warn(colorize('[VoteManager]', Fg.Green), 'No open vote session')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Close vote')

    this.activeSession.open = false

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  /**
   * End the vote session and determine the winners
   * If there is a tie, set up a tiebreaker
   * If there was a tiebreaker, set up a random winner
   */
  endVote () {
    if (!this.activeSession) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No active vote session while ending vote')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'End vote')

    this.activeSession.open = false
    this.activeSession.paused = false

    if (this.activeSession.isRandom) {
      Game.get().sendVoteSessionToClients()
      this.saveActiveSession()
      return
    }

    const results = this.getResults()

    if (!results) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No results available while ending vote')
      return
    }

    if (this.activeSession.isTiebreaker) {
      this.activeSession.tiebreakerResults = results
    } else {
      this.activeSession.voteResults = results

      if (results.next === 'tiebreaker') {
        this.activeSession.tiebreakerCandidates = results.winners
      }
    }

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  startTiebreaker () {
    if (!this.activeSession) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No active vote session while starting tiebreaker')
      return
    }

    if (this.activeSession?.isTiebreaker) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Tiebreaker already started while starting tiebreaker')
      return
    }

    const results = this.getResults()

    if (!results) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No results available while starting tiebreaker')
      return
    }

    if (results.next !== 'tiebreaker') {
      console.error(colorize('[VoteManager]', Fg.Green), 'Not a tiebreaker')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Start tiebreaker')

    this.activeSession.isTiebreaker = true
    this.activeSession.tiebreakerCandidates = results.winners
    this.activeSession.tiebreakerVotes = {}
    this.activeSession.open = true

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  setRandom () {
    if (!this.activeSession) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No active vote session while setting random')
      return
    }

    if (this.activeSession?.isRandom) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Random already started')
      return
    }

    const results = this.getResults()

    if (!results) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No results available while setting random')
      return
    }

    if (results.next !== 'random') {
      console.error(colorize('[VoteManager]', Fg.Green), 'Not a random')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Set random winner')

    const winner = results.winners[Math.floor(Math.random() * results.winners.length)]

    this.activeSession.isRandom = true
    this.activeSession.winner = winner
    this.activeSession.open = false

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  pauseVote () {
    if (!this.activeSession?.open) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No open vote session while pausing')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Pause vote')

    this.activeSession.paused = true

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  resumeVote () {
    if (!this.activeSession?.open) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No open vote session while resuming')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Resume vote')

    this.activeSession.paused = false

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()
  }

  vote(teamId: string, optionId: string): boolean {
    if (!this.activeSession?.open) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No open vote session while voting')
      return false
    }

    const team = Game.get().getTeam()

    if (!team) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Team not found')
      return false
    }

    if (!this.pools[this.activeSession.pool]) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Pool not found')
      return false
    }

    if (!this.pools[this.activeSession.pool].has(optionId)) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Option not found')
      return false
    }

    if (this.activeSession.paused) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Vote session paused')
      return false
    }

    if (!team.active) {
      console.error(colorize('[VoteManager]', Fg.Green), 'Team not active')

      if (this.activeSession.isTiebreaker) {
        if (!this.activeSession.passiveTiebreakerVotes?.[optionId]) {
          if (!this.activeSession.passiveTiebreakerVotes) {
            this.activeSession.passiveTiebreakerVotes = {}
          }

          this.activeSession.passiveTiebreakerVotes[optionId] = []
        }

        this.activeSession.passiveTiebreakerVotes[optionId].push(teamId)

        Game.get().sendVoteSessionToClients()
        this.saveActiveSession()

        return true
      } else {
        // Register passive vote but don't count it
        if (!this.activeSession.passiveVotes[optionId]) {
          this.activeSession.passiveVotes[optionId] = []
        }

        this.activeSession.passiveVotes[optionId].push(teamId)
      }

      Game.get().sendVoteSessionToClients()
      this.saveActiveSession()

      return true
    }

    if (this.activeSession.isTiebreaker) {
      if (!this.activeSession.tiebreakerCandidates?.includes(optionId)) {
        console.error(colorize('[VoteManager]', Fg.Green), 'Option not in tiebreaker')
        return false
      }

      if (Object.values(this.activeSession.tiebreakerVotes || {}).find(votes => votes.includes(teamId))) {
        console.error(colorize('[VoteManager]', Fg.Green), 'Team already voted in tiebreaker')
        return false
      }

      console.log(colorize('[VoteManager]', Fg.Green), `Team ${teamId} voted for tiebreaker option ${optionId}`)

      if (!this.activeSession.tiebreakerVotes?.[optionId]) {
        if (!this.activeSession.tiebreakerVotes) {
          this.activeSession.tiebreakerVotes = {}
        }

        this.activeSession.tiebreakerVotes[optionId] = []
      }

      this.activeSession.tiebreakerVotes[optionId].push(teamId)
    } else {
      if (Object.values(this.activeSession.votes).find(votes => votes.includes(teamId))) {
        console.error(colorize('[VoteManager]', Fg.Green), 'Team already voted')
        return false
      }

      console.log(colorize('[VoteManager]', Fg.Green), `Team ${teamId} voted for option ${optionId}`)
      
      if (!this.activeSession.votes[optionId]) {
        this.activeSession.votes[optionId] = []
      }

      this.activeSession.votes[optionId].push(teamId)
    }

    Game.get().sendVoteSessionToClients()
    this.saveActiveSession()

    if (this.getVoteCount() === this.activeSession.totalPossibleVotes) {
      this.allVotesReceived()
    }

    return true
  }

  getVoteCount (option?: string) {
    if (!this.activeSession) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No active vote session while getting vote count')
      return
    }

    if (this.activeSession.isTiebreaker) {
      if (option) {
        return this.activeSession.tiebreakerVotes?.[option]?.length || 0
      }

      return this.activeSession.tiebreakerVotes
        ? Object.values(this.activeSession.tiebreakerVotes).reduce((acc, votes) => acc + votes.length, 0)
        : 0
    }

    if (option) {
      return this.activeSession.votes[option]?.length || 0
    }

    return Object.values(this.activeSession.votes).reduce((acc, votes) => acc + votes.length, 0)
  }

  getResults (): VoteResults | undefined {
    if (!this.activeSession) {
      console.error(colorize('[VoteManager]', Fg.Green), 'No active vote session while getting results')
      return
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Get results')

    let votes: Record<string, number> = {}
    if (this.activeSession.isRandom) {
      return {
        votes: {},
        winners: [],
        next: null,
        finalWinner: this.voteOptions.find(o => o.id === this.activeSession!.winner)
      } satisfies VoteResults
    } else if (this.activeSession.isTiebreaker) {
      votes = Object.fromEntries(
        this.activeSession.tiebreakerCandidates
          ?.map((optionId) => [optionId, this.activeSession!.tiebreakerVotes?.[optionId]?.length || 0]) || []
      )
    } else {
      votes = Object.fromEntries(
        this.activeSession.candidateIds
          .map((optionId) => [optionId, this.activeSession!.votes[optionId]?.length || 0])
      )
    }

    console.log(colorize('[VoteManager]', Fg.Green), 'Votes', votes)

    const maxVotes = Math.max(...Object.values(votes))
    const winners = Object.keys(votes)
      .filter((key) => votes[key] === maxVotes)

    console.log(colorize('[VoteManager]', Fg.Green), 'Winners', winners)

    const next = winners.length > 1
      ? (
        this.activeSession.isTiebreaker
          ? 'random'
          : 'tiebreaker'
      )
      : null

    const results: VoteResults = {
      votes,
      winners,
      next,
      finalWinner: winners.length === 1
        ? this.voteOptions.find(o => o.id === winners[0])
        : undefined
    }

    return results
  }

  allVotesReceivedListeners: (() => void)[] = []
  allVotesReceived () {
    if (this.activeSession?.autoClose) {
      this.allVotesReceivedListeners.forEach(listener => listener())
    }
  }
  onAllVotesReceived (listener: () => void) {
    this.allVotesReceivedListeners.push(listener)
    return () => this.offAllVotesReceived(listener)
  }
  onceAllVotesReceived (listener: () => void) {
    const off = this.onAllVotesReceived(() => {
      off()
      listener()
    })
    return off
  }
  offAllVotesReceived (listener: () => void) {
    this.allVotesReceivedListeners = this.allVotesReceivedListeners.filter(l => l !== listener)
  }
}