import { getNotes } from "@/lib/server/db/factories/workspace.factory";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const workspaceId = params.id;
    const notes = await getNotes(workspaceId);

    return {
        workspaceId: params.id,
        notes: notes
    };
};