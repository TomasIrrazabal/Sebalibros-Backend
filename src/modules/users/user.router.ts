import express from "express"
import { body } from "express-validator"
import { handleInputErrors } from "./middleware/user.middleware"
import { createUserController, loginUserController } from "./user.cotroller"
import { requireAuth, getUser } from "../../utils/jwt"

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
    requireAuth,
    body('name')
        .notEmpty()
        .withMessage('Name cannot be empty.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email.'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('The password is too short, minimum 8 characters.'),
    handleInputErrors,
    createUserController

)

router.get('/logout', (req, res) => {
    res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    return res.status(200).json({ message: 'Logged out' });
});

router.get('/user',
    requireAuth,
    getUser
)

export default router;