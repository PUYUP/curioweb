import { db } from "../index.js";
import { evaluations } from "../schemas/evaluation.schema.js";
import { getTableColumns, eq, and, desc, sql } from "drizzle-orm";

type SoloSummary = {
    prestructural: number;
    unistructural: number;
    multistructural: number;
    relational: number;
    extended_abstract: number;
};

type MonthlySummary = {
    month: string;
    summary: SoloSummary;
};

class EvaluationFactory {

    /**
     * Get all evaluations by challenge paper id
     * @param challengePaperId challenge paper id
     * @returns Evaluations array
     */
    async getEvaluation(challengePaperId: string, userId: string) {
        try {
            const [result] = await db.select({
                ...getTableColumns(evaluations),
            })
                .from(evaluations)
                .where(and(
                    eq(evaluations.challengePaperId, challengePaperId),
                    eq(evaluations.userId, userId)
                ))
                .orderBy(desc(evaluations.createdAt))
                .limit(1);

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get evaluations", { cause: error });
            } else {
                throw new Error("Failed to get evaluations");
            }
        }
    }

    async getMonthlySoloSummary(userId: string): Promise<MonthlySummary[]> {
        try {
            const result = await db.execute(sql`
                SELECT json_agg(
                    jsonb_build_object('month', month, 'summary', summary)
                    ORDER BY month_date
                ) AS data
                FROM (
                    SELECT
                        date_trunc('month', ev."created_at") AS month_date,
                        to_char(date_trunc('month', ev."created_at"), 'MM-YYYY') AS month,
                        jsonb_build_object(
                            'prestructural',      COALESCE(ROUND(AVG((elem->'result'->'solo'->>'prestructural')::numeric), 2), 0),
                            'unistructural',      COALESCE(ROUND(AVG((elem->'result'->'solo'->>'unistructural')::numeric), 2), 0),
                            'multistructural',    COALESCE(ROUND(AVG((elem->'result'->'solo'->>'multistructural')::numeric), 2), 0),
                            'relational',         COALESCE(ROUND(AVG((elem->'result'->'solo'->>'relational')::numeric), 2), 0),
                            'extended_abstract',  COALESCE(ROUND(AVG((elem->'result'->'solo'->>'extended_abstract')::numeric), 2), 0)
                        ) AS summary
                    FROM ${evaluations} ev,
                        jsonb_array_elements(ev.results) AS elem
                    WHERE ev."user_id" = ${userId}
                    GROUP BY date_trunc('month', ev."created_at")
                ) sub
            `);

            return result?.[0]?.[0] as MonthlySummary[] ?? [];
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get monthly solo summary", { cause: error });
            } else {
                throw new Error("Failed to get monthly solo summary");
            }
        }
    }

    async getMonthlyHotsSummary(userId: string): Promise<MonthlySummary[]> {
        try {
            const result = await db.execute(sql`
                SELECT json_agg(
                    jsonb_build_object('month', month, 'summary', summary)
                    ORDER BY month_date
                ) AS data
                FROM (
                    SELECT
                        date_trunc('month', ev."created_at") AS month_date,
                        to_char(date_trunc('month', ev."created_at"), 'MM-YYYY') AS month,
                        jsonb_build_object(
                            'content_mastery',      COALESCE(ROUND(AVG((elem->'result'->'hots'->>'content_mastery')::numeric), 2), 0),
                            'logical_flow',         COALESCE(ROUND(AVG((elem->'result'->'hots'->>'logical_flow')::numeric), 2), 0),
                            'critical_thinking',    COALESCE(ROUND(AVG((elem->'result'->'hots'->>'critical_thinking')::numeric), 2), 0),
                            'academic_language',    COALESCE(ROUND(AVG((elem->'result'->'hots'->>'academic_language')::numeric), 2), 0),
                            'cognitive_synthesis',  COALESCE(ROUND(AVG((elem->'result'->'hots'->>'cognitive_synthesis')::numeric), 2), 0),
                            'memory_retention',     COALESCE(ROUND(AVG((elem->'result'->'hots'->>'memory_retention')::numeric), 2), 0),
                            'cognitive_stretch',    COALESCE(ROUND(AVG((elem->'result'->'hots'->>'cognitive_stretch')::numeric), 2), 0)
                        ) AS summary
                    FROM ${evaluations} ev,
                        jsonb_array_elements(ev.results) AS elem
                    WHERE ev."user_id" = ${userId}
                    GROUP BY date_trunc('month', ev."created_at")
                ) sub
            `);

            return result?.[0]?.[0] as MonthlySummary[] ?? [];
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get monthly hots summary", { cause: error });
            } else {
                throw new Error("Failed to get monthly hots summary");
            }
        }
    }

}

export const evaluationFactory = new EvaluationFactory();