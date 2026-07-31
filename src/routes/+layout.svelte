<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import atlanizeLogoText from '$lib/assets/atlanize_logo_text.png';
	import GaAnalytics from '@/lib/components/ga-analytics.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:image" content={atlanizeLogoText} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

{@render children()}

<GaAnalytics />
