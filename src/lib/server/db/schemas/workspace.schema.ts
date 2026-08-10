import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, vector, uuid, integer, jsonb, unique, real, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';
import { papers } from './paper.schema';

export const workspaces = pgTable('workspaces', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    description: text('description'),
    languageCode: text('language_code').notNull().default('en'),
    scope: text('scope').notNull().default('individual'),
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
    status: text('status').notNull().default('draft'),
    submittedAt: timestamp('submitted_at', { withTimezone: true, mode: 'date' }),
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

export const contextSimilarities = pgTable('context_similarities', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    paperId: uuid('paper_id')
        .notNull()
        .references(() => papers.id, { onDelete: 'cascade' }),
    contextId: uuid('context_id')
        .notNull()
        .references(() => researchContexts.id, { onDelete: 'cascade' }),
    contextChunkId: uuid('context_chunk_id')
        .notNull()
        .references(() => contextChunks.id, { onDelete: 'cascade' }),
    documentContent: text('document_content').notNull(),
    similarityScore: real('similarity_score').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
});

export const workspaceMembers = pgTable('workspace_members', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('member'),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
}, (table) => ({
    uniqueMembership: uniqueIndex('unique_membership')
        .on(table.userId, table.workspaceId),
}));


/*****
 * Relationship
 */

export const usersWorkspaceRelations = relations(user, ({ many }) => ({
    workspaceMembers: many(workspaceMembers),
}));

export const workspacesUserRelations = relations(workspaces, ({ many }) => ({
    members: many(workspaceMembers),
}));