import type { ChallengeStatus, ChallengeData, ChallengeResponse } from "@/lib/types/models.js";
import { db } from "../index.js";
import { challenges, challengePapers } from "../schemas/challenge.schema.js";
import { papers } from "../schemas/paper.schema.js";
import { and, eq, desc, sql, isNotNull } from "drizzle-orm/sql";
import { randomBytes } from "crypto";
import type { ChallengeFilter } from "@/lib/types/interfaces.js";
import { getTableColumns } from "drizzle-orm";

// Aggregate expression yang dipakai bersama: rangkum papers jadi array {title, pdfUrl}
const papersAgg = sql<{ title: string; pdfUrl: string }[]>`
    coalesce(
        json_agg(
            json_build_object(
                'title', ${papers.title},
                'pdfUrl', ${papers.pdfUrl}
            )
        ) filter (where ${papers.id} is not null),
        '[]'
    )
`.as("papers");

class ChallengeFactory {
    /**
     * Generate code for challenge
     * Format: PP-YYYYMMDD-SSSS
     * PP: 2 random chars from user id
     * YYYYMMDD: Current date
     * SSSS: Last 4 chars from user id
     * @param userId User id
     * @returns Code string
     */
    async generateCode(userId: string) {
        const uuidChars = userId.replace(/-/g, "").toUpperCase();
        const randomIndex = Math.floor(Math.random() * (uuidChars.length - 1));
        const prefix = uuidChars.slice(randomIndex, randomIndex + 2);
        const random = randomBytes(4).toString("hex").toUpperCase();

        return `${prefix}-${random}`;
    }

    /**
     * Insert a new challenge
     * @param data Challenge data
     * @returns Challenge object
     */
    async insert(data: ChallengeData) {
        const code = await this.generateCode(data.userId);
        try {
            const [result] = await db.insert(challenges)
                .values({
                    userId: data.userId,
                    code: code,
                    targetDate: new Date(data.targetDate),
                    status: data.status,
                })
                .returning();
            return result;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                throw new Error("Failed to create challenge", { cause: error });
            } else {
                throw new Error("Failed to create challenge");
            }
        }
    }

    /**
     * Get a challenge by code
     * @param code Challenge code
     * @returns Challenge object
     */
    async getByCode(code: string) {
        const results = await db.select()
            .from(challenges)
            .leftJoin(challengePapers, eq(challenges.id, challengePapers.challengeId))
            .leftJoin(papers, eq(challengePapers.paperId, papers.id))
            .where(eq(challenges.code, code));

        if (results.length === 0) return null;

        const challenge = results[0].challenges;
        const mappedPapers = results
            .filter((r) => r.challenge_papers !== null && r.papers !== null)
            .map((r) => ({
                ...r.challenge_papers!,
                paper: r.papers!
            }));

        return {
            ...challenge,
            challenge_papers: mappedPapers
        };
    }

    /**
     * Get all challenges by user id
     * @param userId User id
     * @returns Challenges array
     */
    async getByUserId(userId: string, filter: ChallengeFilter = { limit: 10, offset: 0 }) {
        try {
            const results = await db.select({
                ...getTableColumns(challenges),
                challenge_papers: papersAgg,
            })
                .from(challenges)
                .leftJoin(challengePapers, eq(challenges.id, challengePapers.challengeId))
                .leftJoin(papers, eq(challengePapers.paperId, papers.id))
                .where(
                    and(
                        eq(challenges.userId, userId),
                        isNotNull(challengePapers.processingResult)
                    )
                )
                .groupBy(challenges.id)
                .orderBy(desc(challenges.createdAt))
                .limit(filter.limit)
                .offset(filter.offset);

            return results;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get challenges", { cause: error });
            } else {
                throw new Error("Failed to get challenges");
            }
        }
    }

    /**
     * Update a challenge
     * @param id Challenge id
     * @param userId User id
     * @param data Challenge data
     * @returns Challenge object
     */
    async updateStatus(id: string, userId: string, status: ChallengeStatus) {
        try {
            const [result] = await db.update(challenges)
                .set({ status: status })
                .where(
                    and(
                        eq(challenges.id, id),
                        eq(challenges.userId, userId)
                    )
                )
                .returning();
            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to update challenge", { cause: error });
            } else {
                throw new Error("Failed to update challenge");
            }
        }
    }
}

export const challengeFactory = new ChallengeFactory();