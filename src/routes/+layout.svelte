<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import GaAnalytics from '@/lib/components/ga-analytics.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<GaAnalytics />
