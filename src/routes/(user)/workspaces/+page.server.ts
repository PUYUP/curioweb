import { db } from "$lib/server/db";
import { workspaces } from "$lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, "/auth/login");
    }

    const workspaceResults = await db.select().from(workspaces).where(eq(workspaces.userId, locals.user.id));

    return {
        workspaces: workspaceResults
    }
}