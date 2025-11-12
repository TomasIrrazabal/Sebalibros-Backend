import express from 'express'
import { createBookController, deleteBookController, deleteImageController, getABookController, getBooksController, updateBookController } from './book.controller'
import { uploadImageMiddleware } from './middleware/image.middleware'
import { uploadSingleImage } from '../../config/multerConfig'
import { requireAuth, requireRole } from '../../middleware/jwt'
import { Role } from '../../utils/user.types'

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
    uploadSingleImage,
    uploadImageMiddleware,
    createBookController
)

router.patch('/admin/book/',
    uploadSingleImage,
    uploadImageMiddleware,
    deleteImageController,
    updateBookController
)

router.delete('/admin/book/:id',
    deleteBookController
)

router.delete('/image',
    deleteImageController
)


export default router
