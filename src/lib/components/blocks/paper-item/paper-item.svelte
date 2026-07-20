<script lang="ts">
	import { marked } from 'marked';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { PaperSummary } from '@/lib/types/interfaces';
	import Badge from '../../ui/badge/badge.svelte';
	import Icon from 'mdi-svelte';
	import { mdiShimmer } from '@mdi/js';
	import { handleShowSummary, handleShowSimilarity } from '$lib/state.svelte';
	import { getHighestAndLowestScore } from '@/lib/utils';

	const {
		paper,
		challenge,
		index = null,
		sample = false,
		showTitle = false,
		similarityScore = null
	} = $props<{
		paper: PaperSummary;
		challenge?: any;
		index?: null | number;
		sample?: boolean;
		showTitle?: boolean;
		similarityScore?: any;
	}>();

	const htmlContent = $derived(
		marked.parse(
			(challenge?.summary && challenge.summary.results.length > 0
				? `<p class="mb-2 pb-2"><span class="font-normal border-b-3 border-yellow-400 bg-yellow-300">Background:</span> ${challenge.summary.results[0].background}</p>\n<p class="mb-2 pb-2"><span class="font-normal border-b-3 border-green-400 bg-green-300">Results:</span> ${challenge.summary.results[0].results}</p>`
				: paper.abstract) ?? ''
		)
	);

	const showSummaryHandler = async (results: any) => {
		handleShowSummary(results);
	};

	const showSimilarityHandler = async (results: any) => {
		handleShowSimilarity(results);
	};
</script>

<Card class="h-full">
	<CardHeader>
		{#if similarityScore}
			{@const highestAndLowest = getHighestAndLowestScore(similarityScore)}

			<div class="border-0 mb-4">
				<div class="flex items-center">
					<div class="flex-1">
						<div class="mb-1 text-sm font-bold">Answer Similarity Score</div>
						<div class="flex items-center gap-1 text-sm">
							<span class="flex-none w-18">Highest: </span>
							<span class="font-bold">
								{highestAndLowest?.highest.similarityScore}
							</span>
						</div>

						<div class="flex items-center gap-1 text-sm">
							<span class="flex-none w-18">Lowest: </span>
							<span class="font-bold">
								{highestAndLowest.lowest.similarityScore}
							</span>
						</div>
					</div>

					<div class="ml-auto">
						<Button variant="outline" onclick={() => showSimilarityHandler(similarityScore)}>
							View Details
						</Button>
					</div>
				</div>
			</div>
		{/if}

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

		{#if paper.pdfUrl}
			<div class="source pt-2">
				<ol class="list-none pl-0">
					<li>
						<a href={paper.pdfUrl} class="text-blue-500 line-clamp-3 text-sm" target="_blank">
							<Badge variant="destructive" class="uppercase">{challenge.status}</Badge>
							{paper.title} &nearr;
						</a>
					</li>
				</ol>
			</div>
		{/if}
	</CardHeader>

	<CardContent>
		<div class="prose dark:prose-invert prose-sm sm:prose-base">
			{@html htmlContent}
		</div>
	</CardContent>

	{#if challenge?.summary && challenge.summary.results.length > 0}
		<CardFooter class="mt-auto flex items-center">
			<Button variant="link" onclick={() => showSummaryHandler(challenge.summary.results)}>
				<Icon path={mdiShimmer} color={'#666'} class="size-4" />
				Read Full Summary
			</Button>

			{#if index != null}
				<div class="ml-auto uppercase text-base">
					{#if index == 0}Paper <strong>A</strong>{/if}{#if index == 1}Paper <strong>Z</strong>{/if}
				</div>
			{/if}
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
