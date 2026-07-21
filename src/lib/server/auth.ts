import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { upsertProfile } from './db/factories/profle.factory';
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
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
							productId: "e413af43-3135-45c3-b9aa-f7302ca1fc1e",
							slug: "ATLA-Bronze"
						}
					],
					successUrl: env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true
				}),
				portal(),
				usage(),
			],
		})
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
	}
});
