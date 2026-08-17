<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { format } from 'date-fns';
	import Icon from 'mdi-svelte';
	import { mdiEye, mdiFilePdfBox } from '@mdi/js';

	const { data } = $props();
	let { workspace, materials } = $derived(data);
</script>

<svelte:head>
	<title>{workspace?.title} | Learning Materials</title>
	<meta name="description" content={`Learning materials of ${workspace?.title}`} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if workspace}
		<div class="mb-4 border-b border-neutral-200 pb-2">
			<div class="block text-xs text-neutral-500 mb-1">Learning materials</div>
			<div class="flex w-full justify-between items-center gap-2">
				<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
				<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
					{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
				</Badge>
			</div>
		</div>

		<div class="flex w-full gap-4 flex-col">
			{#each materials as item}
				<Item.Root variant="outline">
					<Item.Content class="gap-0">
						<Item.Title>
							{format(item.generatedDate, 'dd MMM yyyy')}
						</Item.Title>
					</Item.Content>

					{#if item.attachments.length > 0}
						<Item.Actions>
							<Button
								variant="link"
								class="text-blue-600"
								href={item.attachments[0].file.mediaLink}
								target="_blank"
							>
								<Icon path={mdiFilePdfBox} size={0.75} />
								Download PDF
							</Button>

							<Button href={`/workspaces/${workspace?.id}/materials/${item.id}`}>
								<Icon path={mdiEye} size={0.65} />
								View
							</Button>
						</Item.Actions>
					{/if}
				</Item.Root>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center items-center p-6">
			<Spinner />
		</div>
	{/if}
</div>
