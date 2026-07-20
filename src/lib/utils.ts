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