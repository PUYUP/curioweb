<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Icon from 'mdi-svelte';
	import { mdiArrowRight } from '@mdi/js';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	let { context } = $derived(data);

	// chunks viewer
	let chunkDrawerOpen = $state(false);
	function viewChunkHandler() {
		chunkDrawerOpen = !chunkDrawerOpen;
	}

	// svelte-ignore state_referenced_locally
	console.log(context);
</script>

<div class="px-4 pb-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">{context?.workspace?.title}</div>
		<div class="flex w-full justify-between items-center">
			<h1 class="!mb-0 font-semibold">Research Context</h1>
			<Button
				class="ml-auto"
				href={`/workspaces/${context?.workspaceId}/contexts/editor?id=${context?.id}`}
				variant="outline"
			>
				Edit
			</Button>
		</div>
	</div>

	<div class="w-full xl:w-3/6 pb-4">
		<p>{context?.content}</p>

		<div class="flex gap-4 mt-6">
			{#if context?.chunks && context.chunks.length > 0}
				<Button variant="outline" size="sm" onclick={viewChunkHandler}>
					View {context.chunks.length} Chunks <Icon path={mdiArrowRight} size={0.65} />
				</Button>
			{/if}
		</div>
	</div>
</div>

<Drawer.Root bind:open={chunkDrawerOpen} direction="right">
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Context Chunkings</Drawer.Title>
		</Drawer.Header>
		<div class="p-2 overflow-y-auto">
			<ol class="list-decimal pl-6">
				{#each context?.chunks as chunk}
					<li class="mb-2">
						<p class="text-sm">{chunk?.content}</p>
					</li>
				{/each}
			</ol>
		</div>
		<Drawer.Footer>
			<Drawer.Close>Close</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
