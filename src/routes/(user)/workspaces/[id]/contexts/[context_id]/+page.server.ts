import { db } from "@/lib/server/db";
import { papers } from "@/lib/server/db/schemas/paper.schema.js";
import { contextChunks, contextSimilarities, researchContexts, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { eq, getTableColumns, asc, desc } from "drizzle-orm";

export const load = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const contextId = params.context_id;
    const subscription = (locals.user as any).subscription;
    const subscriptionActive = subscription?.status === "active";

    try {
        const result = await db.query.researchContexts.findFirst({
            where: eq(researchContexts.id, contextId),
            with: {
                workspace: true,
                paperSummaries: {
                    with: {
                        paper: true,
                    }
                },
                contextSimilarities: {
                    with: {
                        paper: true,
                        contextChunk: true,
                    }
                },
                chunks: true,
            },
        });

        const summaries = result?.paperSummaries ?? [];
        const similarities = result?.contextSimilarities ?? [];
        const matchResults = result?.chunks?.map((c: any) => {
            const similarsByChunk = similarities.filter((s: any) => s.contextChunkId === c.id);
            const top3Ids = new Set(similarsByChunk.slice(0, 3).map((s: any) => s.id));

            // Map untuk mengelompokkan data berdasarkan paperId
            const paperMap = new Map<string, any>();

            for (const item of similarsByChunk) {
                const { paper, paperId, id, documentContent, similarityScore, createdAt, updatedAt } = item;

                // Logika masking paper sesuai status langganan
                const resolvedPaper = (!subscriptionActive && top3Ids.has(id)) ? null : paper;

                if (!paperMap.has(paperId)) {
                    paperMap.set(paperId, {
                        paperId,
                        paper: resolvedPaper,
                        totalSimilarityScore: 0, // Akumulator untuk sum
                        documentChunks: [],
                    });
                }

                const currentGroup = paperMap.get(paperId);

                // Tambahkan skor ke total
                currentGroup.totalSimilarityScore += similarityScore;

                // Masukkan detail chunk ke dalam array
                currentGroup.documentChunks.push({
                    id,
                    documentContent,
                    similarityScore,
                    createdAt,
                    updatedAt,
                });
            }

            // Proses map untuk mengubah object dan menghitung rata-rata
            const groupedSimilarities = Array.from(paperMap.values()).map(group => {
                return {
                    paperId: group.paperId,
                    paper: group.paper,
                    // Hitung rata-rata: total skor dibagi jumlah chunk
                    averageSimilarityScore: group.totalSimilarityScore / group.documentChunks.length,
                    documentChunks: group.documentChunks,
                    summaryContent: summaries.find((s: any) => s.paperId === group.paperId)?.content,
                };
            });

            // (Opsional) Urutkan dari rata-rata similarity score tertinggi ke terendah
            groupedSimilarities.sort((a: any, b: any) => b.averageSimilarityScore - a.averageSimilarityScore);

            return {
                ...c,
                similarities: groupedSimilarities,
            };
        });

        return {
            context: {
                ...result,
                chunks: result?.chunks,
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