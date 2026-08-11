<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Icon from 'mdi-svelte';
	import { mdiChevronRight } from '@mdi/js';

	const { items } = $props<{ items: any[] }>();
</script>

<div class="w-full flex flex-col gap-4">
	{#if items.length > 0}
		{#each items as item}
			<Item.Root variant="outline" size="default">
				{#snippet child({ props })}
					<a href="/workspaces/{item.id}" class="flex items-center" {...props}>
						<Item.Content>
							<Item.Title class="!mb-0 text-sm">{item.title}</Item.Title>
							{#if item.scope === 'group'}
								<div class="flex items-center gap-2">
									<Badge variant="secondary">Group</Badge>
									<span class="text-neutral-300">&bull;</span>
									<span>{item.memberCount} members</span>
									<span class="text-neutral-300">&bull;</span>
									<span>
										{item.noteCount} notes
										<span class="text-green-600 italic">({item.countTodayNotes} today)</span>
									</span>
								</div>
							{/if}
							<Item.Description class="line-clamp-2">
								{item.description ? item.description : 'No description given.'}
							</Item.Description>
						</Item.Content>

						<Item.Actions>
							<Icon path={mdiChevronRight} color={'#666'} class="size-4" />
						</Item.Actions>
					</a>
				{/snippet}
			</Item.Root>
		{/each}
	{:else}
		<Item.Root variant="outline" size="default">
			<Item.Content>
				<Item.Title>No workspaces found, why don't you create a new one?</Item.Title>
			</Item.Content>
		</Item.Root>
	{/if}
</div>
