export enum Role {
    editor = 'editor',
    admin = 'admin'
}

export type User = {
    id: number,
    name: string
    email: string
    password: string
    role: Role
}

export type UserWithoutId = Omit<User, 'id'>

export type UserLogin = Pick<User, 'email' | 'password'>

export type UserWithoutPass = Omit<User, 'password'>

export type UserAdminWithoutPass = User & {
    resetPass: boolean
}


export type UserUpdateData = Pick<User, 'id' | 'name' | 'email'>

export type id = Pick<User, 'id'>

export type JwtPayload = Pick<User, 'id' | 'email' | 'role'>