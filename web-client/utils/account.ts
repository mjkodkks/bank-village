export type AccountType = 'SAVING' | 'STOCK' | 'LOAN'

export type Account = {
    id: number
    balance: string
    interest: string
    createdAt: string
    userId: number
    type: AccountType
}

export type Transaction = {
    id: number
    action: string
    previousBalance: string
    changeBalance: string
    amounts: string
    interest: any
    note: string
    createdAt: string
    staff: {
      username: string
      firstname: string
      surname: string
    } | string
}

export type AccountDetails = {
    id: number
    balance: string
    createdAt: string
    userId: number
    type: AccountType
    typeTH?: string
    owner: {
      username: string
      role: ROLE
      firstname: string
      surname: string
    }
}


export function mapAccoutType(type: string) {
    const template = {
        'SAVING': {
            en: 'SAVING Account',
            th: 'บัญชีฝากออมทรัพย์',
            color: '#EA1179'
        },
        'STOCK': {
            en: 'STOCK Account',
            th: 'บัญชีฝากลงหุ้น',
            color: '#FD7800'
        },
        'LOAN': {
            en: 'LOAN Account',
            th: 'บัญชีเงินกู้',
            color: '#0B666A'
        }
    } as {
        [x:string]: {
            en: string
            th: string
            color: string
        }
    }
    return template[type]
}

export function mapTransactionType(type: string) {
    const template = {
        'DEPOSIT': {
            en: 'DEPOSIT',
            th: 'ฝาก',
            color: '#7A9D54'
        },
        'WITHDRAWAL': {
            en: 'WITHDRAWAL',
            th: 'ถอน',
            color: '#C23373'
        },
        'INTEREST': {
            en: 'INTEREST',
            th: 'ดอกเบี้ย',
            color: '#655DBB'
        }
    } as {
        [x:string]: {
            en: string
            th: string
            color: string
        }
    }
    return template[type]
}