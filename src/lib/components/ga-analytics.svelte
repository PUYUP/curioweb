<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { dev, browser } from '$app/environment';

	const gaId = env.PUBLIC_GA_MEASUREMENT_ID;

	$effect(() => {
		const path = page.url.pathname + page.url.search;

		if (browser && !dev && gaId && typeof window.gtag === 'function') {
			window.gtag('event', 'page_view', {
				page_path: path,
				send_to: gaId
			});
		}

		console.log('test', gaId, dev, browser);
	});
</script>

<svelte:head>
	{#if !dev && gaId}
		<script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			window.gtag = function () {
				window.dataLayer.push(arguments);
			};
			window.gtag('js', new Date());
			window.gtag('config', '{gaId}', { send_page_view: false });
		</script>
	{/if}
</svelte:head>
