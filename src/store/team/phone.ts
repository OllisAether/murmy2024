import { computed } from "@vue/reactivity";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePhone = defineStore('phone', () => {
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
  

  // #region Pin
  const locked = ref(true)

  const pin = import.meta.env.VITE_PIN as string
  const pinTimeoutSeconds = ref(0)
  const pinUnlockedAt = ref(0)
  const pinTries = ref(0)

  watch(pinUnlockedAt, () => {
    if (pinUnlockedAt.value > Date.now()) {
      startTimeoutCounter()
    }
  }, { immediate: true })

  watch(pinTries, () => {
    if (pinTries.value > 0) {
      setTimeout(() => {
        pinTries.value = 0
      }, 1000 * 60) // 1 minute
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

  function unlockPhone (_pin: string) {
    if (pinUnlockedAt.value > Date.now()) {
      return false
    }

    if (pin === _pin) {
      locked.value = false
      pinTimeoutSeconds.value = 0
      pinUnlockedAt.value = 0
      pinTries.value = 0
      return true
    }

    pinTries.value++

    if (pinTries.value >= 3) {
      pinUnlockedAt.value = Date.now() + 1000 * 60 // 1 minute
    }
    return false
  }
  // #endregion

  // #region Navigation
  const currentApp = ref<string>('home')
  const paths = ref<Record<string, string[]>>({})
  const currentPath = computed(() => paths.value[currentApp.value] ?? [])

  function homeBtn () {
    openApp('home')
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
    currentPath.value.join('/').startsWith(targetPath.join('/'))
  }

  function openApp (appName: string, ...path: string[]) {
    currentApp.value = appName
    
    if (!paths.value[appName]) {
      paths.value[appName] = []
    }

    paths.value[appName] = path
  }

  function closeApp (appName: string) {
    if (currentApp.value === appName) {
      currentApp.value = 'home'
    }

    delete paths.value[appName]
  }
  // #endregion

  // #region Save to localStorage
  function saveToLocalStorage () {
    sessionStorage.setItem('phone', JSON.stringify({
      locked: locked.value,
      pinTries: pinTries.value,
      pinUnlockedAt: pinUnlockedAt.value,

      currentApp: currentApp.value,
      paths: paths.value,
    }))
  }
  usePhone().$subscribe(saveToLocalStorage)

  function loadFromLocalStorage () {
    const data = localStorage.getItem('phone')
    if (data) {
      try {
        const json = JSON.parse(data)
        locked.value = json.locked ?? true
        pinTries.value = json.pinTries ?? 0
        pinUnlockedAt.value = json.pinUnlockedAt ?? 0

        currentApp.value = json.currentApp ?? 'home'
        paths.value = json.paths ?? {}
      } catch (error) {
        console.error('Error while loading phone data from localStorage', error)
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
    unlockPhone,

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
    
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})