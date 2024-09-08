import { createRouter, createWebHistory } from "vue-router"
import { useAuthManager } from "./store/authManager"
import { watch } from "vue"
import { Role } from "../shared/roles"
import LoginPage from "./pages/LoginPage.vue"
import { Phase } from "../shared/phase"
import { useGameManager } from "./store/gameManager"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "login",
      path: "/login/:code?",
      component: LoginPage,

      meta: {
        allowedRoles: [Role.Unauthorized],
      },
    },
    {
      name: "team",
      path: "/team",
      redirect () {
        const game = useGameManager()

        switch (game.phase.type) {
          case Phase.Idle:
            return "/team/home"
          case Phase.Work:
            return "/team/workspace"
          case Phase.Vote:
            return "/team/vote"
          default:
            return "/team/home"
        }
      },
      component: () => import("./pages/team/MainPage.vue"),

      meta: {
        allowedRoles: [Role.Team],
      },

      children: [
        {
          path: "home",
          component: () => import("./pages/team/Home.vue"),

          meta: {
            phase: Phase.Idle,
          }
        },
        {
          name: "workspace",
          path: 'workspace',
          component: () => import("./pages/team/Workspace.vue"),

          meta: {
            phase: Phase.Work,
          },
        },
        {
          path: "vote",
          component: () => import("./pages/team/Vote.vue"),

          meta: {
            phase: Phase.Vote,
          }
        }
      ]
    },
    {
      name: "admin",
      path: "/admin",
      redirect: '/admin/dashboard',
      component: () => import("./pages/admin/AdminPage.vue"),

      meta: {
        allowedRoles: [Role.Admin],
      },

      children: [
        {
          path: "dashboard",
          component: () => import("./pages/admin/Dashboard.vue"),
          meta: {
            title: "Dashboard"
          },
        },
        {
          path: "teams",
          component: () => import("./pages/admin/Teams.vue"),
          meta: {
            title: "Teams"
          },
        },
        {
          path: "clients",
          component: () => import("./pages/admin/Clients.vue"),
          meta: {
            title: "Clients"
          },
        },
        {
          path: "playbacks",
          component: () => import("./pages/admin/Playbacks.vue"),
          meta: {
            title: "Playbacks"
          },
        },
        {
          path: "pools",
          component: () => import("./pages/admin/VotePools.vue"),
          meta: {
            title: "Pools"
          },
        },
        {
          path: "candidates",
          component: () => import("./pages/admin/VoteOptions.vue"),
          meta: {
            title: "Kandidaten"
          },
        },
        {
          path: "media",
          component: () => import("./pages/admin/Media.vue"),
          meta: {
            title: "Media"
          },
        },
        {
          path: "suspectDatabases",
          component: () => import("./pages/admin/SuspectDatabases.vue"),
          meta: {
            title: "Verdächtigendatenbanken"
          },
        },
        {
          path: "clues",
          component: () => import("./pages/admin/Clues.vue"),
          meta: {
            title: "Hinweise"
          },
        },
        {
          path: "forms",
          component: () => import("./pages/admin/Forms.vue"),
          meta: {
            title: "Lösungsbögen"
          },
        }
      ],
    },
    {
      name: "adminLogin",
      path: "/admin/login",
      component: () => import("./pages/AdminLoginPage.vue"),

      meta: {
        allowedRoles: [Role.Unauthorized],
      },
    },
    {
      name: "board",
      path: '/board',
      component: () => import("./pages/board/BoardPage.vue"),

      meta: {
        allowedRoles: [Role.Board],
      }
    },
    {
      path: '/:pathMatch(.*)',
      redirect () {
        const auth = useAuthManager()

        switch (auth.role) {
          case Role.Admin:
            return "/admin"
          case Role.Board:
            return "/board"
          case Role.Team:
            return "/team"
          default:
            return "/login"
        }
      }
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  // console.log("Before each", to)
  const auth = useAuthManager()

  // Wait for the auth to be loaded
  if (auth.loading) {
    console.log("Waiting for auth to load")
    await new Promise<void>((resolve) => {
      const off = watch(() => auth.loading, () => {
        if (!auth.loading) {
          off()
          resolve()
        }
      }, { immediate: true })
    })
  }

  const allowedRoles = (to.meta.allowedRoles as Role[]) ?? null
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    console.log("Unauthorized access", auth.role, allowedRoles)

    switch (auth.role) {
      case Role.Admin:
        next("/admin")
        break
      case Role.Board:
        next("/board")
        break
      case Role.Team:
        next("/team")
        break
      default:
        if (to.path.startsWith("/admin")) {
          next("/admin/login")
        } else {
          next("/login")
        }
    }
  } else {
    console.log("Authorized access", to, auth.role, allowedRoles)
    next()
  }
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthManager()

  if (auth.role === Role.Team) {
    const game = useGameManager()

    if (!game.initialized || game.loading) {
      console.log("Waiting for game to load")
      if (!game.initialized) {
        game.initGameManager()
      }

      await new Promise<void>((resolve) => {
        const off = watch(() => game.loading, () => {
          if (!game.loading) {
            off()
            resolve()
          }
        }, { immediate: true})
      })
    }

    console.log("Phase check", to.meta.phase, game.phase.type)

    if (to.meta.phase && Array.isArray(to.meta.phase)
      ? !to.meta.phase.includes(game.phase.type)
      : (to.meta.phase !== game.phase.type)
    ) {
      next("/team")
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router
