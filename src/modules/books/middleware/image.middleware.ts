import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'node:crypto';
import path from 'node:path'
import { supabase } from '../../../config/supabase';
import { generateHashedImageName } from '../utils/image.utils';

const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'

export async function uploadImageMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { file } = req;

        if (!file) {
            // console.log('[uploadImageMiddleware] No file received, skipping upload.')
            return next()
        }

        // const ext = path.extname(file.originalname) || '.png';
        // const fileName = `${randomUUID()}${ext}`;
        const fileName = generateHashedImageName(file)

        const objectPath = `libros/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(objectPath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('[uploadImageMiddleware] uploadError:', uploadError);
            return res.status(500).json({ error: 'Cannot upload file to storage.' });
        }

        req.body.image = fileName;

        return next();
    }
    catch (error) {
        console.error('[uploadImageMiddleware] Fatal:', error);
        return res.status(500).json({ error: 'Internal Server Error while uploading image' });
    }
}
