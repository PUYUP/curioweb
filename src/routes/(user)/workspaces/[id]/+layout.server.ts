import { db } from "$lib/server/db";
import { eq, desc, getTableColumns, count, and } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
import { researchContexts, workspaceMembers, workspaces } from "$lib/server/db/schemas/workspace.schema.js";
import { alias } from "drizzle-orm/pg-core";

const currentUserMembership = alias(workspaceMembers, "current_user_membership");

export const load = async ({ locals, params }) => {
    const workspaceId = params.id;
    const userId = locals.user?.id;

    if (!userId) {
        return redirect(302, '/auth/login');
    }

    try {
        const [workspace] = await db.select(
            {
                ...getTableColumns(workspaces),
                memberCount: count(workspaceMembers.id),
                currentUserRole: currentUserMembership.role,
            }
        )
            .from(workspaces)
            .leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
            .leftJoin(
                currentUserMembership,
                and(
                    eq(currentUserMembership.workspaceId, workspaces.id),
                    eq(currentUserMembership.userId, userId)
                )
            )
            .where(eq(workspaces.id, workspaceId))
            .groupBy(workspaces.id, currentUserMembership.role)
            .limit(1);

        const contexts = await db.select()
            .from(researchContexts)
            .where(eq(researchContexts.workspaceId, workspaceId))
            .orderBy(desc(researchContexts.createdAt));

        return {
            workspace: workspace,
            contexts: contexts
        };
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return {
            workspace: null,
            contexts: []
        };
    }
};