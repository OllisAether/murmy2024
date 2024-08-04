import { computed } from "@vue/reactivity";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const usePhone = defineStore('phone', () => {
  // #region Pin
  const locked = ref(true)

  const pin = '1234'
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
  }

  function backBtn () {
    popPath()
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
    localStorage.setItem('phone', JSON.stringify({
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
    locked,
    pinTimeoutSeconds,
    pinUnlockedAt,
    pinTries,
    stopTimeoutCounter,
    startTimeoutCounter,
    unlockPhone,

    homeBtn,
    backBtn,

    currentApp,
    paths,
    currentPath,
    openApp,
    closeApp,

    pushPath,
    popPath,
    popUntilPath,
    isPath,
    isPathLoose,
    
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})