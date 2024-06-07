import { defineStore } from "pinia";
import { ref } from "vue";

export const useWsClient = defineStore('wsClient', () => {
  const ws = ref<WebSocket | null>(null)

  const secure = window.location.protocol === 'https:'

  const status = ref<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>('disconnected')

  function connect(i = 0) {
    if (ws.value) {
      return
    }

    status.value = 'connecting'

    
    ws.value = new WebSocket(`${secure ? 'wss' : 'ws'}://${window.location.host}/api/ws`)

    ws.value.addEventListener('open', () => {
      console.log('%c[WebSocket]', 'color: purple', 'Connected')
      status.value = 'connected'
    })

    ws.value.addEventListener('close', (e) => {
      console.log('%c[WebSocket]', 'color: purple', 'Disconnected')
      ws.value = null

      if (e.code === 1000) {
        status.value = 'disconnected'
        return
      }
      
      if (i > 5) {
        status.value = 'disconnected'
        return
      }

      status.value = 'reconnecting'
      setTimeout(() => connect(i + 1), 3000)
    })

    ws.value.addEventListener('message', handleMessage)

    ws.value.addEventListener('error', (e) => {
      console.error('%c[WebSocket]', 'color: purple', e)
    })
  }

  function disconnect() {
    return new Promise<void>((resolve) => {
      ws.value?.addEventListener('close', () => {
        resolve()
      })
      ws.value?.close(
        1000,
        'Client closed connection'
      )
    })
  }

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

  function handleMessage(event: MessageEvent) {
    
    try {
      const data = JSON.parse(event.data)
      console.log('%c[WebSocket]', 'color: purple', data)
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

  async function get(channel: string) {
    return await fetch(`/api/${channel}`)
  }

  async function post(channel: string, payload: any) {
    return await fetch(`/api/${channel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

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
    disconnect,
    onMessage,
    offMessage,
    onAction,
    send,
    request,
    get,
    post,
    status,
    once
  }
})