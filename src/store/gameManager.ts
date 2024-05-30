import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { ref, watch } from "vue";
import { assets } from "../assets/assets";

export interface Assets {
  type: 'image' | 'audio' | 'video'
  name: string
  url: string
  content?: any
}

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  function initGameManager () {
    console.log('GameManager initialized')

    preloadAssets()
  }

  function deinitGameManager () {
    console.log('GameManager deinitialized')
  }

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
    console.log('Preloading assets')


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

        xhr.onload = function () {
          if (xhr.status === 200) {
            const blob = xhr.response

            const objectURL = URL.createObjectURL(blob)
            const content = new Image()

            content.src = objectURL

            content.onload = function () {
              asset.content = content
            }

            asset.content = content
          }

          finishAsset()
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

  return {
    initGameManager,
    deinitGameManager,
    getHelp,
    assetsProgress,
    preloadAssets,
    getAsset,
  }
})