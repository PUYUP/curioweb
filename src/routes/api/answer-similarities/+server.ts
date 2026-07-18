import { challengeFactory } from "@/lib/server/db/factories/challenge.factory";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ locals, url }: RequestEvent) {
    try {
        const userId = locals.user?.id;
        const challengePaperId = url.searchParams.get('challengePaperId');

        if (!userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 401
            });
        }

        if (!challengePaperId) {
            return new Response(JSON.stringify({ message: "Challenge paper id is required" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            });
        }

        const answerSimilarities = await challengeFactory.getAnswerSimilaritiesByChallengeId(challengePaperId, userId);
        return new Response(JSON.stringify(answerSimilarities), {
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