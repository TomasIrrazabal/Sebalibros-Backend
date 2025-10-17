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