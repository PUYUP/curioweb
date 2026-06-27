<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import Icon from 'mdi-svelte';
	import {
		mdiProgressCheck,
		mdiChevronRight,
		mdiRead,
		mdiCircleSlice3,
		mdiCheckCircleOutline,
		mdiCancel
	} from '@mdi/js';
	import type { ChallengeData } from '@/lib/types/models';

	let { challenge }: { challenge: ChallengeData } = $props();
</script>

<Item.Root variant="outline" size="default">
	{#snippet child({ props })}
		<a href="/challenge/{challenge.code}" class="flex items-center" {...props}>
			<Item.Media>
				{#if challenge.status === 'read'}
					<Icon path={mdiRead} color={'#6B7280'} class="size-5" />
				{:else if challenge.status === 'active'}
					<Icon path={mdiProgressCheck} color={'#3B82F6'} class="size-5" />
				{:else if challenge.status === 'completed'}
					<Icon path={mdiCheckCircleOutline} color={'#22C55E'} class="size-5" />
				{:else if challenge.status === 'rejected'}
					<Icon path={mdiCancel} color={'#EF4444'} class="size-5" />
				{:else}
					<Icon path={mdiCircleSlice3} color={'#F59E0B'} class="size-5" />
				{/if}
			</Item.Media>
			<Item.Content>
				<Item.Title class="pt-1">{challenge.code}</Item.Title>
				<div class="block">
					<ol class="list-decimal pl-4">
						<li class="text-xs text-neutral-500">A simple item with title and description.</li>
						<li class="text-xs text-neutral-500">A simple item with title and description.</li>
					</ol>
				</div>
			</Item.Content>
			<Item.Actions>
				<Icon path={mdiChevronRight} color={'#666'} class="size-4" />
			</Item.Actions>
		</a>
	{/snippet}
</Item.Root>
