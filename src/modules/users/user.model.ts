import { supabase } from "../../db/supabase";
import { User, UserUpdateData, UserWithoutId, UserWithoutPass } from "../../utils/user.types";

const TABLE = 'users'


export async function getUserModel(id: number): Promise<UserWithoutPass> {
    const response = await supabase
        .from(TABLE)
        .select('name,email,role')
        .eq('id', id)
        .maybeSingle()

    if (response.status !== 200) {
        console.error('[Model Error] getUserModel:')
        throw new Error('DATABASE_ERROR')
    }
    return response.data as UserWithoutPass;
}

export async function updateUserModel(user: UserUpdateData) {
    const { id, ...rest } = user
    const response = await supabase
        .from(TABLE)
        .update(rest)
        .eq('id', id)

    if (response.error) {
        console.error('[Model Error] updateUserModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    const responseSelect = await supabase
        .from(TABLE)
        .select('name,email')
        .eq('id', id)
        .maybeSingle()

    if (responseSelect.status !== 200) {
        console.error('[Model Error] updateUserModel:')
        throw new Error('DATABASE_ERROR')
    }

    return responseSelect.data as UserWithoutPass;
}

export async function updatePasswordModel(newPassword: string, id: number) {
    const response = await supabase
        .from(TABLE)
        .update({ 'password': newPassword })
        .eq('id', id)
    if (response.error) {
        console.error('[Model Error] updatePasswordModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    return { message: 'Password Changed' }
}
