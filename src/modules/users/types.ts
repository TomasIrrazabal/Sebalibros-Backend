export type User = {
    id: number,
    name: string
    email: string
    password: string
}

export type UserWithoutId = Omit<User, 'id'>

export type UserLogin = Pick<User, 'email' | 'password'>

export type UserWithoutPass = Omit<User, 'password'>