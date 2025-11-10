import express from "express"
import { body } from "express-validator"
import { handleInputErrors } from "./middleware/user.middleware"
import { createUserController, deleteAdminUserController, getAdminUserController, getallusersController, getUserController, loginUserController, updateAdminUserController, updatePasswordController, updateUserController } from "./user.cotroller"
import { requireAuth, requireRole } from "./utils/jwt"
import { Role } from "./types"

const router = express.Router()


// Login
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


// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    return res.status(200).json({ message: 'Logged out' });
});

// Get user to auth
router.get('/user',
    requireAuth,
    requireRole(Role.editor),
    getUserController
)

// Update my acount
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

// Get all users as an admin
router.get('/allusers',
    requireAuth,
    requireRole(Role.admin),
    getallusersController
)

// Get 1 user as an admin
router.get('/admin/user/:id',
    requireAuth,
    requireRole(Role.admin),
    getAdminUserController
)

// patch a user as an admin
router.patch('/admin/user/',
    requireAuth,
    requireRole(Role.admin),
    updateAdminUserController
)

// post (create) user as admin
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

router.delete('/admin/user/:id',
    body('id')
        .notEmpty()
        .withMessage('Id cannot be empty'),
    requireAuth,
    requireRole(Role.admin),
    deleteAdminUserController
)
export default router;