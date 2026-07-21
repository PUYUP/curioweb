<script lang="ts">
	import { authClient, checkout } from '@/lib/auth-client';
	import { Button } from '@/lib/components/ui/button';
	import { page } from '$app/state';

	const checkoutId = $derived(page.url.searchParams.get('checkout_id'));

	$effect(() => {
		if (checkoutId) {
			(async () => {
				const { data: customerState } = await authClient.customer.state();
				console.log(customerState);

				const { data: subscriptions } = await authClient.customer.subscriptions.list({
					query: {
						page: 1,
						limit: 10,
						active: true
					}
				});

				console.log(subscriptions);
			})();
		}
	});
</script>

<div class="py-2 pb-4 md:py-4 px-4">
	<div class="text-lg">Subscriptions</div>

	<Button onclick={checkout}>Checkout</Button>
</div>
