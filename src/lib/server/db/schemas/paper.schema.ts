import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const papers = pgTable('papers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    abstract: text('abstract').notNull(),
    repository: text('repository').notNull(),
    identifier: text('identifier').notNull().unique(),
    pdfUrl: text('pdf_url'),
    fieldsOfStudy: text('fields_of_study').array().notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});