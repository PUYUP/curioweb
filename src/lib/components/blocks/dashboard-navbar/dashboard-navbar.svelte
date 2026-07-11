<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import logo from '$lib/assets/atlanize-logo.png';
	import { Button } from '$lib/components/ui/button';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { MenuIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	const HISTORY_KEY = 'has-history';
	const HIDE_BACK_ON = ['/', '/dashboard'];

	let hasHistory = $state(false);

	const canGoBack = $derived(hasHistory && !HIDE_BACK_ON.includes(page.url.pathname));

	onMount(() => {
		if (browser) {
			hasHistory = sessionStorage.getItem(HISTORY_KEY) === 'true';
		}
	});

	afterNavigate(({ from }) => {
		if (from?.url && browser) {
			sessionStorage.setItem(HISTORY_KEY, 'true');
			hasHistory = true;
		}
	});

	function goBack() {
		history.back();
	}
</script>

<nav class="flex items-center justify-between p-4">
	<div class="flex items-center gap-2">
		{#if canGoBack}
			<Button onclick={goBack} variant="outline" size="icon" aria-label="Kembali">
				<HugeiconsIcon icon={ArrowLeft01Icon} class="size-4" />
			</Button>
		{/if}

		<Button onclick={() => sidebar.toggle()} variant="outline" size="icon" aria-label="Menu">
			<HugeiconsIcon icon={MenuIcon} class="size-4" />
		</Button>
	</div>

	<div class="ml-auto">
		<a href={resolve('/dashboard')}>
			<img src={logo} alt="ATLANIZE Logo" class="h-8 w-auto" />
		</a>
	</div>
</nav>
