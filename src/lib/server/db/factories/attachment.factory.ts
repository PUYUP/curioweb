import { eq, and, isNull, asc } from "drizzle-orm";
import { db } from "../index";
import { files, attachments, type NewFileRow, type NewAttachmentRow } from "../schemas/attachment.schema";

// ==========================================
// FILES CRUD
// ==========================================

export const createFile = async (data: NewFileRow) => {
    const res = await db.insert(files).values(data).returning();
    return res.length > 0 ? res[0] : null;
};

export const getFileById = async (id: string) => {
    const res = await db.select().from(files).where(and(eq(files.id, id), isNull(files.deletedAt))).limit(1);
    return res.length > 0 ? res[0] : null;
};

export const getFilesByUserId = async (userId: string) => {
    return await db.select().from(files).where(and(eq(files.userId, userId), isNull(files.deletedAt)));
};

export const updateFile = async (id: string, data: Partial<NewFileRow>) => {
    const res = await db.update(files)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(files.id, id))
        .returning();
    return res.length > 0 ? res[0] : null;
};

export const deleteFile = async (id: string) => {
    const res = await db.update(files)
        .set({ deletedAt: new Date().toISOString() })
        .where(eq(files.id, id))
        .returning();
    return res.length > 0 ? res[0] : null;
};

export const hardDeleteFile = async (id: string) => {
    const res = await db.delete(files).where(eq(files.id, id)).returning();
    return res.length > 0 ? res[0] : null;
};

// ==========================================
// ATTACHMENTS CRUD
// ==========================================

export const createAttachment = async (data: NewAttachmentRow) => {
    const res = await db.insert(attachments).values(data).returning();
    return res.length > 0 ? res[0] : null;
};

export const createAttachments = async (data: NewAttachmentRow[]) => {
    if (data.length === 0) return [];
    return await db.insert(attachments).values(data).returning();
};

export const getAttachmentsByEntity = async (entityType: string, entityId: string) => {
    return await db.select()
        .from(attachments)
        .where(and(eq(attachments.entityType, entityType), eq(attachments.entityId, entityId)))
        .orderBy(asc(attachments.sortOrder));
};

export const getAttachmentById = async (id: string) => {
    const res = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
    return res.length > 0 ? res[0] : null;
};

export const updateAttachment = async (id: string, data: Partial<NewAttachmentRow>) => {
    const res = await db.update(attachments)
        .set(data)
        .where(eq(attachments.id, id))
        .returning();
    return res.length > 0 ? res[0] : null;
};

export const deleteAttachment = async (id: string) => {
    const res = await db.delete(attachments).where(eq(attachments.id, id)).returning();
    return res.length > 0 ? res[0] : null;
};

export const deleteAttachmentsByEntity = async (entityType: string, entityId: string) => {
    return await db.delete(attachments)
        .where(and(eq(attachments.entityType, entityType), eq(attachments.entityId, entityId)))
        .returning();
};
