import { materialFactory } from "@/lib/server/db/factories/material.factory";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const { material_id: materialId } = params;
    const material = await materialFactory.getByMaterialId(materialId);
    return {
        material
    };
}