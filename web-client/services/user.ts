import { requestAPI } from "~/composables/request"
import { createUser } from "~/utils/user"

export async function getlistUserService() {
    const { requestAuth } = await requestAPI()
    try {
        const data = await requestAuth('/users', {
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

export async function createUserService({ username, password, citizenId, isAdmin }: createUser) {
    const { requestAuth } = await requestAPI()
    try {
        let body = {} as {[x:string]: string | boolean}
        if (isAdmin) {
            body['username'] = username
            body['password'] = password ? password : ''
            body['citizenId'] = citizenId
            body['isAdmin'] = true
        } else {
            body['username'] = username 
            body['citizenId'] = citizenId
            body['isAdmin'] = false
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
        const data = await requestAuth(`users/${id}`, {
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