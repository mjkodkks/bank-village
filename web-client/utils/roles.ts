export type ROLE = 'ADMIN' | 'USER'

export interface RoleSelect {
  label: string
  value: ROLE
}

export const roles: RoleSelect[] = [
  {
    label: 'เจ้าหน้าที่',
    value: 'ADMIN',
  },
  {
    label: 'สมาชิก',
    value: 'USER',
  },
]

export function mapRole(type: string) {
  const template = {
    ADMIN: {
      en: 'ADMIN',
      th: 'เจ้าหน้าที่',
    },
    USER: {
      en: 'USER',
      th: 'สมาชิก',
    },
  } as {
    [x: string]: {
      en: string
      th: string
    }
  }
  return template[type]
}
