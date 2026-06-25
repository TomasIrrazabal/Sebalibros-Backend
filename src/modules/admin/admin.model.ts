import { pool } from "../../db/pool";
import { buildInsert, buildUpdate } from "../../db/sql";
import { User, UserWithoutId, UserWithoutPass } from "../../utils/user.types";

const TABLE = 'users'


export async function admin_getallusersModel() {
    try {
        const { rows } = await pool.query<User>(
            `SELECT * FROM "${TABLE}" ORDER BY "id" ASC`
        )
        return rows;
    } catch (error) {
        console.error('[Model Error] getallusersModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function admin_getUserModel(id: number) {
    try {
        const { rows } = await pool.query<UserWithoutPass>(
            `SELECT "id", "name", "email", "role" FROM "${TABLE}" WHERE "id" = $1`,
            [id]
        )
        return rows[0] as UserWithoutPass;
    } catch (error) {
        console.error('[Model Error] admin_getUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function admin_updateUserModel(user: any) {
    try {
        const { text, values } = buildUpdate(TABLE, user)
        await pool.query(text, values)
        return true
    } catch (error) {
        console.error('[Model Error] admin_updateUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function admin_createUserModel(user: UserWithoutId) {
    try {
        const { text, values } = buildInsert(TABLE, user)
        await pool.query(text, values)
        return true
    } catch (error) {
        console.error('[Model Error] admin_createUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function admin_deleteUserModel(id: number) {
    try {
        await pool.query(`DELETE FROM "${TABLE}" WHERE "id" = $1`, [id])
        return true
    } catch (error) {
        console.error('[Model Error] admin_deleteUserModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}
