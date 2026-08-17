import { and, eq, desc, inArray } from "drizzle-orm";
import { db } from "..";
import { workspaceMembers, workspaceNotes } from "../schemas/workspace.schema";
import { getUserByEmail } from "./user.factory";
import { attachments } from "../schemas/attachment.schema";
import { learningMaterials } from "../schemas/material.schema";

export type WorkspaceRole = 'member' | 'admin';

export interface AddMember {
    workspace_id: string;
    email_address: string;
    role: WorkspaceRole;
}

export interface AddNote {
    workspace_id: string;
    user_id: string;
    title?: string;
    content: string;
}

export const addMember = async (payload: AddMember) => {
    const { workspace_id, email_address, role } = payload;

    const user = await getUserByEmail(email_address);
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const result = await db.insert(workspaceMembers).values({
            workspaceId: workspace_id,
            userId: user.id,
            role,
        });

        return result;
    } catch (error) {
        console.error("Error adding member:", error);
        throw error;
    }
};

export const updateMember = async (workspaceId: string, userId: string, payload: { role: WorkspaceRole }) => {
    const { role } = payload;

    try {
        const result = await db.update(workspaceMembers).set({
            role,
        }).where(and(
            eq(workspaceMembers.userId, userId),
            eq(workspaceMembers.workspaceId, workspaceId)
        ));

        return result;
    } catch (error) {
        console.error("Error updating member:", error);
        throw error;
    }
}

export const removeMember = async (userId: string, workspaceId: string) => {
    try {
        const result = await db.delete(workspaceMembers)
            .where(and(
                eq(workspaceMembers.userId, userId),
                eq(workspaceMembers.workspaceId, workspaceId)
            ));
        return result;
    } catch (error) {
        console.error("Error removing member:", error);
        throw error;
    }
}

export const addNote = async (payload: AddNote) => {
    try {
        const [result] = await db.insert(workspaceNotes).values({
            userId: payload.user_id,
            workspaceId: payload.workspace_id,
            title: payload.title,
            content: payload.content,
        }).returning();
        return result;
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
}

export const getNotes = async (workspaceId: string) => {
    try {
        const notes = await db.query.workspaceNotes.findMany({
            where: eq(workspaceNotes.workspaceId, workspaceId),
            orderBy: desc(workspaceNotes.createdAt),
            with: {
                user: true,
            },
        });

        if (notes.length === 0) {
            return notes.map((note) => ({ ...note, attachments: [] }));
        }

        const noteIds = notes.map((note) => note.id);

        const noteAttachments = await db.query.attachments.findMany({
            where: and(
                inArray(attachments.entityId, noteIds)
            ),
            with: {
                file: true,
            },
        });

        const attachmentsByNoteId = new Map<string, typeof noteAttachments>();
        for (const attachment of noteAttachments) {
            const list = attachmentsByNoteId.get(attachment.entityId) ?? [];
            list.push(attachment);
            attachmentsByNoteId.set(attachment.entityId, list);
        }

        return notes.map((note) => ({
            ...note,
            attachments: attachmentsByNoteId.get(note.id) ?? [],
        }));
    } catch (error) {
        console.error("Error getting notes:", error);
        throw error;
    }
};

export const getNoteById = async (noteId: string) => {
    try {
        const note = await db.query.workspaceNotes.findFirst({
            where: eq(workspaceNotes.id, noteId),
            with: {
                user: true,
            },
        });

        if (!note) {
            return note;
        }

        const noteAttachments = await db.query.attachments.findMany({
            where: and(
                eq(attachments.entityId, noteId)
            ),
            with: {
                file: true,
            },
        });

        return {
            ...note,
            attachments: noteAttachments,
        };
    } catch (error) {
        console.error("Error getting note by id:", error);
        throw error;
    }
};

export const updateNote = async (noteId: string, payload: { title?: string, content: string }) => {
    try {
        const [result] = await db.update(workspaceNotes)
            .set({
                title: payload.title,
                content: payload.content,
            })
            .where(eq(workspaceNotes.id, noteId))
            .returning();
        return result;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
}

export const deleteNote = async (noteId: string, userId: string) => {
    try {
        const result = await db.delete(workspaceNotes)
            .where(and(
                eq(workspaceNotes.id, noteId),
                eq(workspaceNotes.userId, userId)
            ));
        return result;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
}

export const getMaterials = async (workspaceId: string) => {
    try {
        const materials = await db.query.learningMaterials.findMany({
            where: eq(learningMaterials.workspaceId, workspaceId),
            with: {
                workspace: true
            }
        });

        if (materials.length === 0) {
            return materials.map((material) => ({ ...material, attachments: [] }));
        }

        const materialIds = materials.map((material) => material.id);

        const materialAttachments = await db.query.attachments.findMany({
            where: and(
                inArray(attachments.entityId, materialIds)
            ),
            with: {
                file: true,
            },
        });

        const attachmentsByMaterialId = new Map<string, typeof materialAttachments>();
        for (const attachment of materialAttachments) {
            const list = attachmentsByMaterialId.get(attachment.entityId) ?? [];
            list.push(attachment);
            attachmentsByMaterialId.set(attachment.entityId, list);
        }

        return materials.map((material) => ({
            ...material,
            attachments: attachmentsByMaterialId.get(material.id) ?? [],
        }));
    } catch (error) {
        console.error("Error getting materials:", error);
        throw error;
    }
}