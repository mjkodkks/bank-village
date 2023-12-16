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

export function mapTransactionType(type: string, option?: { isLoan?: boolean }) {
    type MapTransactionType = {
        [x:string]: {
            en: string
            th: string
            longTh: string
            color: string
        }
    }

    const loanTemplate = {
        'DEPOSIT': {
            en: 'DEPOSIT',
            th: 'ขอกู้',
            longTh: 'ขอกู้',
            color: '#7A9D54'
        },
        'WITHDRAWAL': {
            en: 'WITHDRAWAL',
            th: 'คืนต้น',
            longTh: 'คืนต้น',
            color: '#C23373'
        },
        'INTEREST': {
            en: 'INTEREST',
            th: 'ดอกเบี้ย',
            longTh: 'คิดดอกเบี้ยเงินกู้',
            color: '#655DBB'
        }
    } as MapTransactionType

    const template = {
        'DEPOSIT': {
            en: 'DEPOSIT',
            th: 'ฝาก',
            longTh: 'การฝากเงิน',
            color: '#7A9D54'
        },
        'WITHDRAWAL': {
            en: 'WITHDRAWAL',
            th: 'ถอน',
            longTh: 'การถอนเงิน',
            color: '#C23373'
        },
        'INTEREST': {
            en: 'INTEREST',
            th: 'ดอกเบี้ย',
            longTh: 'คิดดอกเบี้ย',
            color: '#655DBB'
        }
    } as MapTransactionType
    return option?.isLoan ? loanTemplate[type] : template[type]
}
export function mapMessageTransaction(type: string, option?: { isLoan?: boolean }) {
    type MapTransactionType = {
        [x:string]: {
            successMessage: string
            errMessage: string
        }
    }

    const loanTemplate = {
        'DEPOSIT': {
            successMessage: 'ขอกู้สำเร็จ',
            errMessage: 'ขอกู้ไม่สำเร็จ',
        },
        'WITHDRAWAL': {
            successMessage: 'คืนต้นสำเร็จ',
            errMessage: 'คืนต้นไม่สำเร็จ',
        },
        'INTEREST': {
            successMessage: 'คิดดอกเบี้ยสำเร็จ',
            errMessage: 'คิดดอกเบี้ยไม่สำเร็จ',
        }
    } as MapTransactionType

    const template = {
        'DEPOSIT': {
            successMessage: 'การฝากสำเร็จ',
            errMessage: 'การฝากไม่สำเร็จ',
        },
        'WITHDRAWAL': {
            successMessage: 'การถอนสำเร็จ',
            errMessage: 'การถอนไม่สำเร็จ',
        },
        'INTEREST': {
            successMessage: 'การฝากดอกเบี้ยสำเร็จ',
            errMessage: 'การฝากดอกเบี้ยไม่สำเร็จ',
        }
    } as MapTransactionType
    return option?.isLoan ? loanTemplate[type] : template[type]
}