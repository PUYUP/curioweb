import { challengeFactory } from "@/lib/server/db/factories/challenge.factory";
import type { SaveAnswerInput } from "@/lib/types/models";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request, locals }: RequestEvent) {
    if (!locals.user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    }

    const payload: SaveAnswerInput = await request.json();
    payload.userId = locals.user.id;

    try {
        const result = await challengeFactory.saveAnswer(payload);
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to save answer" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}