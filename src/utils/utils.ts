export function buildPublicUrl(projectUrl: string, path: string) {
    return `${projectUrl}`
}

export function publicUrl(bucket: string, path: string) {
    const base = process.env.SUPABASE_URL
    const cleanPath = path.replace(/^\/+/, '');
    return `${base}/storage/v1/object/public/${bucket}/${(cleanPath)}`
}
