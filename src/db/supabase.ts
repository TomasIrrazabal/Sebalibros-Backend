import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazily-initialized Supabase client used only for image storage.
// Initialization is deferred so the app can boot (and the DB layer work)
// even when the storage credentials are not configured. It only throws
// when storage is actually used without proper configuration.
let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
    if (client) return client

    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE

    if (!url || !key) {
        throw new Error('Supabase storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE).')
    }

    client = createClient(url, key, { auth: { persistSession: false } })
    return client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const c = getClient()
        const value = (c as any)[prop]
        return typeof value === 'function' ? value.bind(c) : value
    }
})