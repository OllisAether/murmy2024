import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import './scss/main.scss'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'
import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

// Create a new Vuetify instance
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#97f',
        },
      },
    },
  },
})

// Create a new Pinia instance
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')

export const preventGestures = ref(true)

function preventDefault(e: Event) {
  if (preventGestures.value) {
    e.preventDefault()
  }
}

// Standalone PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
} else {
  // Prevent zooming on mobile devices
  document.addEventListener('gesturestart', preventDefault)

  // Prevent double tap to zoom on mobile devices
  document.addEventListener('click', (e) => {
    if (e.detail > 1) preventDefault(e)
  })
  // Prevent double tap to zoom on mobile devices
  // document.addEventListener('touchstart', (e) => {
  //   preventDefault(e)
  // }, { passive: true })
}