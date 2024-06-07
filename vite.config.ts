import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import mkCert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    mkCert()
  ],
  build: {
    outDir: 'dist/client',

    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('/pages/admin')) {
            return 'admin'
          }
          if (id.includes('/pages/board')) {
            return 'board'
          }
          if (id.includes('/pages/team')) {
            return 'team'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
        // {
        //   team: [
        //     'src/pages/team/Workspace.vue',
        //     'src/pages/team/Home.vue',
        //     'src/pages/team/MainPage.vue',
        //     'src/pages/team/chat/Home.vue',
        //   ],
        //   admin: [
        //     'src/pages/admin/Dashboard.vue',
        //     'src/pages/admin/AdminPage.vue',
        //     'src/pages/admin/Teams.vue',
        //     'src/pages/admin/Clients.vue',
        //     'src/pages/admin/AdminLoginPage.vue',
        //   ],
        //   board: [
        //     'src/pages/board/BoardPage.vue',
        //   ],
        // }
      }
    },
  },
  server: {
    https: true,
    port: 80,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
