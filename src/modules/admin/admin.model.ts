import { supabase } from "../../db/supabase";
import { User, UserWithoutId, UserWithoutPass } from "../../utils/user.types";

const TABLE = 'users'


export async function admin_getallusersModel() {
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

export async function admin_getUserModel(id: number) {
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

export async function admin_updateUserModel(user: any) {
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

export async function admin_createUserModel(user: UserWithoutId) {
    const response = await supabase
        .from(TABLE)
        .insert(user)

    if (response.status !== 201) {
        console.error('[Model Error] createBookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return true
}

export async function admin_deleteUserModel(id: number) {

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

