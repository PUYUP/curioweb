<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	let { context } = $derived(data);
</script>

<div class="px-4 pb-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">{context?.workspace?.title}</div>
		<div class="flex w-full justify-between items-center">
			<h1 class="!mb-0 font-semibold">Research Context</h1>
			<Button
				class="ml-auto"
				href={`/workspaces/${context?.workspaceId}/contexts/editor?id=${context?.id}`}
				variant="outline"
			>
				Edit
			</Button>
		</div>
	</div>

	<div class="w-full md:w-3/6 pb-4">
		<p>{context?.content}</p>
	</div>
</div>
