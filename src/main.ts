import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './scss/main.scss'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router';

// Create a new Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  }
})

// Create a new Pinia instance
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
