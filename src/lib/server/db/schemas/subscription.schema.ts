import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';
import { sql } from 'drizzle-orm';

export const subscriptions = pgTable('subscriptions', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull(),
    productName: text('product_name').notNull(),
    status: text('status').notNull().default('pending'),
    startDate: timestamp('start_date', { mode: 'date' }),
    endDate: timestamp('end_date', { mode: 'date' }),
    canceledAt: timestamp('canceled_at', { mode: 'date' }),
    attributes: jsonb('attributes'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
});
