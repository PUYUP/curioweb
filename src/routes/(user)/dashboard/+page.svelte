<script lang="ts">
	import type { LayoutServerData } from './$types';
	let { data }: { data: LayoutServerData } = $props();
</script>

<svelte:head>
	<title>{data.user.name} - Dashboard</title>
</svelte:head>

<div class="flex flex-col"></div>
