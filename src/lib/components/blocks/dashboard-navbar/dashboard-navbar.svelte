<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import logo from '$lib/assets/atlanize-logo.png';
	import { Button } from '$lib/components/ui/button';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { MenuIcon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';

	const sidebar = Sidebar.useSidebar();
</script>

<nav class="flex justify-between p-4">
	<Button onclick={() => sidebar.toggle()} variant="outline" size="icon" aria-label="Submit">
		<HugeiconsIcon icon={MenuIcon} class="size-4" />
	</Button>

	<div class="ml-auto">
		<a href={resolve('/dashboard')}>
			<img src={logo} alt="ATLANIZE Logo" class="h-8 w-auto" />
		</a>
	</div>
</nav>
