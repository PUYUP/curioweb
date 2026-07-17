<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';
	import Icon from 'mdi-svelte';
	import {
		mdiHomeOutline,
		mdiConnection,
		mdiAccount,
		mdiArchiveOutline,
		mdiCreditCardOutline,
		mdiNoteOutline
	} from '@mdi/js';

	let { user }: { user: any } = $props();

	const handleSignOut = async () => {
		const result = await fetch(resolve('/dashboard?/signOut'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		const data = await result.json();
		if (data.type === 'redirect') {
			window.location.href = result.url;
		}
	};

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: mdiHomeOutline,
			badge: ''
		},
		{
			title: 'Research Logs',
			url: '/logs',
			icon: mdiNoteOutline,
			badge: ''
		},
		{
			title: 'Archives',
			url: '/challenge',
			icon: mdiArchiveOutline,
			badge: ''
		},
		{
			title: 'Integrations',
			url: '#',
			icon: mdiConnection,
			badge: ''
		},
		{
			title: 'Billing',
			url: '#',
			icon: mdiCreditCardOutline,
			badge: ''
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Header class="p-4">
		<div class="flex justify-start flex-row items-center mb-2 gap-2">
			{#if user.image}
				<enhanced:img src={user.image} alt={user.name} class="w-10 h-10 flex-none rounded-full" />
			{:else}
				<div
					class="w-10 h-10 flex items-center justify-center flex-none bg-neutral-200 rounded-full"
				>
					<Icon path={mdiAccount} class="size-6" />
				</div>
			{/if}
			<div class="block">
				<p class="text-sm line-clamp-1 mb-0.5 font-semibold">{user.name}</p>
				<p class="text-xs text-neutral-600 line-clamp-1">{user.email}</p>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem class="!px-2">
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<Icon path={item.icon} size="1.25rem" />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>

					{#if item.badge.trim() != ''}
						<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
					{/if}
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Content>
	<Sidebar.Footer class="p-4">
		<div class="flex justify-center w-full">
			<Button variant="outline" size="lg" onclick={handleSignOut} class="w-full">Sign out</Button>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
