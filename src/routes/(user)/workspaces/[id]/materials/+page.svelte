<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';

	const { data } = $props();
	let { workspace, user } = $derived(data);
</script>

<svelte:head>
	<title>{workspace?.title} | Learning Materials</title>
	<meta name="description" content={`Learning materials of ${workspace?.title}`} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>
