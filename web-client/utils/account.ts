export function mapAccoutType(type: string) {
    const template = {
        'SAVING': {
            en: 'SAVING Account',
            th: 'บัญชีฝากออมทรัพย์',
            color: '#FBA1B7'
        },
        'STOCK': {
            en: 'STOCK Account',
            th: 'บัญชีฝากลงหุ้น',
            color: '#F4D160'
        },
        'LOAN': {
            en: 'LOAN Account',
            th: 'บัญชีเงินกู้',
            color: '#1D5D9B'
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

export type AccountType = 'SAVING' | 'STOCK' | 'LOAN'

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