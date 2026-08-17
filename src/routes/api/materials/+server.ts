import { materialFactory } from "@/lib/server/db/factories/material.factory";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ locals, url }: RequestEvent) {
    try {
        const userId = locals.user?.id;

        if (!userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 401
            });
        }

        const limit = Number(url.searchParams.get('limit') ?? 10);
        const offset = Number(url.searchParams.get('offset') ?? 0);

        const materials = await materialFactory.getByUserId(userId, { limit, offset });
        return new Response(JSON.stringify(materials), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to get materials" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}