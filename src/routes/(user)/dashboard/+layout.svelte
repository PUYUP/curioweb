<script lang="ts">
	import '../../../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '@/lib/components/blocks/dashboard-sidebar/dashboard-sidebar.svelte';
	import type { LayoutServerData } from './$types';
	import DashboardNavbar from '@/lib/components/blocks/dashboard-navbar/dashboard-navbar.svelte';

	let { children, data }: { children: any; data: LayoutServerData } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<main class="main flex-1">
		<DashboardNavbar />
		{@render children?.()}
	</main>
</Sidebar.Provider>
