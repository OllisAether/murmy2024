
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWsClient } from "./wsClient";
import { Role } from "../../shared/roles";
import { idGen } from "../../shared/random";

export interface AlertOptions {
  id: string
  icon: string | null
  title: string | null
  message: string | null
  closable: boolean
  closeAfter?: number
  close?: () => void
  type: 'info' | 'warning' | 'error' | 'success' | 'default'
}

export const useAdmin = defineStore('admin', () => {
  const ws = useWsClient()

  let actions: (() => void)[] = []
  function initAdmin () {
    console.log('Admin initialized')

    actions = [
      ws.onAction('teams', (t) => {
        teams.value = t
      }),
      ws.onAction('clients', (c) => {
        console.log('Clients', c)
        clients.value = c
      }),
      ws.onAction('helpRequests', (n: string[]) => {
        const newAlerts = n.filter((id) => !needsHelp.value.includes(id))
        const removedAlerts = needsHelp.value.filter((id) => !n.includes(id))

        needsHelp.value = n
        
        newAlerts.forEach(teamId => {
          const team = teams.value.find(team => team.id === teamId)

          if (!team) return
          alert(
            {
              title: `"${team.name}" fordert Hilfe an`,
              id: `help:${teamId}`,
              closable: true,
              type: 'warning'
            }
          )
        })

        removedAlerts.forEach((teamId) => {
          closeAlert(`help:${teamId}`)
        })
      })
    ]

    ws.send('getTeams')
    ws.send('getClients')
    ws.send('getHelpRequests')
  }

  function deinitAdmin () {
    console.log('Admin deinitialized')

    actions.forEach((a) => a())
  }

  // #region Team management
  const teams = ref<{
    id: string
    name: string
    code: string
  }[]>([])

  async function addTeam (team: {
    name: string
    code: string
  }) {
    const res = await ws.request('addTeam', team)

    if (!res.success) {
      console.error('Failed to add team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function editTeam (team: {
    id: string
    name: string
    code: string
  }) {
    const res = await ws.request('editTeam', team)

    if (!res.success) {
      console.error('Failed to edit team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function removeTeam (id: string) {
    const res = await ws.request('removeTeam', { id })

    if (!res.success) {
      console.error('Failed to remove team', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }
  // #endregion

  // #region Client management
  const clients = ref<{
    id: string
    type: Role
    teamId: string | null
    userAgent: string
  }[]>([])

  async function kickClient (id: string) {
    const res = await ws.request('kickClient', { id })

    if (!res.success) {
      console.error('Failed to kick client', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  async function logoutClient (id: string) {
    const res = await ws.request('logoutClient', { id })

    if (!res.success) {
      console.error('Failed to logout client', res.message)
      return {
        success: false,
        message: res.message as string
      }
    }

    return { success: true }
  }

  function setClientTeam (clientId: string, teamId: string) {
    ws.send('setClientTeam', { clientId, teamId })
  }

  function setClientBoard (clientId: string) {
    ws.send('setClientBoard', { clientId })
  }
  // #endregion

  // #region Help
  const needsHelp = ref<string[]>([])

  function removeHelpRequest (teamId: string) {
    ws.send('removeHelpRequest', { teamId })
  }
  // #endregion

  // #region Alerts
  const alerts = ref<AlertOptions[]>([])
  
  function alert (options: Partial<AlertOptions> = {}) {
    const opt: AlertOptions = {
      id: options.id ?? idGen(),
      title: options.title ?? null,
      message: options.message ?? null,
      icon: options.icon ?? null,
      closable: options.closable ?? true,
      closeAfter: options.closeAfter ?? 5000,
      close: options.close,
      type: options.type ?? 'default'
    }

    alerts.value.push(opt)

    opt.closeAfter && setTimeout(() => {
      closeAlert(opt.id)
    }, opt.closeAfter + 500)
  }

  function closeAlert (id: string) {
    alerts.value = alerts.value.filter((a) => a.id !== id)
  }

  // #endregion

  return {
    initAdmin,
    deinitAdmin,
    addTeam,
    editTeam,
    removeTeam,
    kickClient,
    logoutClient,
    setClientTeam,
    setClientBoard,
    removeHelpRequest,
    needsHelp,
    teams,
    clients,
    alerts,
    alert
  }
})