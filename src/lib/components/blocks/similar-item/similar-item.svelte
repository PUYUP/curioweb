<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import Icon from 'mdi-svelte';
	import { mdiFilePdfBox } from '@mdi/js';
	import { Button } from '@/lib/components/ui/button';
	import { authClient, checkout } from '@/lib/auth-client';

	const { item, user } = $props();

	const contentSummary = $derived(item?.summaryContent || '');
	let isExpanded = $state(false);
	let isTruncated = $state(false);
	let contentEl: HTMLDivElement | undefined = $state();

	let lineClamp = $derived(isExpanded ? 100 : 3);

	function fixMarkdownHeadings(markdownText: string) {
		// Langkah 1: Memastikan heading turun ke paragraf baru (jika menempel dengan teks sebelumnya)
		let fixed = markdownText.replace(/([^\n])\s*(#{1,6})\s+/g, '$1\n\n$2 ');

		// Langkah 2: Memindahkan teks setelah titik dua (:) pada judul heading menjadi baris baru
		// Regex mencari baris yang diawali dengan '#', lalu mencari teks sampai ketemu ':',
		// dan memotong spasi setelah ':' untuk diganti dengan enter (\n)
		fixed = fixed.replace(/^(#{1,6}\s+[^:\n]+:)\s*(?=\S)/gm, '$1\n');

		return fixed;
	}

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

				<div class="mt-1 flex gap-2 items-center text-sm">
					<span class="text-orange-700">Similarity average:</span>
					<span class="text-orange-700 font-bold underline">
						{(item?.averageSimilarityScore * 100).toFixed(1)}%
					</span>
					<span>({item?.averageSimilarityScore.toFixed(8)})</span>
					<span class="underline">of {item?.documentChunks.length} chunks</span>
				</div>
			</div>

			{#if contentSummary && contentSummary != ''}
				<div class="block my-4 py-4 block-content border-y border-neutral-300">
					<SvelteMarkdown source={fixMarkdownHeadings(contentSummary)} />
				</div>
			{/if}

			<button
				type="button"
				class="block w-full cursor-pointer text-left"
				onclick={() => (isExpanded = !isExpanded)}
			>
				<div bind:this={contentEl} class="text-neutral-700 text-left line-clamp-{lineClamp}">
					<span class="font-semibold underline">Matched {item?.documentChunks.length} chunks:</span>
					<ol class="list-decimal pl-6 my-2">
						{#each item?.documentChunks as chunk}
							<li class="mt-2">
								<div class="block text-green-600 underline font-semibold mb-1">
									Similarity score: {chunk?.similarityScore.toFixed(8)}
								</div>
								{chunk?.documentContent}
							</li>
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

<style>
	.block-content :global(h2),
	.block-content :global(h3),
	.block-content :global(h4) {
		font-weight: 600;
		margin-bottom: 6px;
	}

	.block-content :global(p) {
		margin-bottom: 10px;
		white-space: pre-line;
	}

	.block-content :global(ul) {
		margin-top: 6px;
		margin-bottom: 10px;
		white-space: pre-line;
		list-style-type: disc;
		padding-left: 24px;
	}

	.block-content :global(li) {
		margin-bottom: 10px;
	}

	.block-content :global(a) {
		text-decoration: underline;
	}

	.block-content :global(blockquote) {
		padding: 10px;
		background: #f8f9fa;
		margin-bottom: 10px;
	}
</style>
