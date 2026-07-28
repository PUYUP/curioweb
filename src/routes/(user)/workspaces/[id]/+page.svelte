<script lang="ts">
	import { Spinner } from '@/lib/components/ui/spinner';
	import type { PageData } from './$types';
	import { Button } from '@/lib/components/ui/button';

	let loading: boolean = $state<boolean>(true);

	const { data } = $props() as { data: PageData };
	const workspace = $derived(data.workspace);

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
		<div class="mb-4 flex items-center border-b border-neutral-200 pb-2">
			<span>{workspace?.title}</span>
			<Button class="ml-auto" href={`/workspaces/editor?id=${workspace?.id}`} variant="outline">
				Edit
			</Button>
		</div>

		<div class="w-full md:w-3/6 text-sm">
			{workspace?.description}
		</div>
	{/if}
</div>
