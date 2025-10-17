import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controller/Image.controller';

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/uploadimage',
    upload.single('image'),
    uploadImage
)

export default router