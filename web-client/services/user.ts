import { requestAPI } from "~/composables/request"
import { AdminList, createUser, User } from "~/utils/user"

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

export async function createUserService({ username, password, citizenId, isAdmin, firstname, surname, address }: createUser) {
    const { requestAuth } = await requestAPI()
    try {
        let body = {} as {[x:string]: string | boolean}
        if (isAdmin) {
            body['username'] = username
            body['password'] = password ? password : ''
            body['citizenId'] = citizenId.replaceAll("-","")
            body['isAdmin'] = true
            body['firstname'] = firstname ? firstname : ''
            body['surname'] = surname ? surname : ''
            body['address'] = address ? address : ''
        } else {
            body['username'] = username 
            body['citizenId'] = citizenId.replaceAll("-","")
            body['isAdmin'] = false
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
        const data = await requestAuth(`/users/${id}`, {
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