function useInterest ()  {
    const tempalteMonth = {
        "SAVING": 0.005,
        "STOCK": 0.0075,
        "LOAN": 0.0125
    }

    function calInterestByType (value: number, accountType: AccountType): number {
        const newValue =  tempalteMonth[accountType] * value
        return newValue
    }

    return {
        calInterestByType
    }
}

export default useInterest