import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  authStore.checkAuth()

  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }

})