<script lang="ts">
	import { marked } from 'marked';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import type { PaperSummary } from '@/lib/types/interfaces';
	import Badge from '../../ui/badge/badge.svelte';
	import CardFooter from '../../ui/card/card-footer.svelte';

	const {
		paper,
		challenge,
		sample = false,
		showTitle = false
	} = $props<{
		paper: PaperSummary;
		challenge?: any;
		sample?: boolean;
		showTitle?: boolean;
	}>();

	const htmlContent = $derived(marked.parse(paper.abstract ?? ''));
</script>

<Card class="h-full">
	<CardHeader>
		<div class="flex gap-2 flex-wrap">
			{#if sample}<Badge variant="destructive" class="mb-2">Sample</Badge>{/if}
			{#if paper.fieldsOfStudy.length > 0}
				<div class="flex space-x-2">
					{#each paper.fieldsOfStudy as field}
						<Badge variant="secondary">{field}</Badge>
					{/each}
				</div>
			{/if}
		</div>
		{#if showTitle}<CardTitle class="text-lg">{paper.title}</CardTitle>{/if}
	</CardHeader>

	<CardContent>
		<div class="prose dark:prose-invert prose-sm sm:prose-base">
			{@html htmlContent}
		</div>
	</CardContent>

	{#if paper.pdfUrl}
		<CardFooter class="mt-auto">
			<div class="source pt-2">
				<div class="text-xs italic text-neutral-500 mb-2">Read full paper:</div>
				<ol class="list-decimal pl-3">
					<li>
						<a href={paper.pdfUrl} class="text-blue-500 line-clamp-2" target="_blank">
							{paper.title} &nearr;

							<Badge>{challenge.status}</Badge>
						</a>
					</li>
				</ol>
			</div>
		</CardFooter>
	{/if}
</Card>

<style>
	@reference "tailwindcss";

	.prose :global(h2) {
		@apply text-base font-semibold leading-normal mb-2 mt-4;
	}

	.prose :global(h3) {
		@apply text-base font-semibold leading-normal;
	}

	.prose :global(p) {
		@apply text-lg leading-7 text-neutral-800;
		font-family: Newsreader, Georgia, 'Times New Roman', Times, serif;
	}

	.prose :global(p + p) {
		@apply mt-4;
	}

	.source li {
		@apply text-neutral-500;
	}

	.source li + li {
		@apply mt-0;
	}
</style>
