import { researchContexts } from "../schemas/workspace.schema";
import { db } from "../index.js";
import { eq, desc } from "drizzle-orm";

export const contextFactory = {

    /**
     * Save context
     * @param values context data
     * @returns context object
     */
    async saveContext(values: typeof researchContexts.$inferInsert) {
        try {
            const [result] = await db.insert(researchContexts)
                .values(values)
                .returning();
            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to save context", { cause: error });
            } else {
                throw new Error("Failed to save context");
            }
        }
    }

}
