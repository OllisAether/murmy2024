import { defineStore } from "pinia";
import { useWsClient } from "./wsClient";

export const useGameManager = defineStore('gameManager', () => {
  const ws = useWsClient()

  function initGameManager () {
    console.log('GameManager initialized')
  }

  function deinitGameManager () {
    console.log('GameManager deinitialized')
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
    getHelp
  }
})