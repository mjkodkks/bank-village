function useNumber() {
  function strToCurrency(value: string) {
    const newValue = Intl.NumberFormat().format(value as unknown as number)
    return newValue
  }

  return {
    strToCurrency,
  }
}

export default useNumber
