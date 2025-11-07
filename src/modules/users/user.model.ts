import { supabase } from "../../db/supabase";
import { UserWithoutId } from "./types";

const TABLE = 'users'

export async function createUserModel(user: UserWithoutId) {
    const response = await supabase
        .from(TABLE)
        .insert(user)

    if (response.status !== 201) {
        console.error('[Model Error] createBookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return true
}