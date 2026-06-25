import { Pool, types } from "pg";

// int8 (bigint) columns are returned as strings by node-postgres to avoid
// precision loss. The app treats ids as numbers, so parse them back to Number.
types.setTypeParser(20, (value) => parseInt(value, 10));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Database connection cannot be established.');
}

// Enable SSL only when the connection string asks for it (e.g. managed
// providers). A local Postgres usually runs without SSL.
const useSsl = /sslmode=(require|prefer|verify)/.test(connectionString);

export const pool = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
})

pool.on('error', (err) => {
    console.error('[Pool Error] Unexpected error on idle client:', err)
})
