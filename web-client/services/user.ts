import { requestAPI } from '~/composables/request'
import type { AdminList, CreateUser, User } from '~/utils/user'

export async function getProfileService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<User>('/users/profile', {
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

export async function getlistUserService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<User[]>('/users', {
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

export async function createUserService({ username, password, citizenId, role, firstname, surname, address, tel }: CreateUser) {
  const { requestAuth } = await requestAPI()
  try {
    const body = {} as { [x: string]: string | boolean | undefined }
    if (role === 'ADMIN') {
      body.username = username || undefined
      body.password = password || undefined
      body.citizenId = citizenId ? citizenId.replaceAll('-', '') : undefined
      body.role = role || undefined
      body.firstname = firstname || undefined
      body.surname = surname || undefined
      body.address = address || undefined
    }
    else {
      body.citizenId = citizenId ? citizenId.replaceAll('-', '') : undefined
      body.role = role || undefined
      body.firstname = firstname || undefined
      body.surname = surname || undefined
      body.address = address || undefined
      body.tel = tel || undefined
    }
    const data = await requestAuth('/users', {
      method: 'POST',
      body,
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

export async function getUserProfileByIdService(id: number) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<User>(`/users/${id}`, {
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

export async function getAdminListService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<AdminList>(`/users/adminList`, {
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

export async function updateUserService(id: number, updateData: UpdateUser) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<AdminList>(`/users/${id}`, {
      method: 'PATCH',
      body: updateData,
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

export async function deleteUserService(id: number) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<AdminList>(`/users/${id}`, {
      method: 'DELETE',
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
