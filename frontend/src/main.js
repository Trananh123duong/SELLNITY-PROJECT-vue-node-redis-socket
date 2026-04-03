import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { useAuthStore } from '@/stores/auth.store'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

const bootstrap = async () => {
  const authStore = useAuthStore()

  try {
    if (authStore.accessToken) {
      await authStore.getMyProfile()
    }
  } catch (error) {
    console.error('Bootstrap auth failed:', error)
  } finally {
    app.mount('#app')
  }
}

bootstrap()