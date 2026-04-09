import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'

import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
