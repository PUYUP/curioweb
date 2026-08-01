<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import Icon from 'mdi-svelte';
	import { mdiArrowRight, mdiFileDocument, mdiFilePdfBox } from '@mdi/js';
	import type { PageServerData } from './$types';
	import { SimilarItem } from '@/lib/components/blocks/similar-item';
	import { authClient } from '@/lib/auth-client';

	const { data }: { data: PageServerData } = $props();
	let { context } = $derived(data);

	let userId = $state<string | null>(null);
	let userEmail = $state<string | null>(null);

	// chunks viewer
	let chunkDrawerOpen = $state(false);
	function viewChunkHandler() {
		chunkDrawerOpen = !chunkDrawerOpen;
	}

	$effect(() => {
		(async () => {
			const { data: session } = await authClient.getSession();
			userId = session?.user?.id ?? null;
			userEmail = session?.user?.email ?? null;
		})();
	});
</script>

<svelte:head>
	<title>Research Context - {context?.workspace?.title}</title>
	<meta name="description" content="Research Context - {context?.workspace?.title}" />
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="px-4 pb-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">{context?.workspace?.title}</div>
		<div class="flex w-full justify-between items-center">
			<h1 class="!mb-0 font-semibold">Research Context</h1>
			{#if context?.status !== 'retrieved'}
				<Button
					class="ml-auto"
					href={`/workspaces/${context?.workspaceId}/contexts/editor?id=${context?.id}`}
					variant="outline"
				>
					Edit
				</Button>
			{/if}
		</div>
	</div>

	<div class="w-full xl:w-4/6 2xl:w-4/6 pb-4">
		<div class="whitespace-break-spaces">{context?.content}</div>

		{#if context?.status === 'retrieved'}
			<div class="mt-6">
				{#if context?.chunks && context.chunks.length > 0}
					<Button variant="outline" size="sm" onclick={viewChunkHandler}>
						View {context.chunks.length} Chunks <Icon path={mdiArrowRight} size={0.65} />
					</Button>

					{#if context?.hasSimilarity}
						<div class="block mt-6">
							<div class="mt-2 mb-4">Found Related Papers</div>

							{#each context.matchResults as chunk, idx}
								<Separator class="my-4" />
								<div class="mt-2">
									<div class="block mb-4">
										<p class="text-base text-green-600 font-bold mb-1 uppercase">
											Chunk #{idx + 1}
										</p>
										<p class="text-base">{chunk?.content}</p>
									</div>
									{#if (chunk as any)?.similarities && (chunk as any).similarities.length > 0}
										<ol class="list-decimal pl-8">
											{#each (chunk as any).similarities as similarity}
												<SimilarItem item={similarity} user={{ id: userId, email: userEmail }} />
											{/each}
										</ol>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex items-center gap-2 mt-6">
							<Spinner />
							<p class="text-xs text-neutral-500">
								Papers retrieval on progress... refresh this page simultanously
							</p>
						</div>
					{/if}
				{:else}
					<div class="flex items-center gap-2">
						<Spinner />
						<p class="text-xs text-neutral-500">
							Chunkings on progress... refresh this page simultanously
						</p>
					</div>
				{/if}
			</div>
		{/if}
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
