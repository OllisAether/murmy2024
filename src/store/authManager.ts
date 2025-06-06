import { defineStore } from "pinia";
import { ref } from "vue";
import { useWsClient } from "./wsClient";
import router from "../router";
import { Role } from "../../shared/roles";
import { JsonMap } from "../../shared/json";
import { codeLength } from "../../shared/teamcode";

export const useAuthManager = defineStore('authManager', () => {
  const wsClient = useWsClient()

  const loading = ref(true)
  const team = ref<{
    id: string
    name: string
    active: boolean
    meta: JsonMap
  } | null>(null)

  const role = ref<Role>(Role.Unauthorized)
  const clientId = ref<string | null>(null)

  wsClient.onAction('connected', async (payload: {
    id: string
  }) => {
    clientId.value = payload.id

    const cred = localStorage.getItem('savedCred')

    if (cred) {
      try {
        const { type, pw } = JSON.parse(cred)

        switch (type) {
          case Role.Admin:
          case Role.Board:
            await loginAdmin(type, pw)
            break
          case Role.Team:
            await loginTeam(pw)
            break
          default:
            role.value = Role.Unauthorized
        }
      } catch (e) {
        console.error(e)
        role.value = Role.Unauthorized
      }
    }
    loading.value = false
  })

  const viewport = document.querySelector('meta[name="viewport"]')
  const before = viewport?.getAttribute('content')

  wsClient.onAction('auth', async (data: {
    type: Role,
    teamId?: string,
    teamName?: string,
    teamActive?: boolean,
    teamMeta?: JsonMap,
    teamCode?: string,
    password?: string
  }) => {
    before && viewport?.setAttribute('content', before)

    switch (data.type) {
      case Role.Admin:
        role.value = Role.Admin
        if (router.currentRoute.value.matched
          .some(r => !(r.meta.allowedRoles as Role[])?.includes?.(Role.Admin))) {
          router.replace('/admin')
        }
        break
      case Role.Board:
        role.value = Role.Board
        localStorage.setItem('savedCred', JSON.stringify({
          type: Role.Board,
          pw: data.password
        }))
        if (router.currentRoute.value.name !== 'board') {
          router.replace('/board')
        }
        break
      case Role.Team:
        role.value = Role.Team
        team.value = {
          id: data.teamId ?? '',
          name: data.teamName ?? '',
          active: data.teamActive ?? true,
          meta: data.teamMeta ?? {}
        }
        localStorage.setItem('savedCred', JSON.stringify({
          type: Role.Team,
          pw: data.teamCode
        }))
        if (router.currentRoute.value.name !== 'team') {
          router.replace('/team')
        }

        if (window.outerWidth < 1366) {
          viewport?.setAttribute('content', 'width=1366, user-scalable=0')
        }
        break
      default:
        team.value = null
        role.value = Role.Unauthorized
        if (router.currentRoute.value.name !== 'login') {
          router.replace('/login')
        }
    }
  })

  wsClient.onAction('logout', logout)

  const loginLoading = ref(false)
  const loginError = ref<string | null>(null)
  async function loginTeam (code: string) {
    if (!code || code.length !== codeLength) {
      loginError.value = `Bitte ${codeLength}-stelligen Code eingeben`
      return false
    }

    loginLoading.value = true

    const res = await wsClient.post('login', {
      clientId: clientId.value,
      code
    })

    switch (res.status) {
      case 200:
        localStorage.setItem('savedCred', JSON.stringify({
          type: Role.Team,
          pw: code
        }))
        
        loginError.value = null
        loginLoading.value = false
        return true
      case 403:
        loginError.value = 'Ungültiger Code'
        break
      case 409:
        loginError.value = 'Team bereits angemeldet'
        break
      default:
        loginError.value = `Unbekannter Fehler: ${res.status} ${res.statusText}`
    }

    loginLoading.value = false
    return false
  }

  const adminLoginLoading = ref(false)
  const adminLoginError = ref<string | null>(null)
  async function loginAdmin (role: Role.Admin | Role.Board, password: string) {
    adminLoginLoading.value = true

    const res = await wsClient.post('admin/login', {
      role,
      password,
      clientId: clientId.value
    })

    switch (res.status) {
      case 200:
        localStorage.setItem('savedCred', JSON.stringify({
          type: role,
          pw: password
        }))

        adminLoginError.value = null
        break
      case 403:
        adminLoginError.value = 'Ungültiges Passwort'
        break
      default:
        adminLoginError.value = `Unbekannter Fehler: ${res.status} ${res.statusText}`
    }

    adminLoginLoading.value = false
  }

  async function logout () {
    localStorage.removeItem('savedCred')

    role.value = Role.Unauthorized
    team.value = null
    clientId.value = null
    router.replace('/login')

    await wsClient.disconnect()

    wsClient.connect()
  }

  return {
    loginTeam,
    loginAdmin,
    logout,
    team,
    role,
    loading,
    loginLoading,
    loginError,
    adminLoginLoading,
    adminLoginError,
    clientId
  }
})