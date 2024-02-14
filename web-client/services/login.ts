import { requestAPI } from '~/composables/request'

export async function loginByUsernameService(username: string, password: string) {
  const { reuestNoneAuth } = await requestAPI()
  try {
    const data = await reuestNoneAuth('/auth/login', {
      method: 'POST',
      body: {
        username,
        password,
      },
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
