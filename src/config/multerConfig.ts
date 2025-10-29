import multer from "multer";


// Guarda lo que recibe en memoria
const storage = multer.memoryStorage()


const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp']

    if (!allowed.includes(file.mimetype)) return cb(new Error('File type not allowed.'))

    cb(null, true);
}

export const upload = multer({
    storage,
    fileFilter
})

export const uploadSingleImage = upload.single('image')