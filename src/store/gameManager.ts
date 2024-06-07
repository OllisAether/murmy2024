import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { computed, readonly, ref, watch } from "vue";
import { boardAssets, teamAssets } from "../assets/assets";
import { files as fAsset } from "../assets/files";
import { UAParser } from "ua-parser-js";
import { accounts, chats } from "@/assets/chats";
import { people } from "@/assets/people";
import { ProfileEntryType, SuspectEntry, SuspectProfile } from "@/model/database/suspectProfile";
import { Asset } from "@/model/asset";
import { useAuthManager } from "./authManager";
import { Role } from "../../shared/roles";
import { Phase } from "../../shared/phase";
import { File } from "@/model/files/file";

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  const loading = ref(false)
  const initialized = ref(false)
  async function initGameManager () {
    if (initialized.value) return
    if (loading.value) return

    loading.value = true

    const auth = useAuthManager()

    if (auth.loading) {
      await new Promise<void>(resolve => watch(auth, (value) => {
        if (!value.loading) {
          resolve()
        }
      }, { once: true }))
    }

    if (auth.role === Role.Unauthorized) {
      return
    }

    console.log('Initializing GameManager')

    await new Promise<void>(resolve => {
      ws.once('timer').then(resolve)
      ws.send('getTimer')
    })

    startTimeSync()
    syncTime()

    await new Promise<void>(resolve => {
      ws.once('phase').then(resolve)
      ws.send('getPhase')
    })

    switch (auth.role) {
      case Role.Team:
        await preloadAssets(teamAssets)
        break
      case Role.Board:
        await preloadAssets(boardAssets)
        break
    }

    loading.value = false
    initialized.value = true
    console.log('GameManager initialized')
  }

  function deinitGameManager () {
    console.log('GameManager deinitialized')

    stopTimerInterval()
    timer.value = {
      startTime: null,
      currentTime: 0,
      duration: 0,
      state: 'stopped'
    }

    stopTimeSync()
    timeSync.value = {
      ping: null,
      diff: 0
    }

    initialized.value = false
  }

  // #region Fullscreen
  const canFullscreen = ref(false)

  const ua = new UAParser(navigator.userAgent).getResult()

  console.log('User agent', ua)

  if (!(ua.browser.name === 'Safari' && ua.device.type === 'tablet') && ua.os.name !== 'iOS') {
    canFullscreen.value = true
  }

  const isFullscreen = ref(false)

  document.addEventListener('fullscreenchange', function () {
    isFullscreen.value = !!document.fullscreenElement
  })

  function toggleFullscreen () {
    if (!canFullscreen.value) {
      return
    }

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }
  // #endregion

  // #region Help
  async function getHelp () {
    const res = await ws.request('help')

    if (!res.success) {
      console.error('Failed to get help', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }
  // #endregion

  // #region Assets
  const assetsProgress = ref<{
    loaded: boolean
    loadedAssets: number
    totalAssets: number
  }>({
    loaded: false,
    loadedAssets: 0,
    totalAssets: 0
  })
  const assets = ref<Asset[]>([])
  function preloadAssets (_assets: Asset[]) {
    assetsProgress.value.loadedAssets = 0
    assetsProgress.value.totalAssets = _assets.length
    assetsProgress.value.loaded = _assets.length === 0

    assets.value = _assets.map(asset => ({
      ...asset,
      content: undefined
    }))

    return new Promise<void>((resolve) => {
      function finishAsset () {
        assetsProgress.value.loadedAssets++

        if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
          assetsProgress.value.loaded = true
          resolve()
        }
      }

      for (const asset of assets.value) {
        if (asset.content !== undefined) {
          finishAsset()
          continue
        }

        const xhr = new XMLHttpRequest()

        xhr.open('GET', asset.url, true)
        xhr.responseType = 'blob'

        xhr.onload = async function () {
          if (xhr.status === 200) {
            const blob = xhr.response

            const objectURL = URL.createObjectURL(blob)

            asset.content = objectURL
            console.log('Loaded asset', asset.url, objectURL)
            finishAsset()
          } else {
            console.error('Failed to load asset', asset.url)
            finishAsset()
          }
        }

        xhr.onerror = function () {
          console.error('Failed to load asset', asset.url)

          finishAsset()
        }

        xhr.send()
      }
    })
  }

  function getAsset (name: string) {
    return assets.value.find(asset => asset.name === name)
  }
  // #endregion

  // #region Timer
  const timer = ref<{
    startTime: number | null
    currentTime: number
    duration: number
    state: 'running' | 'paused' | 'stopped'
  }>({
    startTime: null,
    currentTime: 0,
    duration: 0,
    state: 'stopped'
  })
  const timeSync = ref<{
    ping: number | null
    diff: number
  }>({
    ping: null,
    diff: 0
  })

  try {
    const timeSyncData = JSON.parse(localStorage.getItem('timeSync') || '{}')

    timeSync.value = {
      ping: timeSyncData.ping,
      diff: timeSyncData.diff
    }
  } catch (e) {
    console.error('Failed to load time sync data', e)
  }
  watch(timeSync, (value) => {
    localStorage.setItem('timeSync', JSON.stringify(value))
  })

  ws.onAction('timer', (data: {
    startTime: number | null
    duration: number
    currentTime: number
    state: 'running' | 'paused' | 'stopped'
  }) => {
    console.log('Timer data', data)

    timer.value.startTime = data.startTime
    timer.value.duration = data.duration
    timer.value.state = data.state

    if (timer.value.state === 'running') {
      if (timerInterval === null) {
        startTimerInterval()
      }
    } else if (timer.value.state === 'stopped') {
      timer.value.currentTime = data.currentTime
      stopTimerInterval()
    } else if (timer.value.state === 'paused') {
      timer.value.currentTime = data.currentTime
      stopTimerInterval()
    } else {
      console.error('Invalid timer state', timer.value.state)
    }
  })

  let timerInterval: number | null = null
  function startTimerInterval () {
    function updateTimer () {
      if (timer.value.state !== 'running') {
        return
      }

      timerInterval = requestAnimationFrame(updateTimer)

      // console.log('Timer:', timer.value.currentTime)

      timer.value.currentTime = Math.max(0, Math.min(timer.value.duration, Date.now() - (timer.value.startTime || 0)))
    }

    timerInterval = requestAnimationFrame(updateTimer)
  }

  function stopTimerInterval () {
    if (timerInterval) {
      cancelAnimationFrame(timerInterval)
      timerInterval = null
    }
  }

  async function syncTime() {
    const pingStart = Date.now()

    const serverTime = await ws.request('timeSync')

    const pingEnd = Date.now()

    const ping = pingEnd - pingStart

    if (timeSync.value.ping && timeSync.value.ping < ping) {
      return
    }

    const clientTime = Date.now() - ping / 2

    const diff = serverTime - clientTime

    timeSync.value = {
      ping,
      diff
    }

    console.log('Time sync', timeSync.value)
  }

  let timeSyncTimeout: number | null = null
  function startTimeSync () {
    const upperBound = 30000
    const interval = Math.min(upperBound, (1 / (Math.sqrt(timeSync.value.ping ?? 100))) * upperBound)

    console.log('Time sync interval', interval)

    timeSyncTimeout = setTimeout(() => {
      syncTime()

      startTimeSync()
    }, interval) as unknown as number
  }

  function stopTimeSync () {
    if (timeSyncTimeout) {
      clearInterval(timeSyncTimeout)
      timeSyncTimeout = null
    }
  }
  // #endregion

  // #region Phases
  const phase = ref<Phase>(Phase.Idle)

  ws.onAction('phase', (data: Phase) => {
    phase.value = data
  })
  // #endregion

  // #region Suspect Database
  const suspects = ref<SuspectProfile[]>([])

  function getPerson (id: string) {
    return people.find(person => person.id === id)
  }

  function unlockSuspect (person: string) {
    const suspect = suspects.value.find(suspect => suspect.personId === person)

    if (suspect) {
      return
    }

    suspects.value.push({
      personId: person,
      basic: [],
      accounts: [],
      pictures: [],
      hobbies: []
    })
  }

  function addSuspectEntry (person: string, type: ProfileEntryType, entry: SuspectEntry, unlocksSuspect?: boolean) {
    const suspect = suspects.value.find(suspect => suspect.personId === person)

    if (!suspect) {
      if (unlocksSuspect) {
        unlockSuspect(person)
        return addSuspectEntry(person, type, entry)
      }

      return
    }

    suspect[type].push(entry)
  }

  function getSuspectEntry (person: string, type: ProfileEntryType, id: string) {
    const suspect = suspects.value.find(suspect => suspect.personId === person)

    if (!suspect) {
      return
    }

    return suspect[type].find(entry => entry.id === id)
  }

  function isSuspectUnlocked (person: string) {
    return suspects.value.find(suspect => suspect.personId === person) !== undefined
  }
  // #endregion

  // #region Files
  const files = ref<File[]>(fAsset)
  // #endregion

  // #region Chat
  const currentChatUser = ref<string | null>(localStorage.getItem('chatUser') || null)

  watch(currentChatUser, (user) => {
    localStorage.setItem('chatUser', user || '')
  })

  async function loginChat (phone: string, password: string) {
    const account = accounts.find(account => {
      const person = getPerson(account.personId)

      if (!person) {
        return false
      }

      // Replace Spaces, Dashes, etc. with nothing
      const personPhone = person.phone?.replace(/[\s-]/g, '')
      const _phone = phone.replace(/[\s-]/g, '')

      return personPhone === _phone && account.password === password
    })

    if (!account) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return false
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    currentChatUser.value = account.personId
    return true
  }

  function logoutChat () {
    currentChatUser.value = null
  }

  const visibleChats = computed(() => {
    const user = currentChatUser.value

    if (!user) {
      return []
    }

    return chats.filter(chat => chat.participants.includes(user))
  })

  function getChatAccount (personId: string) {
    return accounts.find(account => account.personId === personId)
  }
  // #endregion

  return {
    loading: readonly(loading),
    initialized: readonly(initialized),
    initGameManager,
    deinitGameManager,
    canFullscreen,
    toggleFullscreen,
    getHelp,
    assetsProgress,
    preloadAssets,
    getAsset,
    files,
    isFullscreen,
    suspects,
    unlockSuspect,
    addSuspectEntry,
    getSuspectEntry,
    isSuspectUnlocked,
    getPerson,
    currentChatUser,
    loginChat,
    visibleChats,
    logoutChat,
    getChatAccount,
    timer: readonly(timer),
    timeSync: readonly(timeSync),
    phase: readonly(phase)
  }
})