import { challengeFactory } from "@/lib/server/db/factories/challenge.factory";
import type { SaveAnswerInput } from "@/lib/types/models";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
    const data: SaveAnswerInput = await request.json();

    try {
        const result = await challengeFactory.saveAnswer(data);
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