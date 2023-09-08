export type ROLE = 'ADMIN' | 'USER'

export type RoleSelect = {
    label: string,
    value: ROLE
}

export const roles: RoleSelect[] = [
    {
        label: 'เจ้าหน้าที่',
        value: 'ADMIN'
    },
    {
        label: 'สมาชิก',
        value: 'USER'
    },
]