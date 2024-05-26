import { defineStore } from "pinia";
import { ref } from "vue";
import { useWsClient } from "./wsClient";
import router from "../router";
import { Role } from "../../shared/roles";

export const useAuthManager = defineStore('authManager', () => {
  const wsClient = useWsClient()

  const loading = ref(true)
  const team = ref<{
    id: string
    name: string
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
            router.push('/login')
        }
      } catch (e) {
        console.error(e)
        role.value = Role.Unauthorized
        router.push('/login')
      }
    } else {
      role.value = Role.Unauthorized
      router.push('/login')
    }
    loading.value = false
  })

  wsClient.onAction('auth', async (data: {
    type: Role,
    teamId?: string,
    teamName?: string,
    teamCode?: string,
    password?: string
  }) => {
    switch (data.type) {
      case Role.Admin:
        role.value = Role.Admin
        router.push('/admin')
        break
      case Role.Board:
        role.value = Role.Board
        localStorage.setItem('savedCred', JSON.stringify({
          type: Role.Board,
          pw: data.password
        }))
        router.push('/board')
        break
      case Role.Team:
        role.value = Role.Team
        team.value = {
          id: data.teamId ?? '',
          name: data.teamName ?? ''
        }
        localStorage.setItem('savedCred', JSON.stringify({
          type: Role.Team,
          pw: data.teamCode
        }))
        router.push('/team')
        break
      default:
        team.value = null
        role.value = Role.Unauthorized
        router.push('/login')
    }
  })

  wsClient.onAction('logout', logout)

  const loginLoading = ref(false)
  const loginError = ref<string | null>(null)
  async function loginTeam (code: string) {
    if (!code || code.length !== 6) {
      loginError.value = 'Bitte 6-stelligen Code eingeben'
      return
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
        break
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
    router.push('/login')

    await wsClient.disconnect()

    // setTimeout(() => {
    wsClient.connect()
    // }, 1000)
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