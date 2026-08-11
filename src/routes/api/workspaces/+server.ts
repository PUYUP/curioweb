import { db } from "$lib/server/db";
import { workspaceMembers, workspaces } from "$lib/server/db/schemas/workspace.schema";
import { json } from "@sveltejs/kit";
import { count, desc, eq, getTableColumns, inArray, or, and } from "drizzle-orm";
import type { RequestEvent } from "./$types";
import { alias } from "drizzle-orm/pg-core";

export const GET = async ({ locals }: RequestEvent) => {
    if (!locals.user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const userId = locals.user.id;
    const memberWorkspaceIds = db
        .select({ workspaceId: workspaceMembers.workspaceId })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, userId));

    const currentUserMembership = alias(workspaceMembers, "current_user_membership");
    const workspaceResults = await db.select({
        ...getTableColumns(workspaces),
        memberCount: count(workspaceMembers.id),
        currentUserRole: currentUserMembership.role
    })
        .from(workspaces)
        .leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
        .leftJoin(
            currentUserMembership,
            and(
                eq(currentUserMembership.workspaceId, workspaces.id),
                eq(currentUserMembership.userId, userId)
            )
        )
        .where(
            or(
                eq(workspaces.userId, userId),      // dia owner
                inArray(workspaces.id, memberWorkspaceIds)   // dia member
            )
        )
        .groupBy(workspaces.id, currentUserMembership.id)
        .orderBy(desc(workspaces.createdAt));

    return new Response(JSON.stringify(workspaceResults), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}