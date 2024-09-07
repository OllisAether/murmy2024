import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { configDotenv } from 'dotenv'
import mkCert from 'vite-plugin-mkcert'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

configDotenv({
  path: '.env'
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    svgLoader(),
    mkCert(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Murder Mystery Night',
        short_name: 'Murder Mystery Night',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [{ src: '/appicon.png' }]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    outDir: 'dist/client',

    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.endsWith('AdminLoginPage.vue')) {
            return 'adminLogin'
          }

          if (id.includes('/server')) {
            return 'server'
          }
          if (id.includes('/@vue') || id.includes('/vuetify')) {
            return 'vendor'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('/shared')) {
            return 'index'
            // return 'shared'
          }
          if (id.includes('/admin')) {
            return 'admin'
          }
          if (id.includes('/board')) {
            return 'board'
          }
          if (id.includes('/team')) {
            return 'team'
          }
          return 'index'
        }
      }
    },
  },
  server: {
    port: 443,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true
      }
    },
    // https: (() => {
    //   const privateKeyPath = path.resolve(process.cwd(), process.env.SSL_KEY_PATH ?? '');
    //   const certificatePath = path.resolve(process.cwd(), process.env.SSL_CERT_PATH ?? '');

    //   const key = readFileSync(privateKeyPath, 'utf8')
    //   const cert = readFileSync(certificatePath, 'utf8')

    //   return {
    //     key,
    //     cert
    //   }
    // })()
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
