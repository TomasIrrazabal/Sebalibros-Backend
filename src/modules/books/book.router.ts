import express from 'express'
import { createBookController, deleteBookController, deleteImageController, getABookController, getBooksController, updateBookController } from './controller/book.controller'
import { uploadImageMiddleware } from './middleware/image.middleware'
import { uploadSingleImage } from '../../config/multerConfig'

const router = express.Router()

router.get('/books',
    getBooksController

)

router.get('/books/:id',
    getABookController
)



router.post('/admin/book',
    uploadSingleImage,
    uploadImageMiddleware,
    createBookController
)

router.patch('/admin/book/',
    uploadSingleImage,
    uploadImageMiddleware,
    updateBookController
)



router.delete('/admin/book/:id',
    deleteBookController
)



router.delete('/image',
    deleteImageController
)

// router.post('/contact', (req, res) => {
//     const { email } = req.body
//     res.json({ email: email })

// })


export default router