import { hashPassword } from "../../utils/auth";
import { User, UserAdminWithoutPass, UserWithoutId, UserWithoutPass } from "../../utils/user.types";
import { userExist } from "../users/utils/user.utils";
import { admin_createUserModel, admin_deleteUserModel, admin_getallusersModel, admin_getUserModel, admin_updateUserModel } from "./admin.model";



export async function admin_getallusersService() {
    try {

        const users: User[] = await admin_getallusersModel()
        if (users.length === 0) {
            throw new Error('RESPONSE_ERROR')
        }
        return users;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USERS_FETCH_FAILED')
        }
        throw error
    }
}

export async function admin_getUserService(id: number) {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }
    try {

        const user: UserWithoutPass = await admin_getUserModel(id)
        if (!user) {
            throw new Error('RESPONSE_ERROR')
        }

        return user;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_FETCH_FAILED')
        }
        throw error
    }
}

export async function admin_updateUserService(user: UserAdminWithoutPass) {
    if (!user) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        const updateData: any = {
            id: user.id
        };
        if (user.name) {
            updateData.name = user.name
        }
        if (user.email) {
            updateData.email = user.email
        }
        if (user.role) {
            updateData.role = user.role
        }

        if (user.resetPass === true) {
            updateData.password = await hashPassword('12345678');
        }
        await admin_updateUserModel(updateData)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_UPDATE_FAILED')
        }
        throw error
    }
    return { message: 'Success' };
}

export async function admin_createUserService(user: UserWithoutId) {
    if (!user) {
        throw new Error('VALIDATION_ERROR')
    }

    const exist = await userExist(user.email)

    if (exist) {
        throw new Error("USER_EXIST");
    }
    user.password = await hashPassword(user.password)

    try {
        await admin_createUserModel(user)
        return true;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_SAVE_FAILED')
        }
        throw error
    }
}

export async function admin_deleteUserService(id: number) {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }

    try {
        await admin_deleteUserModel(id)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR' || error.mensaje === 'USER_NOT_FOUND') {
            throw new Error('USER_DELETION_FAILED')
        }
        throw error
    }

    return { message: 'Success' };
}
