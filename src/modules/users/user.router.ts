import express from "express"
import { body } from "express-validator"
import { handleInputErrors } from "./middleware/user.middleware"
import { createUserController, getAdminUserController, getallusersController, getUserController, loginUserController, updateAdminUserController, updateUserController } from "./user.cotroller"
import { requireAuth, requireRole } from "./utils/jwt"
import { Role } from "./types"

const router = express.Router()



router.post('/login',
    body('email')
        .isEmail()
        .withMessage('E-mail no valido'),
    body('password')
        .notEmpty()
        .withMessage('The password is required.'),
    handleInputErrors,
    loginUserController
)

router.post('/admin/createuser',
    body('name')
        .notEmpty()
        .withMessage('Name cannot be empty.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email.'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('The password is too short, minimum 8 characters.'),
    requireAuth,
    requireRole(Role.admin),
    handleInputErrors,
    createUserController
)

router.get('/logout', (req, res) => {
    res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    return res.status(200).json({ message: 'Logged out' });
});

router.get('/user',
    requireAuth,
    requireRole(Role.editor),
    getUserController
)

router.patch('/user',
    body('name')
        .notEmpty()
        .withMessage('Name cannot be empty.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email.'),
    requireAuth,
    requireRole(Role.editor),
    updateUserController)


router.get('/allusers',
    requireAuth,
    requireRole(Role.admin),
    getallusersController
)

router.get('/admin/user/:id',
    requireAuth,
    requireRole(Role.admin),
    getAdminUserController
)

router.patch('/admin/user/',
    requireAuth,
    requireRole(Role.admin),
    updateAdminUserController
)
export default router;