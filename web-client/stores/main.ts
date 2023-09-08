import { acceptHMRUpdate } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      isSidebarOpen: false
    }
  },
  getters: {
  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
