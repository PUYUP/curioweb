import { db } from "$lib/server/db";
import { papers } from "@/lib/server/db/schemas/paper.schema.js";
import { contextChunks, contextSimilarities, researchContexts, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { eq, getTableColumns, asc, desc } from "drizzle-orm";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const contextId = params.context_id;

    try {
        const [context] = await db.select({
            ...getTableColumns(researchContexts),
            workspace: workspaces,
        })
            .from(researchContexts)
            .leftJoin(workspaces, eq(researchContexts.workspaceId, workspaces.id))
            .where(eq(researchContexts.id, contextId))
            .limit(1);

        const chunks = await db.select()
            .from(contextChunks)
            .where(eq(contextChunks.contextId, contextId))
            .orderBy(asc(contextChunks.chunkIndex));

        const similarities = await db.select({
            ...getTableColumns(contextSimilarities),
            paper: papers,
        })
            .from(contextSimilarities)
            .leftJoin(papers, eq(papers.id, contextSimilarities.paperId))
            .where(eq(contextSimilarities.contextId, contextId))
            .orderBy(desc(contextSimilarities.similarityScore));

        const matchResults = chunks.map((c: any) => {
            return {
                ...c,
                similarities: similarities.filter((s: any) => s.contextChunkId === c.id),
            };
        });

        return {
            context: {
                ...context,
                chunks: chunks,
                matchResults: matchResults,
                hasSimilarity: similarities && similarities.length > 0,
            },
        };
    } catch (error) {
        console.error("Error fetching context:", error);
        return {
            context: null,
        };
    }
};