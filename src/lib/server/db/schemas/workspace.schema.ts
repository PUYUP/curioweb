import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, vector, uuid, integer, jsonb, unique } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const workspaces = pgTable('workspaces', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    description: text('description'),
    languageCode: text('language_code').notNull().default('en'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const researchContexts = pgTable('contexts', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    languageCode: text('language_code').notNull().default('en'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
});

export const contextChunks = pgTable('context_chunks', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    contextId: uuid('context_id')
        .notNull()
        .references(() => researchContexts.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    chunkIndex: integer('chunk_index').notNull(),
    attributes: jsonb('attributes'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
}, (table) => ({
    uniqueChunk: unique().on(table.userId, table.workspaceId, table.contextId, table.chunkIndex),
}));