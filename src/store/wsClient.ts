import { defineStore } from "pinia";
import { ref } from "vue";
import { Game } from '@/server/game/game'
// import { WebSocketClient } from "@/server/clients/client";
import { TeamClient } from "@/server/clients/teamClient";

export const useWsClient = defineStore('wsClient', () => {
  const ws = ref<{
    send: (data: string) => void,
  } | null>(null)

  const status = ref<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>('disconnected')

  function connect() {
    if (ws.value) {
      return
    }

    status.value = 'connecting'

    const game = Game.get()
    const team = game.getTeam()
    const sendListener: ((data: string) => void)[] = []
    const client = new TeamClient((onSend) => {
      sendListener.push(onSend)
    }, 'demo', team.id, team.name)

    client.onSend(handleMessage)
    game.setClient(client)

    ws.value = {
      send: (data: string) => {
        console.log('%c[WebSocket]', 'color: purple', data)
        sendListener.forEach((listener) => listener(data))
      }
    }

    console.log(game.cueManager)
    if (game.cueManager.currentPlaybackIndex.value === -1) {
      game.cueManager.setCurrentPlayback(0)
      game.cueManager.nextCue()
    }

    status.value = 'connected'
  }

  // function disconnect() {
  //   return new Promise<void>((resolve) => {
  //     ws.value?.addEventListener('close', () => {
  //       resolve()
  //     })
  //     ws.value?.close(
  //       1000,
  //       'Client closed connection'
  //     )
  //   })
  // }

  const messageListeners = ref<((data: any) => void)[]>([])
  function onMessage(callback: (data: any) => void) {
    messageListeners.value.push(callback)
    return () => offMessage(callback)
  }

  function offMessage(callback: (data: any) => void) {
    const index = messageListeners.value.indexOf(callback)
    if (index !== -1) {
      messageListeners.value.splice(index, 1)
    }
  }

  function handleMessage(rawData: string) {
    try {
      const data = JSON.parse(rawData)
      console.log('%c[WebSocket]', 'color: purple', data)

      // send('ACK', { action: data.action })

      messageListeners.value.forEach((listener) => listener(data))
    } catch (e) {
      console.error('%c[WebSocket]', 'color: purple', e)
    }
  }

  function onAction(action: string, callback: (data: any) => void) {
    return onMessage((data) => {
      if (data.action === action) {
        callback(data.payload)
      }
    })
  }

  function send (action: string, payload?: any) {
    ws.value?.send(JSON.stringify({ action, payload }))
  }

  function request (action: string, payload?: any) {
    return new Promise<any>((resolve) => {
      const offMessage = onMessage((data) => {
        if (data.action === `${action}:response`) {
          offMessage()
          resolve(data.payload)
        }
      })

      send(action, payload)
    })
  }

  // async function get(channel: string) {
  //   return await fetch(`/api/${channel}`)
  // }

  // async function post(channel: string, payload: any) {
  //   return await fetch(`/api/${channel}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   })
  // }

  function once (action: string) {
    return new Promise<any>((resolve) => {
      const off = onAction(action, (data) => {
        off()
        resolve(data)
      })
    })
  }

  return {
    ws,
    connect,
    // disconnect,
    onMessage,
    offMessage,
    onAction,
    send,
    request,
    // get,
    // post,
    status,
    once
  }
})