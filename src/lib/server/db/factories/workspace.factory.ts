import { and, eq, desc, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { workspaceMembers, workspaceNotes } from "../schemas/workspace.schema";
import { getUserByEmail } from "./user.factory";
import { user } from "../auth.schema";

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
        const result = await db.insert(workspaceNotes).values({
            userId: payload.user_id,
            workspaceId: payload.workspace_id,
            title: payload.title,
            content: payload.content,
        });
        return result;
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
}

export const getNotes = async (workspaceId: string) => {
    try {
        const notes = await db.select({
            ...getTableColumns(workspaceNotes),
            user: getTableColumns(user),
        })
            .from(workspaceNotes)
            .leftJoin(user, eq(workspaceNotes.userId, user.id))
            .where(eq(workspaceNotes.workspaceId, workspaceId))
            .orderBy(desc(workspaceNotes.createdAt));
        return notes;
    } catch (error) {
        console.error("Error getting notes:", error);
        throw error;
    }
}

export const getNoteById = async (noteId: string) => {
    try {
        const [note] = await db.select({
            ...getTableColumns(workspaceNotes),
            user: getTableColumns(user),
        })
            .from(workspaceNotes)
            .leftJoin(user, eq(workspaceNotes.userId, user.id))
            .where(eq(workspaceNotes.id, noteId))
            .limit(1);
        return note;
    } catch (error) {
        console.error("Error getting note by id:", error);
        throw error;
    }
}

export const updateNote = async (noteId: string, payload: { title?: string, content: string }) => {
    try {
        const result = await db.update(workspaceNotes).set({
            title: payload.title,
            content: payload.content,
        }).where(eq(workspaceNotes.id, noteId));
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