<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import type { PageServerData } from './$types';
	import { ChallengeItem } from '@/lib/components/blocks/challenge-item';
	import Button from '@/lib/components/ui/button/button.svelte';
	import languages from '@/lib/assets/data/ISO-639-1-language.json';

	let { data }: { data: PageServerData } = $props();

	const challenges = $derived(data ? data?.challenges : []);
	const profile = $derived(data ? data.profile : null);
	const language = $derived(languages.find((l) => l.code === profile?.languageCode)?.name);
</script>

<div class="py-2 pb-4 md:py-4 px-4">
	<div class="font-semibold mb-4">Your Interests</div>

	<div class="block border border-neutral-200 rounded-lg p-4 mb-10">
		<div class="block">
			<div class="flex w-full mb-4 justify-between items-center">
				<div class="flex flex-col gap-1">
					<span class="text-xs text-neutral-500">Prefered language: {language}</span>
				</div>

				<Button href="/dashboard/onboarding" size="sm">Change</Button>
			</div>

			<div class="text-base whitespace-break-spaces">
				{profile?.interest || 'No interests added'}
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#if challenges.length > 0}
			<div class="font-semibold">Your Challenges</div>
			{#each challenges as challenge}
				<ChallengeItem {challenge} />
			{/each}
		{:else}
			<div class="flex w-full flex-col gap-4 [--radius:1rem]">
				<Item.Root variant="muted">
					<Item.Media>
						<Spinner />
					</Item.Media>
					<Item.Content>
						<Item.Title class="line-clamp-1">Loading challenges...</Item.Title>
					</Item.Content>
				</Item.Root>
			</div>
		{/if}
	</div>
</div>
