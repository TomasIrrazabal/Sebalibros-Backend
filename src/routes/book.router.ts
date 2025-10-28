import express from 'express'
import { createBookController, deleteBookController, getABookController, getBooksController, updateBookController } from '../controller/book.controller'

const router = express.Router()

router.get('/books',
    getBooksController

)

router.get('/books/:id',
    getABookController
)



router.post('/admin/book',
    createBookController
)

router.patch('/admin/book/',
    updateBookController
)



router.delete('/admin/book/:id',
    deleteBookController
)



// router.post('/contact', (req, res) => {
//     const { email } = req.body
//     res.json({ email: email })

// })


router.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

export default router