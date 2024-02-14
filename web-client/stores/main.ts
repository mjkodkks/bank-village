import { acceptHMRUpdate } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      isSidebarOpen: false as boolean,
      username: '' as string | null,
      firstname: '' as string | null,
      surname: '' as string | null,
      id: undefined as number | undefined,
    }
  },
  getters: {
    fullname: state => `${state.firstname} ${state.surname}`,
  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
