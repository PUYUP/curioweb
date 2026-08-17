import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, vector, uuid, integer, jsonb, unique, real, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';
import { papers } from './paper.schema';
import { attachments } from './attachment.schema';
import { workspaces } from './workspace.schema';


export const learningMaterials = pgTable('learning_materials', {
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
    generatedDate: timestamp('generated_date', { mode: 'date' })
        .defaultNow()
        .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
        .default(sql`null`),
});
