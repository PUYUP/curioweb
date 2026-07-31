import { subscriptions } from "../schemas/subscription.schema";
import { db } from "../index.js";
import { eq, desc } from "drizzle-orm";

class SubscriptionFactory {

    public async insert(sub: typeof subscriptions.$inferInsert) {
        try {
            const [result] = await db.insert(subscriptions)
                .values(sub)
                .returning();
            return result;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                throw new Error("Failed to insert subscription", { cause: error });
            } else {
                throw new Error("Failed to insert subscription");
            }
        }
    }

    public async update(subId: string, sub: Partial<typeof subscriptions.$inferInsert>) {
        try {
            const [result] = await db.update(subscriptions)
                .set(sub)
                .where(eq(subscriptions.id, subId))
                .returning();
            return result;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                throw new Error("Failed to update subscription", { cause: error });
            } else {
                throw new Error("Failed to update subscription");
            }
        }
    }

    public async getLatestByUserId(userId: string): Promise<typeof subscriptions.$inferSelect> {
        try {
            const [result] = await db.select()
                .from(subscriptions)
                .where(eq(subscriptions.userId, userId))
                .orderBy(desc(subscriptions.createdAt))
                .limit(1);
            return result;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                throw new Error("Failed to get subscription", { cause: error });
            } else {
                throw new Error("Failed to get subscription");
            }
        }
    }

}

export const subscriptionFactory = new SubscriptionFactory();