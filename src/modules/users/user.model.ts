import { supabase } from "../../db/supabase";
import { User, UserUpdateData, UserWithoutId, UserWithoutPass } from "./types";

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

export async function getallusersModel() {
    const response = await supabase
        .from(TABLE)
        .select('*')
        .order('id', { ascending: true })

    if (response.status !== 200) {
        console.error('[Model Error] getallusersModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    return response.data as User[];
}

export async function getAdminUserModel(id: number) {
    const response = await supabase
        .from(TABLE)
        .select('id,name,email,role')
        .eq('id', id)
        .single()

    if (response.status !== 200) {
        console.error('[Model Error] getABookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return response.data as UserWithoutPass;
}

export async function updateAdminUserModel(user: any) {
    const response = await supabase
        .from(TABLE)
        .update(user)
        .eq('id', user.id)

    if (response.error) {
        console.error('[Model Error] updateAdminUserModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    return true
}

export async function deleteAdminUserModel(id: number) {

    const { error: deleteError, status } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id)

    if (deleteError || status !== 204) {
        console.error('[Model Error] deleteAdminUserModel:', deleteError)
        throw new Error('DATABASE_ERROR')
    }

    return true
}

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
