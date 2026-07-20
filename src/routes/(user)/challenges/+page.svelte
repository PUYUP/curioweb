<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import type { PageServerData } from './$types';
	import { ChallengeItem } from '@/lib/components/blocks/challenge-item';

	let { data }: { data: PageServerData } = $props();

	const challenges = $derived(data ? data?.challenges : []);
</script>

<div class="py-2 pb-4 md:py-4 px-4">
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
						<Item.Title class="line-clamp-1">Loading challenges...</Item.Title>
					</Item.Content>
				</Item.Root>
			</div>
		{/each}
	</div>
</div>
