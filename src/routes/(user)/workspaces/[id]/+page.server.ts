import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
import { workspaces } from "$lib/server/db/schemas/workspace.schema.js";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    try {
        const [result] = await db.select()
            .from(workspaces)
            .where(eq(workspaces.id, params.id))
            .limit(1);

        return { workspace: result };
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return { workspace: null };
    }
};