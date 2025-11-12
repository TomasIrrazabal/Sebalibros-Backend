import { supabase } from "../../../db/supabase";
import { User, UserWithoutPass } from "../../../utils/user.types";


const TABLE = 'users'

export async function userExist(email: string) {
    const response = await supabase
        .from(TABLE)
        .select('*')
        .eq('email', email)
        .maybeSingle()

    if (response.status !== 200) {
        console.error('[UTIL ERROR] userExist:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return response.data as User
}


export async function getUserByIdWithoutPass(id: string) {
    const response = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (response.status !== 200) {
        console.error('[UTIL ERROR] userExist:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return response.data as UserWithoutPass
}

