import { db } from "$lib/server/db";
import { researchContexts } from "@/lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const contextId = params.context_id;

    try {
        const [context] = await db.select()
            .from(researchContexts)
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