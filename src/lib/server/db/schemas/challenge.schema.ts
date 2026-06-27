import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';

export const challenges = sqliteTable('challenges', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    code: text('code').notNull().unique(),
    targetDate: integer('target_date', { mode: 'timestamp_ms' }).notNull(),
    status: text('status', { enum: ['pending', 'active', 'completed', 'read', 'rejected'] })
        .default('pending')
        .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});