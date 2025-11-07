import { UserLogin, UserWithoutId } from "./types";
import { createUserModel } from "./user.model";
import { checkPassword, hashPassword } from "./utils/auth";
import { generateJWT } from "../../utils/jwt";
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

        const token = generateJWT({ id: userResponse.id });


        return token;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('USER_SAVE_FAILED')
        }
        throw error
    }
}