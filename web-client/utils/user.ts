export interface CreateUser {
  username?: string
  password?: string
  citizenId?: string
  firstname?: string
  surname?: string
  address?: string
  tel: string
  role: ROLE
}

export interface UpdateUser {
  username?: string
  citizenId?: string
  firstname?: string
  surname?: string
  address?: string
  tel?: string
  isAdmin?: boolean
  role?: ROLE
  brithday?: string
}

export interface User {
  id: number
  username: string
  nickName: null | string
  citizenId: string
  brithday: null | string
  role: string
  firstname: null | string
  surname: null | string
  address: null | string
  lastLogin: null | string
  createdAt: string
  tel: null | string
  accountId?: Account[]
}

export type AdminList = {
  id: number
  username: string
  firstname: string
  surname: string
}[]
