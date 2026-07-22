// // // import { Pool } from 'pg';
// // // import { drizzle } from 'drizzle-orm/node-postgres';
// // import { drizzle } from 'drizzle-orm/pg-proxy';
// // import * as schema from './schemas/schema';
// // import { env } from '$env/dynamic/private';

// // if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// // // const pool = new Pool({
// // //     connectionString: env.DATABASE_URL,
// // // });

// // // export const db = drizzle(pool, { schema });

// // export const db = drizzle(async (sql, params, method) => {
// //     try {
// //         // Tembak URL Cloudflare Tunnel Anda yang mengarah ke proxy lokal
// //         const response = await fetch('https://supabase.atlanize.com', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({ sql, params, method }),
// //         });

// //         if (!response.ok) {
// //             throw new Error(`Proxy error: ${response.statusText}`);
// //         }

// //         const result = await response.json();
// //         return { rows: result.rows };
// //     } catch (e: any) {
// //         console.error('Failed to run remote query via HTTP:', e);
// //         return { rows: [] };
// //     }
// // }, { schema });


// import { createClient } from '@supabase/supabase-js';
// import * as schema from './schemas/schema';
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres';

// // 1. Buat client Supabase standar menggunakan URL Cloudflare Tunnel Anda
// // Gunakan Service Role Key (bukan anon key) agar Drizzle punya akses penuh ke tabel Better Auth
// const supabaseClient = createClient(
//     'https://supabase.atlanize.com',
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // 2. Inisialisasi Drizzle via HTTP client Supabase (Tanpa TCP sama sekali!)
// const client = postgres(connectionString, { prepare: false })
// export const db = drizzle(supabaseClient, { schema });

import { drizzle } from 'drizzle-orm/pg-proxy';
import * as schema from './schemas/schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_PROXY_URL) throw new Error('DATABASE_PROXY_URL is not set');
if (!env.DATABASE_PROXY_SECRET) throw new Error('DATABASE_PROXY_SECRET is not set');

export const db = drizzle(async (sql, params, method) => {
    const response = await fetch(env.DATABASE_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.DATABASE_PROXY_SECRET}`,
        },
        body: JSON.stringify({ sql, params, method }),
    });

    if (!response.ok) {
        throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
    }

    const { rows } = await response.json();
    return { rows };
}, { schema });