import express from "express"
import { body } from "express-validator"
import { handleInputErrors } from "../../middleware/user.middleware"
import { getUserController, loginUserController, updatePasswordController, updateUserController } from "./user.controller"


import { requireAuth, requireRole } from "../../middleware/jwt"
import { Role } from "../../utils/user.types"

const router = express.Router()

// Public (todos los usuarios)
// Login
router.post('/login',
    body('email')
        .isEmail()
        .withMessage('Invalid email.'),
    body('password')
        .notEmpty()
        .withMessage('The password is required.'),
    loginUserController
)


// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    return res.status(200).json({ message: 'Logged out' });
});

// Editor/Admin
// Get my user (auth)
router.get('/user',
    requireAuth,
    requireRole(Role.editor),
    getUserController
)

// Update my account (auth)
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

router.patch('/password',
    requireAuth,
    updatePasswordController
)

// Admin Only
// Get all users

export default router;
