import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';
import { sql } from 'drizzle-orm';

export const profile = sqliteTable('profile', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: 'cascade' }),
    interest: text('interest').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});
