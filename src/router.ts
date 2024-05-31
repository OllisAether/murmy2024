import { createRouter, createWebHistory } from "vue-router"
import { useAuthManager } from "./store/authManager"
import { watch } from "vue"
import { Role } from "../shared/roles"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "login",
      path: "/login/:code?",
      component: () => import("./pages/LoginPage.vue"),

      meta: {
        allowedRoles: [Role.Unauthorized],
      },
    },
    {
      name: "team",
      path: "/team",
      redirect: "/team/home",
      component: () => import("./pages/team/MainPage.vue"),

      meta: {
        allowedRoles: [Role.Team],
      },

      children: [
        {
          path: "home",
          component: () => import("./pages/team/Home.vue"),
        },
        {
          path: 'workspace',
          component: () => import("./pages/team/Workspace.vue"),
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
        }
      ],
    },
    {
      name: "adminLogin",
      path: "/admin/login",
      component: () => import("./pages/admin/AdminLoginPage.vue"),

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
      watch(() => auth.loading, () => {
        if (!auth.loading) resolve()
      }, { once: true })
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

export default router
