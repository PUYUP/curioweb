<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { format } from 'date-fns';
	import Icon from 'mdi-svelte';
	import {
		mdiProgressCheck,
		mdiChevronRight,
		mdiFolderAccount,
		mdiRead,
		mdiCircleSlice3,
		mdiCheckCircleOutline,
		mdiCancel
	} from '@mdi/js';

	const { material } = $props();
</script>

<Item.Root variant="outline" size="default">
	{#snippet child({ props })}
		<a
			href="/workspaces/{material.workspaceId}/materials/{material.id}"
			class="flex items-center"
			{...props}
		>
			<Item.Content>
				<Item.Title class="text-base">
					{format(new Date(material.generatedDate), 'dd MMM yyyy')}
				</Item.Title>

				<div class="flex items-center gap-2">
					<Icon path={mdiFolderAccount} color={'#666'} size={0.75} />
					{material.workspace.title}
				</div>
			</Item.Content>
			<Item.Actions>
				<Icon path={mdiChevronRight} color={'#666'} class="size-4" />
			</Item.Actions>
		</a>
	{/snippet}
</Item.Root>
