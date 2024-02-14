import { requestAPI } from '~/composables/request'
import type { AccountDetails, Transaction } from '~/utils/account'

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
  }
  catch (error) {
    return {
      isSuccess: false,
      error,
    }
  }
}
export async function getAccountListService() {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth('/accounts', {
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

export async function createAccountService(user_id: number, type: string) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth('/accounts', {
      method: 'POST',
      body: {
        user_id,
        type,
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

export async function getAccountProfileService(account_id: number) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<AccountDetails>(`/accounts/${account_id}`, {
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

export async function getTransactionsService(account_id: number) {
  const { requestAuth } = await requestAPI()
  try {
    const data = await requestAuth<Transaction[]>(`/accounts/transactions/${account_id}`, {
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

export async function transactionDepositService(account_id: number, amount: number, user_id?: number, note?: string) {
  const { requestAuth } = await requestAPI()
  const template = {
    account_id,
    amount,
  } as {
    [x: string]: string | number
  }

  if (user_id) {
    template.user_id = user_id
  }
  if (note) {
    template.note = note
  }
  try {
    const data = await requestAuth(`/accounts/deposit/`, {
      method: 'POST',
      body: template,
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

export async function transactionWithdrawService(account_id: number, amount: number, user_id?: number, note?: string) {
  const { requestAuth } = await requestAPI()
  const template = {
    account_id,
    amount,
  } as {
    [x: string]: string | number
  }

  if (user_id) {
    template.user_id = user_id
  }
  if (note) {
    template.note = note
  }
  try {
    const data = await requestAuth(`/accounts/withdraw`, {
      method: 'POST',
      body: template,
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

export async function transactionInterestService(account_id: number, amount: number, user_id?: number, note?: string) {
  const { requestAuth } = await requestAPI()
  const template = {
    account_id,
    amount,
  } as {
    [x: string]: string | number
  }

  if (user_id) {
    template.user_id = user_id
  }
  if (note) {
    template.note = note
  }
  try {
    const data = await requestAuth(`/accounts/interest`, {
      method: 'POST',
      body: template,
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

export async function rollbackTransactionService(account_id: number) {
  const { requestAuth } = await requestAPI()
  const template = {
    account_id,
  }
  try {
    const data = await requestAuth(`/accounts/rollback`, {
      method: 'POST',
      body: template,
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

export async function interestPerYearService(account_id: number) {
  const { requestAuth } = await requestAPI()

  try {
    const data = await requestAuth(`/accounts/transactions/interest/${account_id}`, {
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
