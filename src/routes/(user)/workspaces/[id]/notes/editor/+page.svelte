<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import type { LayoutServerData } from '../../$types';
	import { EditorNote } from '@/lib/components/blocks/editor-note';

	const { data } = $props();
	const { workspace, note } = $derived(data);
</script>

<svelte:head>
	<title>{workspace?.title} - Notes Editor</title>
	<meta name="description" content={workspace?.description} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">Note editor</div>
		<div class="flex w-full justify-between items-center gap-2">
			<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
			<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
				{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
			</Badge>
		</div>
	</div>

	{#if workspace}
		<div class="block w-full xl:w-4/6">
			<EditorNote {workspace} {note} />
		</div>
	{/if}
</div>
