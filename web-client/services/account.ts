import { requestAPI } from "~/composables/request"
import { AccountType } from "~/utils/account"

export async function getAccountTypesService() {
    const { requestAuth } = await requestAPI()
    try {
        const data = await requestAuth('/accounts/types', {
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

export async function createAccountService(user_id: number, type: string) {
    const { requestAuth } = await requestAPI()
    try {
        const data = await requestAuth('/accounts', {
            method: 'POST',
            body: {
                user_id,
                type
            }
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

export async function getAccountProfileService(account_id: number) {
    const { requestAuth } = await requestAPI()
    try {
        const data = await requestAuth(`/accounts/${account_id}`, {
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

export async function getTransactionsServier(account_id: number) {
    const { requestAuth } = await requestAPI()
    try {
        const data = await requestAuth(`/accounts/transactions/${account_id}`, {
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

export async function transactionDepositService(account_id: number, amount: number) {
    const { requestAuth } = await requestAPI()
    const template = {
        account_id,
        amount
    }
    try {
        const data = await requestAuth(`/accounts/deposit/`, {
            method: 'POST',
            body: template
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

export async function transactionWithdrawService(account_id: number, amount: number) {
    const { requestAuth } = await requestAPI()
    const template = {
        account_id,
        amount
    }
    try {
        const data = await requestAuth(`/accounts/withdraw`, {
            method: 'POST',
            body: template
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
