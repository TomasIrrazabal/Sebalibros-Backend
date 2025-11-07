import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE

if (!url || !key) {
    throw new Error('Error establishing a database connection.')
}

export const supabase: SupabaseClient = createClient(url, key, { auth: { persistSession: false } })