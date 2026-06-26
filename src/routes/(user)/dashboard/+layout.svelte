<script lang="ts">
	import '../../../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/blocks/sidebar/sidebar.svelte';
	import type { LayoutServerData } from './$types';

	let { children, data }: { children: any; data: LayoutServerData } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<main class="main flex-1">
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
