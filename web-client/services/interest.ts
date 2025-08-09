export async function getInterestService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<InterestResponse>('interest/current-interest', {
      method: 'GET',
    })
    return {
      isSuccess: true,
      data,
    }
  }
  catch (error) {
    return {
      isSuccess: false,
      error,
    }
  }
}
