import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function getHighestAndLowestScore(data: any[]) {
	if (data.length === 0) {
		return { highest: null, lowest: null };
	}

	const highest = data.reduce((max, item) =>
		item.similarityScore > max.similarityScore ? item : max
	);

	const lowest = data.reduce((min, item) =>
		item.similarityScore < min.similarityScore ? item : min
	);

	return { highest: highest, lowest: lowest };
}

export const MIN_CONTENT_WORDS = 35;
export const MAX_CONTENT_WORDS = 125;

export const countWords = (text: string): number => {
	return text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
}

export const subscriptionPlans = [
	{
		name: 'ATLA Free',
		slug: 'free',
		priceLabel: '$0',
		priceAmount: 0,
		isActive: true,
		benefits: [
			'1 challenge every one week (full analysis)',
			'1 workspaces with max. 5 research contexts each',
			'Top 3 matching papers in research contexts hidden',
		],
		restrictions: {
			maxWorkspaces: 1,
			maxOfContextsPerWorkspace: 5,
			challengeLoopDuration: 168, // in hours every 7 days
		},
		link: '/auth/register',
		ctaLabel: 'Get started for free'
	},
	{
		name: 'ATLA Bronze',
		slug: 'bronze',
		priceLabel: '$4.99/month',
		priceAmount: 4.99,
		isActive: false,
		benefits: [
			'1 challenge every 2 days (full analysis)',
			'20 workspaces with max. 25 research contexts each',
			'All matching papers in research contexts visible',
		],
		restrictions: {
			maxWorkspaces: 20,
			maxOfContextsPerWorkspace: 25,
			challengeLoopDuration: 48, // in hours every 2 days
		},
		link: '/auth/register',
		ctaLabel: 'Subscribe now'
	}
];