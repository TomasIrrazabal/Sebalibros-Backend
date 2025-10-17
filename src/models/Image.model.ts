import { supabase } from "../config/supabase";



const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'

export async function uploadImageToDB(file: Express.Multer.File, filePath: string): Promise<string> {
    try {

        const { data: libroGuardado, error: errorList } = await supabase.storage
            .from(BUCKET)
            .list('libros', {
                limit: 50,
                offset: 0,
                search: `${file.originalname}`
            })

        if (errorList) {
            console.error("Error al listar archivos del storage:", errorList);
            throw new Error("Error al listar archivos del storage:", errorList)
        }


        if (libroGuardado.length == 0) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype
                })

            if (uploadError) {
                console.error("Error al subir a Supabase Storage:", uploadError);
                throw new Error("No se pudo subir la imagen.");
            }
            const { data } = supabase.storage
                .from(BUCKET)
                .getPublicUrl(uploadData.path)

            if (!data) throw new Error("No se pudo recuperar la url de la imagen.");

            const fullUrl = data.publicUrl
            const baseUrl = 'https://hyclluqzwfzdmworaobk.supabase.co/storage/v1/object/public/imagenes-libros/';

            const parts = fullUrl.split(baseUrl);

            filePath = parts[1];
        }
        return filePath

    } catch (e: any) {
        console.error("Error en subirImagen:", e.message);
        throw new Error(e.message ?? "Error desconocido al subir imagen");
    }
}