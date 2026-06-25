import { pool } from "../../../db/pool";
import { User, UserWithoutPass } from "../../../utils/user.types";


const TABLE = 'users'

export async function userExist(email: string) {
    try {
        const { rows } = await pool.query<User>(
            `SELECT * FROM "${TABLE}" WHERE "email" = $1`,
            [email]
        )
        return rows[0] as User
    } catch (error) {
        console.error('[UTIL ERROR] userExist:', error)
        throw new Error('DATABASE_ERROR')
    }
}


export async function getUserByIdWithoutPass(id: string) {
    try {
        const { rows } = await pool.query<UserWithoutPass>(
            `SELECT * FROM "${TABLE}" WHERE "id" = $1`,
            [id]
        )
        return rows[0] as UserWithoutPass
    } catch (error) {
        console.error('[UTIL ERROR] getUserByIdWithoutPass:', error)
        throw new Error('DATABASE_ERROR')
    }
}
