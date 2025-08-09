function useInterest() {
  const tempalteMonth = {
    SAVING: 1, // 5% per year, divided by 12 months
    STOCK: 1, // 8% per year, divided by 12 months
    LOAN: 1, // 1.25% per year, divided by 12 months
  }

  function calInterestByType(value: number, accountType: AccountType): number {
    const newValue = tempalteMonth[accountType] * value
    return newValue
  }

  async function init() {
    const { isSuccess, data, error } = await getInterestService()
    if (isSuccess && data) { 
      tempalteMonth.SAVING = data.saving_per_month
      tempalteMonth.STOCK = data.stock_per_month
      tempalteMonth.LOAN = data.loan_per_month
    }
    else {
      console.error('Error fetching interest data:', error)
    }
  }

  return {
    calInterestByType,
    init
  }
}

export default useInterest
