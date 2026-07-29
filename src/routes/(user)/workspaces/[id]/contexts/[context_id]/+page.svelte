<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	let { context } = $derived(data);
</script>

<div class="px-4 pb-4">
	<div class="mb-4 border-b border-neutral-200 pb-2 flex w-full justify-between items-center">
		<div class="block">Research Context</div>

		<Button
			class="ml-auto"
			href={`/workspaces/${context?.workspaceId}/contexts/editor?id=${context?.id}`}
			variant="outline"
		>
			Edit
		</Button>
	</div>

	<div class="w-full md:w-3/6 pb-4">
		<p>{context?.content}</p>
	</div>
</div>
