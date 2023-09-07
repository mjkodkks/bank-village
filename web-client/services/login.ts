import { requestAPI } from "~/composables/request"

export async function loginByUsername(username: string, password: string) {
    const { reuestNoneAuth } = await requestAPI()
    const pending = ref(false)
    try {
        pending.value = true
        const data = await reuestNoneAuth('/auth/login', {
            method: 'POST',
            body: {
                username,
                password
            }
        })
        pending.value = false
        return {
            isSuccess: true,
            data,
            pending
        }
    } catch (error) {
        pending.value = false
        return {
            isSuccess: false,
            error,
            pending
        }
    }

}