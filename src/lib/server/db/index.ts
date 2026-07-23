// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from './schemas/schema';
// import { env } from '$env/dynamic/private';

// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const pool = new Pool({
//     connectionString: env.DATABASE_URL,
// });

// export const db = drizzle(pool, { schema });

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