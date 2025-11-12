import { Request, Response } from "express";
import { UserLogin, UserUpdateData } from "../../utils/user.types";
import { getUserService, loginUserService, updatePasswordService, updateUserService } from "./user.services";


export async function loginUserController(req: Request, res: Response) {

    try {
        const user: UserLogin = {
            email: req.body.email,
            password: req.body.password
        }

        const token = await loginUserService(user)

        res.cookie('auth', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return res.status(200).json({ message: 'Logged in' })


    } catch (error: any) {
        switch (error.message) {
            case 'USER_NOT_EXIST':
                return res.status(409).json({ error: 'The user does not exist.' });
            case 'INVALID_PASSWORD':
                return res.status(409).json({ error: 'Invalid Password.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid User data.' });
            default:
                console.error('[Controller Error] loginUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function getUserController(req: Request, res: Response) {
    try {
        let user = req.user!

        if (!user.id) {
            throw new Error('BAD_REQUEST')
        }


        user = await getUserService(user.id)
        return res.status(200).json({ user })


    } catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No Users were found.' });
            case 'BAD_REQUEST':
                return res.status(400).json({ error: 'Invalid user data.' });
            case 'USER_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch user.' });
            default:
                console.error('[Controller Error] getUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function updateUserController(req: Request, res: Response) {
    try {
        const { name, email } = req.body

        if (email === '' && name === '') {
            throw new Error('BAD_REQUEST')
        }

        let user: UserUpdateData = {
            id: req.user?.id!,
            name,
            email
        }

        user = await updateUserService(user)
        return res.status(200).json({ user })


    } catch (error: any) {
        switch (error.message) {
            case 'BAD_REQUEST':
                return res.status(400).json({ error: 'Bad request.' })
            case 'USER_UPDATE_FAILED':
                return res.status(409).json({ error: 'Invalid User data.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'User data not found.' });
            case 'EMAIL_EXIST':
                return res.status(409).json({ error: 'Email already exist.' });

            default:
                console.error('[Controller Error] updateUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function updatePasswordController(req: Request, res: Response) {
    try {
        const { currentPassword, newPassword } = req.body

        const user = req.user;

        if (!currentPassword || !newPassword) {
            throw new Error('BAD_REQUEST')
        }
        if (!user) {
            throw new Error('BAD_REQUEST')
        }
        const data = await updatePasswordService(currentPassword, newPassword, user)


        return res.status(200).json(data)

    } catch (error: any) {
        switch (error.message) {
            case 'BAD_REQUEST':
                return res.status(400).json({ error: 'Bad request.' })
            case 'PASSWORD_UPDATE_FAILED':
                return res.status(409).json({ error: 'Invalid User data.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'User data not found.' });
            case 'INVALID_PASSWORD':
                return res.status(409).json({ error: 'Invalid Password.' });
            case 'USER_NOT_EXIST':
                return res.status(409).json({ error: 'The user does not exist.' });
            default:
                console.error('[Controller Error] updatePasswordController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}