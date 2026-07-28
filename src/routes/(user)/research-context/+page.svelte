<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import { mdiPlus } from '@mdi/js';
	import Icon from 'mdi-svelte';
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
		<span>Research Contexts</span>
		<Button class="ml-auto">
			<Icon path={mdiPlus} size="1rem" />
			New
		</Button>
	</div>

	<div class="w-full md:w-3/6 text-sm">
		Collections of Research Contexts you are currently working on. Use it to view, organize, and
		continue your ongoing research.
	</div>
</div>
