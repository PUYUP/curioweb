<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import type { LayoutServerData } from '../$types';
	import { EditorNote } from '@/lib/components/blocks/editor-note';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';

	const { data } = $props();
	const { workspace, notes } = $derived(data);

	// svelte-ignore state_referenced_locally
	console.log(notes);
</script>

<svelte:head>
	<title>{workspace?.title} - Notes</title>
	<meta name="description" content={workspace?.description} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">Notes collection</div>
		<div class="flex w-full justify-between items-center gap-2">
			<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
			<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
				{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
			</Badge>
			<Button
				class="ml-auto flex items-center gap-1"
				href={`/workspaces/${workspace?.id}/notes/editor`}
			>
				<Icon path={mdiPlus} size={0.75} />
				Add Note
			</Button>
		</div>
	</div>

	{#if workspace}
		{#each notes as item}
			<div>{item.content}</div>
		{/each}
	{/if}
</div>
