import { db } from "$lib/server/db";
import { workspaces } from "$lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/auth/login");
    }

    const workspaceResults = await db.select()
        .from(workspaces)
        .where(eq(workspaces.userId, locals.user.id))
        .orderBy(desc(workspaces.createdAt));

    return {
        workspaces: workspaceResults
    }
}