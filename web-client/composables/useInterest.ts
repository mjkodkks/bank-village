function useInterest() {
  const interestStore = useInterestStore()

  function calInterestByType(value: number, accountType: AccountType): number {
    const monthlyRates = {
      SAVING: interestStore.savingInterest ?? 0,
      STOCK: interestStore.stockInterest ?? 0,
      LOAN: 1,
    }

    return (monthlyRates[accountType] ?? 0) * value
  }

  async function init() {
    if (interestStore.savingInterest !== null && interestStore.stockInterest !== null) return

    const { isSuccess, data, error } = await getInterestService()
    if (isSuccess && data) { 
      interestStore.setSavingInterest(data.saving_per_month)
      interestStore.setStockInterest(data.stock_per_month)
    } else {
      console.error('Error fetching interest data:', error)
    }
  }

  return {
    calInterestByType,
    init,
  }
}

export default useInterest
