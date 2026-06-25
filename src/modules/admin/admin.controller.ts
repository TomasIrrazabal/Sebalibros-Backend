import { Request, Response } from "express";
import { admin_createUserService, admin_deleteUserService, admin_getallusersService, admin_getUserService, admin_updateUserService } from "./admin.services";
import { UserAdminWithoutPass, UserWithoutId } from "../../utils/user.types";


export async function admin_getallusersController(req: Request, res: Response) {
    try {
        const users = await admin_getallusersService()
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

export async function admin_getUserController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid user id.' })
        }

        const user = await admin_getUserService(id)
        if (!user) return res.status(404).json({ message: 'No user were found.' })

        return res.status(200).json({ user });
    } catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No user was found.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid user data.' });
            case 'USER_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch user.' });
            default:
                console.error('[Controller Error] getAdminUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function admin_updateUserController(req: Request, res: Response) {
    try {
        const user: UserAdminWithoutPass = req.body;
        const result = await admin_updateUserService(user);

        return res.status(200).json(result)
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


export async function admin_createUserController(req: Request, res: Response) {
    try {
        const user: UserWithoutId = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            role: req.body.role
        }
        await admin_createUserService(user)

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





export async function admin_deleteUserController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid user id.' })
        }

        await admin_deleteUserService(id)

        return res.status(204).send()

    } catch (error: any) {

        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid user data.' });
            case 'USER_DELETION_FAILED':
                return res.status(500).json({ error: 'Failed to delete the user.' });
            default:
                console.error('[Controller Error] deleteAdminUserController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }

    }
}
