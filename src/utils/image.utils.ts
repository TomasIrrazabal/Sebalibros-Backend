import crypto from 'node:crypto'
import { supabase } from "../config/supabase";


const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'


export async function isImageSaved(fileName: string) {
    const response = await supabase.storage
        .from(BUCKET)
        .list('libros', {
            limit: 50,
            offset: 0,
            search: `${fileName}`
        })

    if (response.error) {
        console.error('[Model Error] getABookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    if (response.data.length != 0) {
        return { response: true, name: response.data[0].name }
    } else {
        return { response: false }
    }
}

export function generateHashedImageName(file: Express.Multer.File): string {

    const extParts = file.originalname.split('.');
    const ext = extParts.length > 1 ? extParts.pop() : 'png';

    const baseToHash = Buffer.concat([
        file.buffer,
        Buffer.from(Date.now().toString(), 'utf8'),
    ]);

    const hash = crypto.createHash('sha256').update(baseToHash).digest('hex');

    return `${hash}.${ext}`;
}