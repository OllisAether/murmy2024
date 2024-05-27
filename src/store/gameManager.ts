import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";
import { ref, watch } from "vue";
import { assets } from "../assets/assets";

export interface Assets {
  type: 'image' | 'audio' | 'video' | 'font' | 'json'
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

      for (const asset of assets) {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', asset.url, true)
        xhr.responseType = asset.type === 'json' ? 'json' : 'blob'

        xhr.onload = function () {
          if (xhr.status === 200) {
            if (asset.type === 'json') {
              asset.content = xhr.response
            } else {
              const url = URL.createObjectURL(xhr.response)
              asset.content = url
            }
          }

          assetsProgress.value.loadedAssets++

          if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
            assetsProgress.value.loaded = true
            resolve()
          }
        }

        xhr.onerror = function () {
          console.error('Failed to load asset', asset.url)

          assetsProgress.value.loadedAssets++

          if (assetsProgress.value.loadedAssets === assetsProgress.value.totalAssets) {
            assetsProgress.value.loaded = true
            resolve()
          }
        }

        xhr.send()
      }
    })
  }

  function getAsset (name: string) {
    return assets.find(asset => asset.name === name)
  }
  
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

  return {
    initGameManager,
    deinitGameManager,
    getHelp,
    preloadAssets,
    getAsset,
    assetsProgress,
  }
})