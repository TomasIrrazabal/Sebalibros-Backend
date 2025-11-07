import express from 'express'
import { createBookController, deleteBookController, deleteImageController, getABookController, getBooksController, updateBookController } from './book.controller'
import { uploadImageMiddleware } from './middleware/image.middleware'
import { uploadSingleImage } from '../../config/multerConfig'
import { requireAuth } from '../../utils/jwt'

const router = express.Router()

router.get('/books',
    getBooksController

)

router.get('/books/:id',
    getABookController
)



router.post('/admin/book',
    requireAuth,
    uploadSingleImage,
    uploadImageMiddleware,
    createBookController
)

router.patch('/admin/book/',
    requireAuth,
    uploadSingleImage,
    uploadImageMiddleware,
    deleteImageController,
    updateBookController
)



router.delete('/admin/book/:id',
    requireAuth,
    deleteBookController
)



router.delete('/image',
    requireAuth,
    deleteImageController
)


export default router