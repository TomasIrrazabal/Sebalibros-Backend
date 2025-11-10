import { id, JwtPayload, User, UserAdminWithoutPass, UserLogin, UserUpdateData, UserWithoutId, UserWithoutPass } from "./types";
import { createUserModel, deleteAdminUserModel, getAdminUserModel, getallusersModel, getUserModel, updateAdminUserModel, updatePasswordModel, updateUserModel } from "./user.model";
import { checkPassword, hashPassword } from "./utils/auth";
import { generateJWT } from "./utils/jwt";
import { userExist } from "./utils/user.utils";


export async function createUserService(user: UserWithoutId) {
    if (!user) {
        throw new Error('VALIDATION_ERROR')
    }

    const exist = await userExist(user.email)

    if (exist) {
        throw new Error("USER_EXIST");
    }
    user.password = await hashPassword(user.password)

    try {
        await createUserModel(user)
        return true;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_SAVE_FAILED')
        }
        throw error
    }
}



export async function loginUserService(user: UserLogin) {
    try {
        if (!user) {
            throw new Error('VALIDATION_ERROR')
        }

        const userResponse = await userExist(user.email)

        if (!userResponse) {
            throw new Error("USER_NOT_EXIST");
        }

        const isPasswordCorrect = await checkPassword(user.password, userResponse.password)

        if (!isPasswordCorrect) {
            throw new Error("INVALID_PASSWORD");
        }

        const payload: JwtPayload = { id: userResponse.id, email: userResponse.email, role: userResponse.role }

        const token = generateJWT(payload);


        return token;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_SAVE_FAILED')
        }
        throw error
    }
}


export async function getUserService(id: number): Promise<UserWithoutPass> {
    if (!id) {
        throw new Error('VALIDATION_ERROR')
    }
    try {

        const user: UserWithoutPass = await getUserModel(id)

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

export async function updateUserService(user: UserUpdateData) {
    try {
        if (!user) {
            throw new Error('VALIDATION_ERROR')
        }
        const exist = await userExist(user.email)
        if (exist && !user.name) {
            throw new Error('EMAIL_EXIST')
        }


        const userAux: UserWithoutPass = await updateUserModel(user)

        return userAux;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_UPDATE_FAILED')
        }
        throw error
    }
}

export async function updatePasswordService(currentPassword: string, newPassword: string, user: UserWithoutPass) {
    try {
        if (!user.email) {
            throw new Error('VALIDATION_ERROR')
        }
        const userResponse = await userExist(user.email)

        if (!userResponse) {
            throw new Error("USER_NOT_EXIST");
        }

        const isPasswordCorrect = await checkPassword(currentPassword, userResponse.password)

        if (!isPasswordCorrect) {
            throw new Error("INVALID_PASSWORD");
        }
        newPassword = await hashPassword(newPassword)
        const data = await updatePasswordModel(newPassword, user.id)
        return data
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('PASSWORD_UPDATE_FAILED')
        }
        throw error
    }
}

export async function getallusersService() {
    try {

        const users: User[] = await getallusersModel()
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


export async function getAdminUserService(id: number) {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }
    try {

        const user: UserWithoutPass = await getAdminUserModel(id)
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


export async function updateAdminUserService(user: UserAdminWithoutPass) {
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
        await updateAdminUserModel(updateData)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_UPDATE_FAILED')
        }
        throw error
    }
    return { message: 'Success' };
}


export async function deleteAdminUserService(id: number) {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }

    try {
        await deleteAdminUserModel(id)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR' || error.mensaje === 'USER_NOT_FOUND') {
            throw new Error('USER_DELETION_FAILED')
        }
        throw error
    }

    return { message: 'Success' };
}