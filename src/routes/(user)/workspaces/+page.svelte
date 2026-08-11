<script lang="ts">
	import { WorkspaceList } from '@/lib/components/blocks/workspace-list';
	import { Button } from '@/lib/components/ui/button';
	import { mdiPlus } from '@mdi/js';
	import Icon from 'mdi-svelte';

	const { data } = $props();
	const { workspaces: workspaceList, user } = $derived(data);
	let subscription = $state<any>(null);

	$effect(() => {
		if (user) {
			subscription = (user as any)?.subscription;
		}
	});
</script>

<svelte:head>
	<title>ATLANIZE - Research Context</title>
	<meta
		name="description"
		content="Discover the latest research and challenge your curiosity with ATLANIZE."
	/>
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	<div class="mb-4 flex items-center border-b border-neutral-200 pb-4">
		<span>Workspaces</span>
		<div class="ml-auto">
			{#if workspaceList.length >= (subscription?.attributes?.maxWorkspaces ?? 0)}
				<p class="text-xs text-red-500">
					Limit {subscription?.attributes?.maxWorkspaces} reached, upgrade to add more
				</p>
			{:else}
				<Button
					href="/workspaces/editor"
					disabled={workspaceList.length >= (subscription?.attributes?.maxWorkspaces ?? 0)}
				>
					<Icon path={mdiPlus} size="1rem" />
					New
				</Button>
			{/if}
		</div>
	</div>

	<div class="w-full md:w-3/6 text-sm">
		Collections of workspaces where papers are
		<strong>retrieved using sentence-level contexts</strong>, enabling more precise discovery than
		abstract and citation based search.
	</div>

	<div class="mt-6">
		<WorkspaceList items={workspaceList} />
	</div>
</div>
