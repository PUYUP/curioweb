import { and, eq } from "drizzle-orm";
import { db } from "..";
import { workspaceMembers } from "../schemas/workspace.schema";
import { getUserByEmail } from "./user.factory";

export type WorkspaceRole = 'member' | 'admin';

export interface AddMember {
    workspace_id: string;
    email_address: string;
    role: WorkspaceRole;
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