import express from "express"
import { body } from "express-validator"
import { handleInputErrors } from "../../middleware/user.middleware"
import { admin_createUserController, admin_deleteUserController, admin_getallusersController, admin_getUserController, admin_updateUserController } from "./admin.controller"


const router = express.Router()


// Get all users
router.get('/admin/user',
    admin_getallusersController
)

// Get one user by id
router.get('/admin/user/:id',
    admin_getUserController
)

// Update a user
router.patch('/admin/user/',
    handleInputErrors,
    admin_updateUserController
)

// Create a user
router.post('/admin/user',
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
    admin_createUserController
)

router.delete('/admin/user/:id',
    body('id')
        .notEmpty()
        .withMessage('Id cannot be empty'),
    admin_deleteUserController
)

export default router