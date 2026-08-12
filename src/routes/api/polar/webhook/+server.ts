import { Webhooks } from "@polar-sh/sveltekit";
import { env } from '$env/dynamic/private';
import { subscriptionFactory } from '@/lib/server/db/factories/subscription.factory';
import { updateProfile } from "@/lib/server/db/factories/profle.factory";
import { addHours } from "date-fns";

export const POST = Webhooks({
    webhookSecret: env.POLAR_WEBHOOK_SECRET,
    onPayload: async (payload) => {
        const actionType = payload.type;

        if (actionType === 'subscription.active' || actionType === 'subscription.uncanceled' || actionType === 'subscription.canceled') {
            const status = payload.data.status;
            const productId = payload.data.product.id;
            const productName = payload.data.product.name;
            const startDate = payload.data.currentPeriodStart;
            const endDate = payload.data.currentPeriodEnd;
            const canceledAt = payload.data.canceledAt;
            const email = payload.data.metadata?.email as string;
            const userId = payload.data.metadata?.user_id as string;

            const subsData = {
                status: status,
                productId: productId,
                productName: productName,
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                canceledAt: canceledAt,
                attributes: {
                    maxWorkspaces: 20,
                    maxOfContextsPerWorkspace: 25,
                    challengeInterval: 48,
                }
            }

            if (actionType === 'subscription.active' || actionType === 'subscription.uncanceled') {
                if (email && userId) {
                    await subscriptionFactory.insert(subsData);
                    // update profile next_processed_at
                    await updateProfile(userId, {
                        nextProcessedAt: addHours(new Date(), 48),
                    });
                }
            }

            if (actionType === 'subscription.canceled') {
                if (email && userId) {
                    const lastSub = await subscriptionFactory.getLatestByUserId(userId);
                    if (lastSub?.id) {
                        await subscriptionFactory.update(
                            lastSub.id,
                            {
                                status: 'canceled',
                                canceledAt: canceledAt,
                                attributes: {
                                    maxWorkspaces: 1,
                                    maxOfContextsPerWorkspace: 5,
                                    challengeInterval: 168,
                                }
                            }
                        );

                        // update profile next_processed_at
                        await updateProfile(userId, {
                            nextProcessedAt: addHours(new Date(), 168),
                        });
                    }
                }
            }
        }
    },
});