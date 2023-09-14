import { requestAPI } from "~/composables/request"
import { AdminList, CreateUser, User } from "~/utils/user"

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
    } catch (error) {
        return {
            isSuccess: false,
            error,
        }
    }
}

export async function createUserService({ username, password, citizenId, role, firstname, surname, address }: CreateUser) {
    const { requestAuth } = await requestAPI()
    try {
        let body = {} as {[x:string]: string | boolean | undefined}
        if (role === 'ADMIN') {
            body['username'] = username ? username : undefined
            body['password'] = password ? password : undefined
            body['citizenId'] = citizenId ? citizenId.replaceAll("-","") : undefined
            body['role'] = role ? role : undefined
            body['firstname'] = firstname ? firstname : ''
            body['surname'] = surname ? surname : ''
            body['address'] = address ? address : ''
        } else {
            body['citizenId'] = citizenId ? citizenId.replaceAll("-","") : undefined
            body['role'] = role ? role : undefined
            body['firstname'] = firstname ? firstname : ''
            body['surname'] = surname ? surname : ''
            body['address'] = address ? address : ''
        }
        const data = await requestAuth('/users', {
            method: 'POST',
            body
        })
        return {
            isSuccess: true,
            data,
        }
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
            body: updateData
        })
        return {
            isSuccess: true,
            data,
        }
    } catch (error) {
        return {
            isSuccess: false,
            error,
        }
    }
}