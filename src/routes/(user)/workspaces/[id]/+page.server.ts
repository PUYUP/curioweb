import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
import { researchContexts, workspaces } from "$lib/server/db/schemas/workspace.schema.js";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const workspaceId = params.id;

    try {
        const [workspace] = await db.select()
            .from(workspaces)
            .where(eq(workspaces.id, workspaceId))
            .limit(1);

        const contexts = await db.select()
            .from(researchContexts)
            .where(eq(researchContexts.workspaceId, workspaceId));

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