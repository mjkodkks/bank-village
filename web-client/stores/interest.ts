import { acceptHMRUpdate } from 'pinia'

export const useInterestStore = defineStore('interest', {
  state: () => {
    return {
      savingInterest: null as number | null, // 5% per year, divided by 12 months
      stockInterest: null as number | null, // 8% per year, divided by 12 months
    }
  },
  getters: {
  },
  actions: {
    setSavingInterest(value: number) {
      this.savingInterest = value
    },
    setStockInterest(value: number) {
      this.stockInterest = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
