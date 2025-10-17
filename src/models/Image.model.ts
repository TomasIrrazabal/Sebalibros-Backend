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
    return response.data.length != 0
}



export async function createImageModel(file: Express.Multer.File, filePath: string): Promise<string> {

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET + '/libros')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype
        })

    if (uploadError) {
        console.error('[Model Error] createImageModel:', uploadError)
        throw new Error('DATABASE_ERROR')
    }
    const { data } = supabase.storage
        .from(BUCKET + '/libros')
        .getPublicUrl(uploadData.path)

    if (!data) throw new Error("No se pudo recuperar la url de la imagen.");

    return data.publicUrl

}

export async function deleteImageModel(filePath: string) {
    const response = await supabase
        .storage
        .from(BUCKET)
        .remove([`libros/${filePath}`])

    console.log('Se elimino la imagen')
    if (response.error) {
        console.error('[Model Error] deleteImageModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
}