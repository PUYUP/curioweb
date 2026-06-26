<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { resolve } from '$app/paths';

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
</script>

<Sidebar.Root>
	<Sidebar.Header class="p-4">
		<div class="flex justify-center flex-col items-center mb-4">
			<enhanced:img src={user.image} alt={user.name} class="w-16 h-16 mb-4" />
			<p>{user.name}</p>
			<p class="text-sm text-neutral-600">{user.email}</p>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group />
		<Sidebar.Group />
	</Sidebar.Content>
	<Sidebar.Footer class="p-4">
		<div class="flex justify-center w-full">
			<Button variant="outline" size="lg" onclick={handleSignOut} class="w-full">Sign out</Button>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
