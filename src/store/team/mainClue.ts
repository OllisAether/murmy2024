import { computed } from "@vue/reactivity";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useGameManager } from "../gameManager";

export const useMainClue = defineStore('mainClue', () => {
  const game = useGameManager()
  // #region Pin
  const locked = ref(!game.clues.mainClueUnlocked)
  watch(() => game.clues.mainClueUnlocked, (value) => {
    locked.value = !value
  })

  const pin = import.meta.env.VITE_PIN as string
  const pinTimeoutSeconds = ref(0)
  const pinUnlockedAt = ref(0)
  const pinTries = ref(0)
  const pinTimeoutDuration = 1000 * 30

  watch(pinUnlockedAt, () => {
    if (pinUnlockedAt.value > Date.now()) {
      startTimeoutCounter()
    }
  }, { immediate: true })

  watch(pinTries, () => {
    if (pinTries.value > 0) {
      setTimeout(() => {
        pinTries.value = 0
      }, pinTimeoutDuration)
    }
  }, { immediate: true })

  let pinTimeoutInterval: number | null = null
  function stopTimeoutCounter () {
    if (pinTimeoutInterval) {
      clearInterval(pinTimeoutInterval)
      pinTimeoutInterval = null
      pinTries.value = 0
    }
  }

  function startTimeoutCounter () {
    stopTimeoutCounter()

    pinTimeoutSeconds.value = Math.max(0, Math.ceil((pinUnlockedAt.value - Date.now()) / 1000))

    pinTimeoutInterval = setInterval(() => {
      pinTimeoutSeconds.value = Math.max(0, Math.ceil((pinUnlockedAt.value - Date.now()) / 1000))
      if (pinTimeoutSeconds.value <= 0) {
        stopTimeoutCounter()
      }
    }, 1000) as any
  }

  function unlock (_pin: string) {
    if (pinUnlockedAt.value > Date.now()) {
      return false
    }

    if (pin === _pin) {
      if (!locked.value) {
        return true
      }

      game.setMainClueUnlocked(true)
      locked.value = false
      pinTimeoutSeconds.value = 0
      pinUnlockedAt.value = 0
      pinTries.value = 0
      return true
    }

    if (!locked.value) {
      return false
    }

    pinTries.value++

    if (pinTries.value >= 3) {
      pinUnlockedAt.value = Date.now() + pinTimeoutDuration
    }
    return false
  }
  // #endregion

  // #region Phone
  const clock = ref('00:00')
  const date = (() => {
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  
    const date = new Date()
    date.setFullYear(2013)
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const weekday = weekdays[date.getDay()]
  
    return `${weekday}, ${day}. ${month} ${year}`
  })()

  interface Alert {
    title: string
    message: string
    actions: {
      text: string
      callback: () => void
    }[]
  }

  // #region Alert
  const alert = ref<Alert | null>(null)
  function showAlert (opt: Partial<Alert>) {
    const options = {
      title: opt.title ?? 'Alert',
      message: opt.message ?? '',
      actions: opt.actions ?? [
        {
          text: 'Ok',
          callback: () => dismissAlert()
        }
      ]
    }

    alert.value = options
  }

  function dismissAlert () {
    alert.value = null
  }
  // #endregion

  // #region CrashApp
  function openCrashApp (appName: string) {
    openApp('crash')

    setTimeout(() => {
      if (currentApp.value !== 'crash') {
        return
      }

      openApp('home')
      showAlert({
        title: `${appName} ist abgestürzt`,
        message: 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      })
    }, 500)
  }
  // #endregion

  // #region Navigation
  const currentApp = ref<string>('home')
  const paths = ref<Record<string, string[]>>({})
  const currentPath = computed(() => paths.value[currentApp.value] ?? [])

  function homeBtn () {
    if (currentApp.value === 'home') {
      openApp('home', [])
    } else {
      openApp('home')
    }
    homeBtnListeners.forEach(listener => listener())
  }

  const homeBtnListeners: (() => void)[] = []
  function onHomeBtn (callback: () => void) {
    homeBtnListeners.push(callback)
    return () => offHomeBtn(callback)
  }
  function offHomeBtn (callback: () => void) {
    const index = homeBtnListeners.indexOf(callback)
    if (index !== -1) {
      homeBtnListeners.splice(index, 1)
    }
  }
  function onceHomeBtn (callback: () => void) {
    const off = onHomeBtn(() => {
      off()
      callback()
    })

    return
  }

  function backBtn () {
    popPath()
    backBtnListeners.forEach(listener => listener())
  }

  const backBtnListeners: (() => void)[] = []
  function onBackBtn (callback: () => void) {
    backBtnListeners.push(callback)
    return () => offBackBtn(callback)
  }
  function offBackBtn (callback: () => void) {
    const index = backBtnListeners.indexOf(callback)
    if (index !== -1) {
      backBtnListeners.splice(index, 1)
    }
  }
  function onceBackBtn (callback: () => void) {
    const off = onBackBtn(() => {
      off()
      callback()
    })

    return
  }

  function pushPath (...path: string[]) {
    currentPath.value.push(...path)
  }

  function popPath () {
    if (currentPath.value.length === 0) {
      openApp('home')
      return
    }

    currentPath.value.pop()
  }

  function popUntilPath (targetPath: string) {
    while (currentPath.value.length > 0 && currentPath.value[currentPath.value.length - 1] !== targetPath) {
      currentPath.value.pop()
    }
  }

  function setPath (...path: string[]) {
    paths.value[currentApp.value] = path
  }

  function isPath (...targetPath: string[]) {
    return currentPath.value.join('/') === targetPath.join('/')
  }

  function isPathLoose (...targetPath: string[]) {
    return currentPath.value.join('/').startsWith(targetPath.join('/'))
  }

  function openApp (appName: string, path?: string[]) {
    currentApp.value = appName
    
    if (!paths.value[appName]) {
      paths.value[appName] = []
    }

    if (path) {
      paths.value[appName] = path
    }
  }

  function closeApp (appName: string) {
    if (currentApp.value === appName) {
      currentApp.value = 'home'
    }

    delete paths.value[appName]
  }
  // #endregion
  // #endregion

  // #region Diary
  const page = ref(0)
  const diaryPinState = ref('0000')
  // #endregion

  // #region Save to localStorage
  function saveToLocalStorage () {
    localStorage.setItem('mainClue', JSON.stringify({
      pinTries: pinTries.value,
      pinUnlockedAt: pinUnlockedAt.value,

      currentApp: currentApp.value,
      paths: paths.value,

      page: page.value,
      diaryPinState: diaryPinState.value,
    }))
  }
  useMainClue().$subscribe(saveToLocalStorage)

  function loadFromLocalStorage () {
    const data = localStorage.getItem('mainClue')
    if (data) {
      try {
        const json = JSON.parse(data)
        pinTries.value = json.pinTries ?? 0
        pinUnlockedAt.value = json.pinUnlockedAt ?? 0

        currentApp.value = json.currentApp ?? 'home'
        paths.value = json.paths ?? {}

        page.value = json.page ?? 0
        diaryPinState.value = json.diaryPinState ?? '0000'
      } catch (error) {
        console.error('Error while loading mainClue data from localStorage', error)
      }
    }
  }

  loadFromLocalStorage()
  // #endregion

  return {
    clock,
    date,
    locked,
    pinTimeoutSeconds,
    pinUnlockedAt,
    pinTries,
    stopTimeoutCounter,
    startTimeoutCounter,
    unlock,

    // #region Phone
    alert,
    showAlert,
    dismissAlert,

    openCrashApp,

    homeBtn,
    onHomeBtn,
    offHomeBtn,
    onceHomeBtn,
    backBtn,
    onBackBtn,
    offBackBtn,
    onceBackBtn,

    currentApp,
    paths,
    currentPath,
    openApp,
    closeApp,

    pushPath,
    popPath,
    popUntilPath,
    setPath,
    isPath,
    isPathLoose,
    // #endregion

    // #region Diary
    page,
    diaryPinState,
    // #endregion

    saveToLocalStorage,
    loadFromLocalStorage,
  }
})