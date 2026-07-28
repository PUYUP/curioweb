<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import Icon from 'mdi-svelte';
	import { mdiChevronRight } from '@mdi/js';

	const { items } = $props<{ items: any[] }>();
</script>

<div class="w-full flex flex-col gap-4">
	{#each items as item}
		<Item.Root variant="outline" size="default">
			{#snippet child({ props })}
				<a href="/workspaces/{item.id}" class="flex items-center" {...props}>
					<Item.Content>
						<Item.Title class="!mb-0">{item.title}</Item.Title>
						{#if item.description}
							<Item.Description>{item.description}</Item.Description>
						{/if}
					</Item.Content>

					<Item.Actions>
						<Icon path={mdiChevronRight} color={'#666'} class="size-4" />
					</Item.Actions>
				</a>
			{/snippet}
		</Item.Root>
	{/each}
</div>
