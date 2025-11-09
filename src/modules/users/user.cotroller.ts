import { Request, Response } from "express";
import { UserAdminWithoutPass, UserLogin, UserUpdateData, UserWithoutId, UserWithoutPass } from "./types";
import { createUserService, getAdminUserService, getallusersService, getUserService, loginUserService, updateAdminUserService, updateUserService } from "./user.services";

export async function createUserController(req: Request, res: Response) {
    try {
        const user: UserWithoutId = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            role: req.body.role
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
            maxAge: 1000 * 60 * 60 * 24 * 7
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

export async function getUserController(req: Request, res: Response) {
    try {
        let user = req.user!

        if (!user.id) {
            throw new Error('BAD_REQUEST')
        }


        user = await getUserService(user.id)
        return res.status(201).json({ user })


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
        return res.status(201).json({ user })


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

export async function getallusersController(req: Request, res: Response) {
    try {
        const users = await getallusersService()
        return res.status(200).json({ users });
    }
    catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No Users were found.' });
            case 'USERS_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch users.' });
            default:
                console.error('[Controller Error] getallusersController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function getAdminUserController(req: Request, res: Response) {
    try {
        const { id } = req.params

        const user = await getAdminUserService(parseInt(id))
        if (!user) return res.status(404).json({ message: 'No user were found.' })

        return res.json({ user }).status(200);
    } catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No Book was found.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid book data.' });
            case 'BOOK_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch book.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}


export async function updateAdminUserController(req: Request, res: Response) {
    try {
        console.log(req.body)
        const user: UserAdminWithoutPass = req.body;
        const result = await updateAdminUserService(user);

        return res.status(204).json(result)
    } catch (error: any) {

        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid user data.' });
            case 'USER_UPDATE_FAILED':
                return res.status(500).json({ error: 'Failed to update the user.' });
            default:
                console.error('[Controller Error] updateAdminUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }


    }
}