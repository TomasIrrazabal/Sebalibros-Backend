import { supabase } from "../config/supabase";

const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'



export function buildPublicUrl(projectUrl: string, path: string) {
    return `${projectUrl}`
}

export function publicUrl(bucket: string, path: string) {
    const base = process.env.SUPABASE_URL
    const cleanPath = path.replace(/^\/+/, '');
    return `${base}/storage/v1/object/public/${bucket}/${(cleanPath)}`
}

export function splitPublicUrl(fullUrl: string) {
    const baseUrl = 'https://hyclluqzwfzdmworaobk.supabase.co/storage/v1/object/public/imagenes-libros/libros/';

    const parts = fullUrl.split(baseUrl);
    console.log(parts[1])
    return parts[1];
}



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
