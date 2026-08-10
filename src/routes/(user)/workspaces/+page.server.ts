import { db } from "$lib/server/db";
import { workspaceMembers, workspaces } from "$lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { desc, eq, inArray, or } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/auth/login");
    }

    const memberWorkspaceIds = db
        .select({ workspaceId: workspaceMembers.workspaceId })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, locals.user.id));

    const workspaceResults = await db.select()
        .from(workspaces)
        .where(
            or(
                eq(workspaces.userId, locals.user.id),      // dia owner
                inArray(workspaces.id, memberWorkspaceIds)   // dia member
            )
        )
        .orderBy(desc(workspaces.createdAt));

    return {
        workspaces: workspaceResults
    }
}