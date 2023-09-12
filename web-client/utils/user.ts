export type createUser = {
    username: string;
    password?: string;
    citizenId: string;
    firstname?: string;
    surname?: string;
    address?: string;
    isAdmin: boolean;
}

export type User = {
    id: number;
    username: string;
    nickName: null | string;
    citizenId: string;
    brithday: null | string;
    role: string;
    firstname: null | string;
    surname: null | string;
    address: null | string;
    lastLogin: null | string;
    createdAt: string;
}
