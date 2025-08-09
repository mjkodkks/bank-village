function useInterest() {
  const tempalteMonth = {
    SAVING: 5 / 100 / 12, // 5% per year, divided by 12 months
    STOCK: 8 / 100 / 12, // 8% per year, divided by 12 months
    LOAN: 15 / 100 / 12, // 1.25% per year, divided by 12 months
  }

  function calInterestByType(value: number, accountType: AccountType): number {
    const newValue = tempalteMonth[accountType] * value
    return newValue
  }

  return {
    calInterestByType,
  }
}

export default useInterest
