import { db } from "$lib/server/db";
import { researchContexts, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { eq, getTableColumns } from "drizzle-orm";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const contextId = params.context_id;

    try {
        const [context] = await db.select({
            ...getTableColumns(researchContexts),
            workspace: workspaces,
        })
            .from(researchContexts)
            .leftJoin(workspaces, eq(researchContexts.workspaceId, workspaces.id))
            .where(eq(researchContexts.id, contextId))
            .limit(1);

        return {
            context: context,
        };
    } catch (error) {
        console.error("Error fetching context:", error);
        return {
            context: null,
        };
    }
};