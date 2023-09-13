// import { useToast } from "primevue/usetoast"
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  // const toast = useToast()

  authStore.checkAuth()

  if (!authStore.isAuthenticated) {
    alert(`เซสชั่น (Session) หมดอายุ ออกจากระบบ.. โปรดเข้าสู่ระบบใหม่`)
    return navigateTo('/')
  }

})