import express from 'express'
import { createBookController, deleteBookController, deleteImageController, getABookController, getBooksController, updateBookController } from './book.controller'
import { uploadImageMiddleware } from './middleware/image.middleware'
import { uploadSingleImage } from '../../config/multerConfig'
import { requireAuth, requireRole } from '../users/utils/jwt'
import { Role } from '../users/types'

const router = express.Router()

// Public (sin autenticación)

router.get('/books',
    getBooksController

)

router.get('/books/:id',
    getABookController
)



// Admin (autenticación + rol admin)
router.post('/admin/book',
    requireAuth,
    requireRole(Role.admin),
    uploadSingleImage,
    uploadImageMiddleware,
    createBookController
)

router.patch('/admin/book/',
    requireAuth,
    requireRole(Role.admin),
    uploadSingleImage,
    uploadImageMiddleware,
    deleteImageController,
    updateBookController
)

router.delete('/admin/book/:id',
    requireAuth,
    requireRole(Role.admin),
    deleteBookController
)

router.delete('/image',
    requireAuth,
    requireRole(Role.admin),
    deleteImageController
)


export default router
