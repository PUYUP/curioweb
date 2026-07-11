<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Item from '$lib/components/ui/item/index.js';

	import { Button } from '@/lib/components/ui/button';
	import languages from '@/lib/assets/data/ISO-639-1-language.json';
	import ChallengeItem from '@/lib/components/blocks/challenge-item/challenge-item.svelte';
	import type { LayoutServerData } from '../$types';
	import { Badge } from '@/lib/components/ui/badge';
	import EvaluationCrt001 from '@/lib/components/blocks/evaluation-crt001/evaluation-crt001.svelte';
	import EvaluationCrt002 from '@/lib/components/blocks/evaluation-crt002/evaluation-crt002.svelte';

	const { data }: { data: LayoutServerData } = $props();

	const profile = $derived(data ? data.profile : null);
	const language = $derived(languages.find((l) => l.code === profile?.languageCode)?.name);
	const challenges = $derived(data ? data?.challenges : []);

	// svelte-ignore state_referenced_locally
	console.log(challenges);
</script>

<svelte:head>
	<title>{data.user.name} - Dashboard</title>
</svelte:head>

<div class="py-2 pb-4 md:py-4">
	<div class="px-4 grid grid-cols-1 xl:grid-cols-2 gap-6">
		<div class="block order-2 xl:order-1">
			<div class="block">
				<div class="flex w-full mb-4 justify-between">
					<div class="flex flex-col gap-1">
						<span class="font-semibold">Your Interests</span>
						<span class="text-xs text-neutral-500">Prefered language: {language}</span>
					</div>

					<Button variant="outline" href="/dashboard/onboarding" size="sm">Change</Button>
				</div>

				<p class="interest-content text-lg">{profile?.interest || 'No interests added'}</p>
			</div>
		</div>

		<div class="block order-1 xl:order-2">
			<div class="flex justify-between items-center mb-4">
				<span class="text-sm font-semibold">Newest Challenges</span>
				<Badge>2 new</Badge>
			</div>
			<div class="flex flex-col gap-4">
				{#each challenges as challenge}
					<ChallengeItem {challenge} />
				{:else}
					<div class="flex w-full flex-col gap-4 [--radius:1rem]">
						<Item.Root variant="muted">
							<Item.Media>
								<Spinner />
							</Item.Media>
							<Item.Content>
								<Item.Title class="line-clamp-1">Generating challenges...</Item.Title>
							</Item.Content>
							<Item.Content class="flex-none justify-end">
								<span class="text-sm tabular-nums">10 queue</span>
							</Item.Content>
						</Item.Root>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="p-4">
		<EvaluationCrt002 />
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-4 mt-2">
		<div class="block">
			<EvaluationCrt001 />
		</div>

		<div class="block">
			<EvaluationCrt001 />
		</div>

		<div class="block">
			<EvaluationCrt001 />
		</div>

		<div class="block">
			<EvaluationCrt001 />
		</div>
	</div>
</div>

<style>
	.interest-content {
		font-family: Newsreader, sans-serif;
	}
</style>
