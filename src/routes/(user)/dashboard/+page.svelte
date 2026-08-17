<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Item from '$lib/components/ui/item/index.js';

	import ChallengeItem from '@/lib/components/blocks/challenge-item/challenge-item.svelte';
	import type { LayoutServerData } from '../$types';
	import EvaluationCrt001 from '@/lib/components/blocks/evaluation-crt001/evaluation-crt001.svelte';
	import EvaluationCrt005 from '@/lib/components/blocks/evaluation-crt005/evaluation-crt005.svelte';
	import MaterialItem from '@/lib/components/blocks/material-item/material-item.svelte';

	const { data }: { data: LayoutServerData } = $props();

	const challenges = $derived(data ? data?.challenges : []);
	const materials = $derived(data ? data?.materials : []);
</script>

<svelte:head>
	<title>{data.user.name} - Dashboard</title>
</svelte:head>

<div class="py-2 pb-4 md:py-4">
	<div class="px-4 grid grid-cols-1 xl:grid-cols-2 gap-6">
		<div class="block">
			<div class="flex justify-between items-center mb-4">
				<span class="text-sm font-semibold">Learning Materials</span>
			</div>

			<div class="flex flex-col gap-4">
				{#each materials as material}
					<MaterialItem {material} />
				{:else}
					<div class="flex w-full flex-col gap-4 [--radius:1rem]">
						Your learning materials are currently unavailable. Add study notes to a workspace, and
						learning materials will be generated automatically.
					</div>
				{/each}
			</div>
		</div>

		<div class="block">
			<div class="flex justify-between items-center mb-4">
				<span class="text-sm font-semibold">Newest Challenges</span>
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
								<Item.Title class="line-clamp-1">Generating your first challenges...</Item.Title>
								<span class="text-sm tabular-nums text-xs italic text-neutral-500 leading-2">
									(may need up to 10 minutes, refresh periodically)
								</span>
							</Item.Content>
						</Item.Root>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 px-4 mt-6">
		<div class="block">
			<EvaluationCrt001 />
		</div>

		<div class="block">
			<EvaluationCrt005 />
		</div>
	</div>
</div>

<style>
	.interest-content {
		font-family: Newsreader, sans-serif;
	}
</style>
