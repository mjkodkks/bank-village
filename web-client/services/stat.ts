export async function getStatService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth('/stats', {
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
