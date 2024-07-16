import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { readFileSync } from 'fs'
import { configDotenv } from 'dotenv'
import path from 'path'

configDotenv({
  path: '.env'
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'Murder Mystery Night',
    //     short_name: 'Murder Mystery Night',
    //     theme_color: '#000000',
    //     background_color: '#f93400',
    //     display: 'standalone',
    //   },
    //   devOptions: {
    //     enabled: true
    //   }
    // })
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
    https: (() => {
      const privateKeyPath = path.resolve(process.cwd(), process.env.SSL_KEY_PATH ?? '');
      const certificatePath = path.resolve(process.cwd(), process.env.SSL_CERT_PATH ?? '');

      const key = readFileSync(privateKeyPath, 'utf8')
      const cert = readFileSync(certificatePath, 'utf8')

      return {
        key,
        cert
      }
    })()
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
