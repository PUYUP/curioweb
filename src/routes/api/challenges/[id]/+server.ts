import { challengeFactory } from "@/lib/server/db/factories/challenge.factory";
import type { RequestEvent } from "@sveltejs/kit";

export async function PATCH({ request, params, locals }: RequestEvent) {
    const { id } = params;
    const userId = locals.user?.id;

    if (!userId) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    }

    if (!id) {
        return new Response(JSON.stringify({ message: "ID is required" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    }

    const data = await request.json();

    try {
        const challenge = await challengeFactory.updateStatus(id, userId, data.status);
        return new Response(JSON.stringify(challenge), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to create challenge" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}