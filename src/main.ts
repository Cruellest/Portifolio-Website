import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/inter/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
