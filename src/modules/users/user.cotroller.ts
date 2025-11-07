import { Request, Response } from "express";
import { UserLogin, UserWithoutId } from "./types";
import { createUserService, loginUserService } from "./user.services";

export async function createUserController(req: Request, res: Response) {
    try {
        const user: UserWithoutId = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }
        await createUserService(user)

        return res.status(201).json({ data: 'User created successfully.' })

    } catch (error: any) {
        switch (error.message) {
            case 'USER_EXIST':
                return res.status(409).json({ error: 'A user with that email is already registered.' })
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid User data.' });
            case 'USER_SAVE_FAILED':
                return res.status(500).json({ error: 'Failed to save user.' });
            default:
                console.error('[Controller Error] createuserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

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
            maxAge: 1000 * 60 * 10
        })

        return res.status(201).json({ message: 'Logged in' })


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