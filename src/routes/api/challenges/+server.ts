import { challengeFactory } from "@/lib/server/db/factories/challenge.factory";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
    const data = await request.json();

    try {
        const challenge = await challengeFactory.insert(data);
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

        const challenges = await challengeFactory.getByUserId(userId, { limit, offset });
        return new Response(JSON.stringify(challenges), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to get challenges" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}