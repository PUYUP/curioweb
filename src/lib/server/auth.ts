import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { upsertProfile } from './db/factories/profle.factory';
import * as schema from '$lib/server/db/schemas/schema';
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { customSession } from "better-auth/plugins";
import { subscriptionFactory } from './db/factories/subscription.factory';
import { subscriptionPlans } from '../utils';

export const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: env.POLAR_SERVER === "production" ? "production" : "sandbox",
});

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(
		db,
		{
			provider: 'pg',
			schema: schema,
			usePlural: false,
		}
	),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: env.POLAR_PRODUCT_ID,
							slug: "ATLA-Bronze"
						}
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true
				}),
				portal(),
				usage(),
			],
		}),
		customSession(async ({ user, session }) => {
			const currentSubscription = await subscriptionFactory.getLatestByUserId(user.id);
			const subscriptionActive = currentSubscription?.status === "active";
			const subscriptionRestriction = subscriptionPlans.find(
				plan => plan.slug === (subscriptionActive ? 'bronze' : 'free')
			)?.restrictions;

			return {
				user: {
					...user,
					subscription: {
						...currentSubscription,
						restrictions: subscriptionRestriction,
					}
				},
				session,
			};
		}),
	],
	logger: { level: 'debug' },
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string,
		}
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await upsertProfile(user.id, { interest: '', languageCode: 'en' });
				}
			},
		}
	},
	advanced: {
		useCookieForState: true,
		database: {
			generateId: false // Tells Better Auth to let Postgres/ORM handle the ID
		}
	},
	user: {
		deleteUser: {
			enabled: true,
			afterDelete: async (user, request) => {
				await polarClient.customers.deleteExternal({
					externalId: user.id,
				});
			},
		},
	},
});
