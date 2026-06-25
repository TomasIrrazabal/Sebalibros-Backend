import { pool } from "../../db/pool";
import { buildUpdate } from "../../db/sql";
import { User, UserUpdateData, UserWithoutId, UserWithoutPass } from "../../utils/user.types";

const TABLE = 'users'


export async function getUserModel(id: number): Promise<UserWithoutPass> {
    try {
        const { rows } = await pool.query<UserWithoutPass>(
            `SELECT "name", "email", "role" FROM "${TABLE}" WHERE "id" = $1`,
            [id]
        )
        return rows[0] as UserWithoutPass;
    } catch (error) {
        console.error('[Model Error] getUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function updateUserModel(user: UserUpdateData) {
    try {
        const { text, values } = buildUpdate(TABLE, user)
        await pool.query(text, values)

        const { rows } = await pool.query<UserWithoutPass>(
            `SELECT "name", "email" FROM "${TABLE}" WHERE "id" = $1`,
            [user.id]
        )
        return rows[0] as UserWithoutPass;
    } catch (error) {
        console.error('[Model Error] updateUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function updatePasswordModel(newPassword: string, id: number) {
    try {
        await pool.query(
            `UPDATE "${TABLE}" SET "password" = $1 WHERE "id" = $2`,
            [newPassword, id]
        )
        return { message: 'Password Changed' }
    } catch (error) {
        console.error('[Model Error] updatePasswordModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}
