import { relations, sql } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    varchar,
    text,
    bigint,
    char,
    jsonb,
    integer,
    timestamp,
    uniqueIndex,
    index,
    check
} from 'drizzle-orm/pg-core';

// -----------------------------------------------------------------------------
// 1. Tabel Files
// -----------------------------------------------------------------------------
export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    fileType: varchar('file_type', { length: 20 }).notNull(),
    disk: varchar('disk', { length: 50 }).notNull().default('local'), // 's3', 'gcs', 'local'
    path: text('path').notNull(), // key/path di storage bucket
    mediaLink: text('media_link'),
    originalFilename: text('original_filename').notNull(), // TEXT: hindari limit 255 char
    mimeType: varchar('mime_type', { length: 150 }).notNull(),
    extension: varchar('extension', { length: 20 }),

    // mode 'number' cukup aman untuk ukuran file (< 9000 TB).
    // Kalau butuh presisi > Number.MAX_SAFE_INTEGER, ganti ke mode: 'bigint'.
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),

    checksumSha256: char('checksum_sha256', { length: 64 }), // dedup & integrity check

    // Cth isi: { width: 1920, height: 1080, duration: 120 }
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' })
},
    (table) => [
        // Batasi file_type hanya nilai yang valid
        check(
            'files_file_type_check',
            sql`${table.fileType} IN ('image','pdf','audio','video','document','other')`
        ),

        // Cegah file fisik tertimpa di bucket yang sama
        uniqueIndex('idx_files_disk_path')
            .on(table.disk, table.path)
            .where(sql`${table.deletedAt} IS NULL`),

        // Query dashboard: file yang pernah diupload user tertentu
        index('idx_files_user_id').on(table.userId)
    ]
);

// -----------------------------------------------------------------------------
// 2. Tabel Attachments (pivot polymorphic)
// -----------------------------------------------------------------------------
export const attachments = pgTable('attachments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    fileId: uuid('file_id')
        .notNull()
        .references(() => files.id, { onDelete: 'cascade' }),

    entityType: varchar('entity_type', { length: 50 }).notNull(), // 'users', 'products', 'articles'
    entityId: uuid('entity_id').notNull(),
    purpose: varchar('purpose', { length: 50 }).default('default'), // 'avatar', 'cover', 'gallery'
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
},
    (table) => [
        // Cegah file yang sama terpasang dobel di entitas & purpose yang sama
        uniqueIndex('idx_attachments_unique_link').on(
            table.fileId,
            table.entityType,
            table.entityId,
            table.purpose
        ),

        // Load semua attachment milik satu entitas, urut sesuai sort_order
        index('idx_attachments_entity').on(table.entityType, table.entityId, table.sortOrder),

        // Lookup balik: file ini dipakai di attachment mana saja
        index('idx_attachments_file_id').on(table.fileId)
    ]
);

// -----------------------------------------------------------------------------
// Relations (opsional, memudahkan query pakai db.query.files.findMany({ with: {...} }))
// -----------------------------------------------------------------------------
export const filesRelations = relations(files, ({ many }) => ({
    attachments: many(attachments)
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
    file: one(files, {
        fields: [attachments.fileId],
        references: [files.id]
    })
}));

// -----------------------------------------------------------------------------
// Type inference, untuk dipakai di service/repository layer
// -----------------------------------------------------------------------------
export type FileRow = typeof files.$inferSelect;
export type NewFileRow = typeof files.$inferInsert;

export type AttachmentRow = typeof attachments.$inferSelect;
export type NewAttachmentRow = typeof attachments.$inferInsert;

// Typing
export type FilePayload = typeof files.$inferInsert;
export type AttachmentPayload = typeof attachments.$inferInsert;