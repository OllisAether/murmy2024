import { createApp } from 'vue'
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

// Wakelock
if ('wakeLock' in navigator) {
  navigator.wakeLock.request('screen')
    .then(() => console.log('Wake lock active'))
    .catch(console.error)
}
