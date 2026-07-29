<script lang="ts">
	import { WorkspaceList } from '@/lib/components/blocks/workspace-list';
	import { Button } from '@/lib/components/ui/button';
	import { mdiPlus } from '@mdi/js';
	import Icon from 'mdi-svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	const workspaceList = $derived(data.workspaces);
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
	<div class="mb-4 flex items-center">
		<span>Workspaces</span>
		<Button class="ml-auto" href="/workspaces/editor">
			<Icon path={mdiPlus} size="1rem" />
			New
		</Button>
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
