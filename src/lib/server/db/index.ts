// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/pg-proxy';
import * as schema from './schemas/schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const pool = new Pool({
//     connectionString: env.DATABASE_URL,
// });

// export const db = drizzle(pool, { schema });

export const db = drizzle(async (sql, params, method) => {
    try {
        // Tembak URL Cloudflare Tunnel Anda yang mengarah ke proxy lokal
        const response = await fetch('https://supabase.atlanize.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql, params, method }),
        });

        if (!response.ok) {
            throw new Error(`Proxy error: ${response.statusText}`);
        }

        const result = await response.json();
        return { rows: result.rows };
    } catch (e: any) {
        console.error('Failed to run remote query via HTTP:', e);
        return { rows: [] };
    }
}, { schema });