import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { ref } from "vue";
import { assets } from "../assets/assets";
import { files as fAsset } from "../assets/files";
import { File } from "../../shared/files/file";
import { UAParser } from "ua-parser-js";

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  function initGameManager () {
    console.log('GameManager initialized')

    preloadAssets()
  }

  function deinitGameManager () {
    console.log('GameManager deinitialized')
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
    loaded: assets.length === 0,
    loadedAssets: 0,
    totalAssets: assets.length
  })
  function preloadAssets () {
    console.log('Preloading assets', assets)

    return new Promise<void>((resolve) => {
    function finishAsset () {
      assetsProgress.value.loadedAssets++

      if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
        assetsProgress.value.loaded = true
        resolve()
      }
    }

      for (const asset of assets) {
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
    return assets.find(asset => asset.name === name)
  }
  // #endregion

  // #region Suspect Database
  
  // #endregion

  // #region Files
  const files = ref<File[]>(fAsset)
  // #endregion

  return {
    initGameManager,
    deinitGameManager,
    canFullscreen,
    toggleFullscreen,
    getHelp,
    assetsProgress,
    preloadAssets,
    getAsset,
    files,
    isFullscreen
  }
})