<script lang="ts">
	import { authClient, checkout } from '@/lib/auth-client';
	import { Button } from '@/lib/components/ui/button';
	import { Spinner } from '@/lib/components/ui/spinner';
	import { subscriptionPlans } from '@/lib/utils';

	let subscriptionItems = $state<any[]>([]);
	let plans = $state<any[]>(subscriptionPlans);
	let loading = $state<boolean>(true);
	let redirecting = $state<boolean>(false);

	let userId = $state<string | null>(null);
	let userEmail = $state<string | null>(null);

	$effect(() => {
		(async () => {
			const { data: session } = await authClient.getSession();
			userId = session?.user?.id ?? null;
			userEmail = session?.user?.email ?? null;

			const { data: subscriptions } = await authClient.customer.subscriptions.list({
				query: {
					page: 1,
					limit: 10,
					active: true
				}
			});

			subscriptionItems = subscriptions?.result?.items ?? [];
			loading = false;

			if (subscriptionItems.length > 0) {
				const item = subscriptionItems[0];
				plans = plans.map((plan) => {
					if (plan.name == 'ATLA Bronze') {
						plan = {
							...plan,
							isActive: item.canceledAt ? false : true,
							item: item
						};
					} else {
						plan = {
							...plan,
							isActive: item.canceledAt ? true : false,
							item: null
						};
					}
					return plan;
				});
			}
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
	<title>ATLANIZE - Subscriptions</title>
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
	<div class="mb-6 flex items-center border-b border-neutral-200 pb-4">
		<span>Active Subscriptions</span>
		{#if subscriptionItems.length > 0}
			<Button onclick={manage} disabled={redirecting} class="ml-auto">
				{redirecting ? 'Redirecting...' : 'Manage'}
			</Button>
		{/if}
	</div>

	{#if !loading}
		<div class="flex gap-6">
			{#each plans as plan}
				<div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					<div class="flex items-baseline gap-1">
						<span class="text-4xl font-semibold tracking-tight text-slate-900">
							${plan.priceAmount}
						</span>
						<span class="text-sm font-medium text-slate-500">/month</span>
					</div>

					<ul class="mt-6 space-y-3">
						{#each plan.benefits as benefit}
							<li class="flex items-start gap-3">
								<span
									class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-900"
								>
									<svg
										class="h-3 w-3 text-white"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								</span>
								<span class="text-sm text-slate-600">{benefit}</span>
							</li>
						{/each}
					</ul>

					<div class="mt-8 text-center">
						{#if plan.isActive}
							<div class="bg-lime-100 py-2.5 text-sm font-medium rounded-lg">
								Already subscribed to this plan
							</div>
						{:else}
							{#if plan.priceAmount > 0}
								<button
									type="button"
									onclick={() => (plan.item ? manage() : checkout(userId, userEmail))}
									disabled={redirecting}
									class="cursor-pointer w-full block text-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
								>
									{plan.item ? 'Manage' : 'Subscribe'}
								</button>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex gap-2 items-center">
			<Spinner />
			<p>Loading...</p>
		</div>
	{/if}
</div>
