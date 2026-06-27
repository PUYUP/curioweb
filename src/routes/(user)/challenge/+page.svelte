<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	async function create() {
		await fetch('/api/challenges', {
			method: 'POST',
			body: JSON.stringify({
				userId: data.user.id,
				targetDate: new Date().toISOString(),
				status: 'pending'
			})
		});
	}
</script>

<div class="block">
	Challenges

	<Button onclick={create}>Create Challenge</Button>
</div>
