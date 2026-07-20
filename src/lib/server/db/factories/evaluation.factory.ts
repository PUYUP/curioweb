import { db } from "../index.js";
import { evaluations } from "../schemas/evaluation.schema.js";
import { getTableColumns, eq, and, desc } from "drizzle-orm";

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

}

export const evaluationFactory = new EvaluationFactory();