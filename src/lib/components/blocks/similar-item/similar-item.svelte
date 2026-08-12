<script lang="ts">
	import Icon from 'mdi-svelte';
	import { mdiFilePdfBox } from '@mdi/js';
	import { Button } from '@/lib/components/ui/button';
	import { authClient, checkout } from '@/lib/auth-client';

	const { item, user } = $props();

	let isExpanded = $state(false);
	let isTruncated = $state(false);
	let contentEl: HTMLDivElement | undefined = $state();

	let lineClamp = $derived(isExpanded ? 100 : 3);

	function checkTruncation() {
		if (contentEl) {
			// bandingkan tinggi asli konten vs tinggi yang terlihat (setelah clamp)
			isTruncated = contentEl.scrollHeight > contentEl.clientHeight;
		}
	}

	$effect(() => {
		// hanya perlu dicek ulang saat kondisi belum expand (masih di-clamp)
		if (!isExpanded) {
			checkTruncation();
		}
	});
</script>

{#if item}
	<li class="text-sm mb-4">
		{#if item.paper}
			<div class="mb-2">
				<a
					href={item?.paper?.pdfUrl}
					target="_blank"
					class="flex w-full justify-between text-lg font-semibold"
				>
					<span class="flex-1 text-blue-600 text-base">
						{item?.paper?.title}
					</span>
					<span class="ml-auto text-red-600">
						<Icon path={mdiFilePdfBox} size={0.85} />
					</span>
				</a>

				<div class="mt-0 flex gap-2 items-center text-sm">
					<span class="text-orange-500">Similarity average:</span>
					<span class="text-orange-600 font-bold underline">
						{(item?.averageSimilarityScore * 100).toFixed(1)}%
					</span>
					<span>({item?.averageSimilarityScore.toFixed(8)})</span>
					<span class="underline">of {item?.documentChunks.length} chunks</span>
				</div>
			</div>

			<button
				type="button"
				class="block w-full cursor-pointer text-left"
				onclick={() => (isExpanded = !isExpanded)}
			>
				<div bind:this={contentEl} class="text-neutral-700 text-left line-clamp-{lineClamp}">
					<span class="font-semibold underline">Matched chunks:</span>
					<ol class="list-decimal pl-6 my-2">
						{#each item?.documentChunks as chunk}
							<li class="mt-2">{chunk?.documentContent}</li>
						{/each}
					</ol>
				</div>

				{#if isTruncated || isExpanded}
					<span class="mt-1 italic inline-block text-xs font-medium underline">
						{isExpanded ? 'View less' : 'View more...'}
					</span>
				{/if}
			</button>
		{:else}
			<div class="flex items-center p-3 bg-neutral-100 rounded-lg shadow">
				<div class="block flex-1">
					<div class="font-semibold">Paper information are hidden</div>
					<div class="mt-0 flex gap-2 items-center text-sm">
						<span class="text-orange-500">Similarity Score:</span>
						<span class="text-orange-600 font-bold underline">
							{(item?.similarityScore * 100).toFixed(1)}%
						</span>
						<span class="text-xs">({item?.similarityScore})</span>
					</div>
				</div>

				<div class="ml-auto">
					<Button
						variant="default"
						onclick={async () => {
							if (user?.subscription?.status === 'canceled') {
								await authClient.customer.portal();
							} else {
								await checkout(user.id, user.email);
							}
						}}
					>
						Subscribe to Unlock
					</Button>
				</div>
			</div>
		{/if}
	</li>
{/if}
