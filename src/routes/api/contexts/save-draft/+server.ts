import { contextFactory } from "@/lib/server/db/factories/context.factory";
import { researchContexts } from "@/lib/server/db/schemas/workspace.schema";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request, locals }: RequestEvent) {
    if (!locals.user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    }

    const payload: typeof researchContexts.$inferInsert = await request.json();
    payload.userId = locals.user.id;

    try {
        const result = await contextFactory.saveContext(payload);
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message: "Failed to save context" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}