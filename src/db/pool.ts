import { Pool } from "pg";

const isProduction = process.env.SUPABASE_DB_URL === 'production';

export const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
})