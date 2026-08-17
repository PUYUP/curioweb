import type { PageServerLoad } from "./$types";
import { getMaterials } from "@/lib/server/db/factories/workspace.factory";

export const load: PageServerLoad = async ({ params }) => {
    const workspaceId = params.id;
    const materials = await getMaterials(workspaceId);

    return {
        workspaceId: params.id,
        materials: materials
    };
};