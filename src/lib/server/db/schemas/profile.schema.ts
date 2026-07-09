import { pgTable, text, timestamp, vector } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';
import { sql } from 'drizzle-orm';

export const profile = pgTable('profile', {
    id: text('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: text('user_id')
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: 'cascade' }),
    interest: text('interest').notNull(),
    interestEmbedding: vector('interest_embedding', { dimensions: 1024 }),
    languageCode: text('language_code').notNull().default('en'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});
