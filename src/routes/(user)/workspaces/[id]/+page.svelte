<script lang="ts">
	import { Spinner } from '@/lib/components/ui/spinner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { PageData } from './$types';
	import { Button } from '@/lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';
	import { goto } from '$app/navigation';

	let loading: boolean = $state<boolean>(true);

	const { data } = $props() as { data: PageData };
	const workspace = $derived(data.workspace);

	const samples: any[] = [
		{
			content:
				'Fokus pada perkembangan Large Language Models (LLM), AI Agents, Multimodal AI, Robotics, dan Generative AI.'
		},
		{
			content:
				'Buat perbandingan tools AI terbaik untuk produktivitas. Kelompokkan berdasarkan kategori seperti AI Chatbot, AI Coding Assistant, AI Image Generator, AI Video Generator, AI Meeting Assistant, dan AI Automation. Bandingkan fitur, harga, kelebihan, kekurangan, dan use case masing-masing.'
		}
	];

	$effect(() => {
		if (workspace) {
			loading = false;
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

		<div class="w-full md:w-3/6 text-sm">
			{workspace?.description}
		</div>

		<div class="mb-4 mt-8 flex items-center border-b border-neutral-200 pb-2">
			<span class="text-sm">Research Contexts</span>
		</div>

		{#if samples.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each samples as sample}
					<Card.Root>
						<Card.Content>
							<p class="text-sm">{sample.content}</p>
						</Card.Content>
						<Card.Footer class="mt-auto grid grid-cols-2 gap-4 w-full border-t border-neutral-200">
							<div class="block">
								<Button variant="link" class="w-full">Edit</Button>
							</div>
							<div class="block">
								<Button variant="outline" class="w-full">View</Button>
							</div>
						</Card.Footer>
					</Card.Root>
				{/each}

				<Card.Root
					class="cursor-pointer hover:bg-neutral-100"
					onclick={() => goto(`/workspaces/${workspace?.id}/contexts/editor`)}
				>
					<Card.Content class="flex flex-col items-center justify-center h-full">
						<Icon path={mdiPlus} size="1.5rem" />
						<p class="text-sm">Add New</p>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	{/if}
</div>
