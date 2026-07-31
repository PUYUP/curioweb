// src/routes/api/polar/webhook/+server.ts
import { Webhooks } from "@polar-sh/sveltekit";
import { env } from '$env/dynamic/private';

export const POST = Webhooks({
    webhookSecret: env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (payload) => {
        const actionType = payload.type;
        console.log("webhook received:", payload);

        if (actionType === 'subscription.active' || actionType === 'subscription.uncanceled') {
            const email = payload.data.metadata?.email;
            const userId = payload.data.metadata?.user_id;

            if (email && userId) {
                // update email with polar email
            }
        }

        if (actionType === 'subscription.canceled') {
            const email = payload.data.metadata?.email;
            const userId = payload.data.metadata?.user_id;

            if (email && userId) {
                // update email with polar email
            }
        }
    },
});