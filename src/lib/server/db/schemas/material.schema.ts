import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.schema';

export const learningMaterials = pgTable('learning_materials', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    workspaceId: uuid('workspace_id')
        .notNull()
        .references(() => workspaces.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    generatedDate: date('generated_date')
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

export const learningMaterialsRelations = relations(learningMaterials, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [learningMaterials.workspaceId],
        references: [workspaces.id],
    })
}));