import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (!locals.user) {
        throw redirect(303, "/auth/login");
    }

    const res = await fetch(
        '/api/workspaces',
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    const workspaceResults = await res.json();

    return {
        workspaces: workspaceResults
    }
}