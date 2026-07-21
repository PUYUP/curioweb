<script lang="ts">
	import { authClient, checkout } from '@/lib/auth-client';
	import { Button } from '@/lib/components/ui/button';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Badge } from '@/lib/components/ui/badge';
	import { Spinner } from '@/lib/components/ui/spinner';

	let subscriptionItems = $state<any[]>([]);
	let loading = $state<boolean>(true);
	let redirecting = $state<boolean>(false);

	$effect(() => {
		(async () => {
			const { data: subscriptions } = await authClient.customer.subscriptions.list({
				query: {
					page: 1,
					limit: 10,
					active: true
				}
			});

			subscriptionItems = subscriptions?.result?.items ?? [];
			loading = false;
		})();
	});

	async function manage() {
		redirecting = true;
		await authClient.customer.portal();

		setTimeout(() => {
			redirecting = false;
		}, 3000);
	}
</script>

<svelte:head>
	<title>ATLANIZE - Billing Management</title>
	<meta
		name="description"
		content="Discover the latest research and challenge your curiosity with ATLANIZE."
	/>
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if !loading}
		{#if subscriptionItems.length > 0}
			<div class="mb-4 flex items-center">
				<span>Active Subscriptions</span>
				<Button onclick={manage} disabled={redirecting} class="ml-auto">
					{redirecting ? 'Redirecting...' : 'Manage'}
				</Button>
			</div>
			{#each subscriptionItems as sub}
				<Item.Root variant="outline">
					<Item.Content>
						<Item.Title>{sub.product.name}</Item.Title>
						<Item.Description class="flex gap-1">
							<span class="uppercase">{sub.currency}</span>
							<span class="font-semibold">{sub.amount}</span>
							<span>/ {sub.recurringInterval}</span>
						</Item.Description>
					</Item.Content>

					<Item.Actions>
						{#if sub.status === 'trialing'}
							<Badge>Trial</Badge>
						{/if}
					</Item.Actions>
				</Item.Root>
			{/each}
		{:else}
			<Item.Root variant="outline">
				<Item.Content>
					<Item.Title>ATLA Bronze</Item.Title>
					<Item.Description class="flex gap-1">
						<span class="uppercase">USD</span>
						<span class="font-semibold">4.99</span>
						<span>/ month</span>
					</Item.Description>
				</Item.Content>

				<Item.Actions>
					<Button onclick={checkout}>Start 30 Days Trial</Button>
				</Item.Actions>
			</Item.Root>
		{/if}
	{:else}
		<div class="flex gap-2 items-center">
			<Spinner />
			<p>Loading...</p>
		</div>
	{/if}
</div>
