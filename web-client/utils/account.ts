export function mapAccoutType(type: string) {
    const template = {
        'SAVING': {
            en: 'SAVING Account',
            th: 'บัญชีฝากออมทรัพย์',
        },
        'STOCK': {
            en: 'STOCK Account',
            th: 'บัญชีฝากลงหุ้น',
        },
        'LOAN': {
            en: 'LOAN Account',
            th: 'บัญชีเงินกู้',
        }
    } as {
        [x:string]: {
            en: string
            th: string
        }
    }
    return template[type]
}

export type AccountType = 'SAVING' | 'STOCK' | 'LOAN'