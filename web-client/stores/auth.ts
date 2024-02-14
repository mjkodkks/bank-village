import Cookies from 'js-cookie'
import { acceptHMRUpdate } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      isAuthenticated: false,
      accessToken: '',
    }
  },
  getters: {
  },
  actions: {
    checkAuth() {
      const accessToken = Cookies.get('accessToken')
      if (accessToken) {
        this.accessToken = accessToken
        this.isAuthenticated = true
      }
      else {
        this.accessToken = ''
        this.isAuthenticated = false
      }
    },
    logout() {
      this.isAuthenticated = false
      this.accessToken = ''
      Cookies.remove('accessToken')
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
