import { evaluationFactory } from "@/lib/server/db/factories/evaluation.factory";
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

        const evaluation = await evaluationFactory.getMonthlyHotsSummary(userId);
        return new Response(JSON.stringify(evaluation), {
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