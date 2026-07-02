import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';
import { sql } from 'drizzle-orm';

export const challenges = pgTable('challenges', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    code: text('code').notNull().unique(),
    targetDate: timestamp('target_date', { mode: 'date' }).notNull(),
    status: text('status', { enum: ['pending', 'active', 'completed', 'read', 'rejected'] })
        .default('pending')
        .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});