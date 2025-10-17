import express from 'express'
import multer from 'multer'
import { createImageController, deleteImageController } from '../controller/Image.controller';

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/image',
    upload.single('image'),
    createImageController
)

router.delete('/image',
    deleteImageController
)

export default router