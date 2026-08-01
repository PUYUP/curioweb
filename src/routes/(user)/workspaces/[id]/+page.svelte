<script lang="ts">
	import { Spinner } from '@/lib/components/ui/spinner';
	import { Button } from '@/lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';
	import Badge from '@/lib/components/ui/badge/badge.svelte';

	let loading: boolean = $state<boolean>(true);
	let loadingContexts: boolean = $state<boolean>(true);

	const { data }: { data: PageServerData } = $props();
	const workspace = $derived(data.workspace);
	const contexts = $derived(data.contexts);

	$effect(() => {
		if (workspace) {
			loading = false;
		}

		if (contexts) {
			loadingContexts = false;
		}
	});
</script>

<svelte:head>
	<title>{workspace?.title}</title>
	<meta name="description" content={workspace?.description} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if loading}
		<div class="flex items-center justify-center size-full">
			<Spinner />
		</div>
	{:else}
		<div class="mb-4 border-b border-neutral-200 pb-2">
			<div class="block text-xs text-neutral-500">Workspace</div>
			<div class="flex w-full justify-between items-center">
				<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
				<Button class="ml-auto" href={`/workspaces/editor?id=${workspace?.id}`} variant="outline">
					Edit
				</Button>
			</div>
		</div>

		<div class="w-full md:w-3/6 text-sm whitespace-break-spaces">
			{workspace?.description ? workspace.description : 'No description given.'}
		</div>

		<div class="mb-4 mt-8 flex items-center border-b border-neutral-200 pb-2">
			<span class="text-sm">Research Contexts</span>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#if contexts.length > 0}
				{#each contexts as context}
					<Card.Root>
						<Card.Content>
							<div class="text-sm">{context.content}</div>
						</Card.Content>
						<Card.Footer class="mt-auto grid grid-cols-2 gap-4 w-full border-t border-neutral-200">
							<div class="block">
								{#if context.status === 'draft'}
									<Badge variant="outline" class="uppercase">{context.status}</Badge>
								{:else if context.status === 'retrieved'}
									<Badge variant="default" class="uppercase">{context.status}</Badge>
								{/if}
							</div>
							<div class="block">
								{#if context?.status === 'draft'}
									<Button
										variant="outline"
										class="w-full bg-neutral-50"
										onclick={() =>
											goto(`/workspaces/${context?.workspaceId}/contexts/editor?id=${context?.id}`)}
									>
										Continue Editing
									</Button>
								{:else}
									<Button
										variant="outline"
										class="w-full bg-neutral-50"
										onclick={() =>
											goto(`/workspaces/${context?.workspaceId}/contexts/${context?.id}`)}
									>
										View Papers
									</Button>
								{/if}
							</div>
						</Card.Footer>
					</Card.Root>
				{/each}
			{/if}
			<Card.Root
				class="cursor-pointer bg-neutral-50 hover:bg-neutral-100"
				onclick={() => goto(`/workspaces/${workspace?.id}/contexts/editor`)}
			>
				<Card.Content class="flex flex-col items-center justify-center h-full">
					<Icon path={mdiPlus} size="1.5rem" />
					<p class="text-sm mb-2">Add New</p>
					<p class="text-xs text-neutral-500 text-center">
						Retrieve papers using sentence-level contextual search
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
