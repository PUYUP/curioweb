<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { ActionData, PageServerData } from './$types';
	import { Textarea } from '@/lib/components/ui/textarea';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { PaperItem } from '@/lib/components/blocks/paper-item';
	import { page } from '$app/state';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { sharedState } from '@/lib/state.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '@/lib/components/ui/badge';
	import { onDestroy, tick } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Icon from 'mdi-svelte';
	import { mdiChevronRight } from '@mdi/js';
	import { EvaluationCRT003 } from '@/lib/components/blocks/evaluation-crt003';

	let { code } = page.params;
	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let saving = $state<boolean>(false);
	let textValue = $state<string>('');
	let width = $state<number>(0);
	let height = $state<number>(0);
	let orientation = $derived(width > 1280 ? 'vertical' : 'horizontal') as 'vertical' | 'horizontal';
	let drawerOpen = $state<boolean>(false);

	// --- Carousel State ---
	let emblaApi = $state<any>(undefined);

	// --- Auto-draft state ---
	let draftTimer: ReturnType<typeof setTimeout> | undefined;
	let draftStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let lastSavedValue = $state<string>('');
	const DRAFT_DEBOUNCE_MS = 1500;

	// ---- Answer Similarities ----
	let answerSimilarities = $state<Record<string, any[]>>({});
	let answerSimilarityDetail = $state<any>(null);
	let answerSimilarityList = $state<any[]>([]);
	let isLoading = $state(false);
	let hasScored = $state(false);
	let drawerAnswerOpen = $state(false);
	let drawerListAnswerOpen = $state(false);

	// ---- Assessment ----
	let answerEvaluations = $state<Record<string, any>>({});
	let drawerEvaluationOpen = $state(false);
	let hasEvaluated = $state<boolean>(false);

	$effect(() => {
		if (sharedState.summary && sharedState.summary.length > 0) {
			drawerOpen = true;
		}

		if (sharedState.similarity && sharedState.similarity.length > 0) {
			drawerListAnswerOpen = true;
		}

		if (data?.answer) {
			textValue = data?.answer?.content || '';
		}
	});

	function handleDrawerOpenChange(open: boolean) {
		drawerOpen = open;
		if (!open) {
			// Bersihkan summary begitu drawer ditutup (tombol close, overlay, swipe, atau Escape)
			sharedState.summary = null;
			sharedState.similarity = null;
		}
	}

	function handleAnswerDrawerOpenChange(open: boolean) {
		drawerAnswerOpen = open;
		if (!open) {
			answerSimilarityDetail = null;
		}
	}

	function handleListAnswerDrawerOpenChange(open: boolean) {
		drawerListAnswerOpen = open;
		if (!open) {
			answerSimilarityList = [];
			sharedState.similarity = null;
		}
	}

	function scheduleDraftSave() {
		// Batalkan timer sebelumnya tiap kali user mengetik lagi
		if (draftTimer) clearTimeout(draftTimer);
		draftTimer = setTimeout(() => {
			saveDraft();
		}, DRAFT_DEBOUNCE_MS);
	}

	async function saveDraft() {
		// Jangan bentrok dengan submit manual, dan jangan save kalau isi tidak berubah
		if (saving) return;
		if (textValue === lastSavedValue) return;
		if (textValue.trim().length === 0) return;

		draftStatus = 'saving';

		try {
			const formData = new FormData();
			formData.set('content', textValue);

			const response = await fetch('?/draft', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type === 'success' || result.type === 'failure') {
				await applyAction(result);
			}

			if (result.type === 'success') {
				lastSavedValue = textValue;
				draftStatus = 'saved';
			} else {
				draftStatus = 'error';
			}
		} catch (e) {
			console.error('Auto-draft gagal:', e);
			draftStatus = 'error';
		}
	}

	function handleInput() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
		draftStatus = 'idle';
		scheduleDraftSave();
	}

	onDestroy(() => {
		if (draftTimer) clearTimeout(draftTimer);
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		if (draftTimer) clearTimeout(draftTimer); // batalkan draft pending saat submit manual

		// Display the standard browser modal
		const confirmed = confirm('Are you sure you want to submit this answer?');

		// Halt submission if they choose cancel
		if (!confirmed) {
			cancel();
			return;
		}

		form = null;
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
			lastSavedValue = textValue;
			draftStatus = 'idle';
		};
	};

	// get answer similarity
	async function getAnswerSimilarity(challengePaperId: string): Promise<string[] | null> {
		const response = await fetch(`/api/answer-similarities?challengePaperId=${challengePaperId}`, {
			method: 'GET'
		});

		if (!response.ok) {
			console.error(`Fetch gagal (${response.status}) untuk challengePaperId=${challengePaperId}`);
			return null;
		}

		const text = await response.text();
		if (!text) {
			console.warn(`Response kosong untuk challengePaperId=${challengePaperId}`);
			return null;
		}

		try {
			return JSON.parse(text);
		} catch (e) {
			console.error('Gagal parse JSON:', text);
			return null;
		}
	}

	// get evaluation
	async function getEvaluation(challengePaperId: string): Promise<any | null> {
		const response = await fetch(`/api/evaluations?challengePaperId=${challengePaperId}`, {
			method: 'GET'
		});

		if (!response.ok) {
			console.error(`Fetch gagal (${response.status}) untuk challengePaperId=${challengePaperId}`);
			return null;
		}

		const text = await response.text();
		if (!text) {
			console.warn(`Response kosong untuk challengePaperId=${challengePaperId}`);
			return null;
		}

		try {
			return JSON.parse(text);
		} catch (e) {
			console.error('Gagal parse JSON:', text);
			return null;
		}
	}

	// Trigger data fetching
	$effect(() => {
		if (!data) return;
		const challengePapers = data.challenge.challenge_papers;
		let cancelled = false;

		(async () => {
			isLoading = true;

			// jalankan semua fetch secara paralel
			const similarityResults = await Promise.all(
				challengePapers.map(async (challengePaper) => {
					const result = await getAnswerSimilarity(challengePaper.id);
					return { id: challengePaper.id, result };
				})
			);

			const evaluationResults = await Promise.all(
				challengePapers.map(async (challengePaper) => {
					const result = await getEvaluation(challengePaper.id);
					return { id: challengePaper.id, result };
				})
			);

			if (cancelled) return;

			// gabungkan semua hasil jadi satu object, sekali update state
			const newSimilarities: Record<string, string[]> = {};
			for (const { id, result } of similarityResults) {
				if (result !== null) {
					newSimilarities[id] = result;
				}
			}

			const newEvaluations: Record<string, any> = {};
			for (const { id, result } of evaluationResults) {
				if (result !== null) {
					newEvaluations[id] = result;
				}
			}

			answerSimilarities = newSimilarities;
			answerEvaluations = newEvaluations;

			isLoading = false;

			// score checker
			if (Object.values(newSimilarities).every((arr) => arr.length > 0)) {
				hasScored = true;
			}

			// evaluated checker
			if (
				Object.keys(newEvaluations).length > 0 &&
				Object.values(newEvaluations).every((evaluation) => evaluation.results.length > 0)
			) {
				hasEvaluated = true;
			}

			// rebuild caraouzel
			await tick();
			emblaApi?.reInit();
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<!-- Bind the window dimensions directly -->
<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<svelte:head>
	<title>{code}</title>
</svelte:head>

{#if !data || !data.challenge}
	<p>Loading...</p>
{:else}
	<div class="mx-auto w-full pt-0 md:pt-0 lg:py-0 px-4">
		<table class="mb-2">
			<tbody>
				<tr class="flex gap-4 py-0.5">
					<td class="text-sm flex-none w-24">Code</td>
					<td class="text-sm font-semibold">: {data.challenge.code}</td>
				</tr>

				<tr class="flex gap-4 py-0.5">
					<td class="text-sm flex-none w-24">Status</td>
					<td class="text-sm font-semibold uppercase">: {data.challenge.status}</td>
				</tr>

				<tr class="flex gap-4 py-0.5">
					<td class="text-sm flex-none w-24">Received on</td>
					<td class="text-sm font-semibold">: {data.challenge.createdAt.toLocaleDateString()}</td>
				</tr>
			</tbody>
		</table>

		<div class="grid grid-cols-1 xl:grid-cols-1 gap-6">
			<div class="flex gap-6">
				{#key orientation}
					<Carousel.Root
						setApi={(api) => (emblaApi = api)}
						opts={{ align: 'start' }}
						orientation={'horizontal'}
						class="w-full"
					>
						<Carousel.Content>
							{#each data.challenge.challenge_papers as challenge, i}
								<Carousel.Item class="basis-full lg:basis-1/2">
									<div class="flex flex-col relative h-full">
										<div class="flex-1 px-0.5 py-1">
											<PaperItem
												paper={{ ...challenge.paper }}
												index={i}
												{challenge}
												sample={false}
												similarityScore={answerSimilarities[challenge.id]}
											/>
										</div>
									</div>
								</Carousel.Item>
							{/each}
						</Carousel.Content>

						<Carousel.Previous class="carousel-prev-button" />
						<Carousel.Next class="carousel-next-button" />
					</Carousel.Root>
				{/key}
			</div>

			{#if hasEvaluated}
				<div class="py-0">
					<EvaluationCRT003 data={answerEvaluations} />
				</div>
			{/if}

			<div class="w-full py-1">
				<div class="mb-2 text-sm font-bold">My Answer</div>
				<form
					method="post"
					action="?/submit"
					class="flex flex-col relative h-full"
					use:enhance={handleSubmit}
				>
					<!-- Wrapper relative untuk textarea + button -->
					<div class="relative flex-1 min-h-0">
						<Textarea
							placeholder="Read both papers, connect the key ideas, and expand on them using your knowledge."
							class="h-full w-full !text-base"
							bind:value={textValue}
							oninput={handleInput}
							name="content"
							disabled={data?.answer?.status == 'submitted'}
						/>
					</div>

					<!-- Button absolute di dalam textarea, tidak kena scroll -->
					<div class="relative mt-auto py-4">
						<!-- {#if form?.message}
							<p style="color: red" class="text-xs mb-2">{form?.message}</p>
						{/if} -->

						<div class="flex justify-between items-center">
							{#if !hasScored}
								<Button
									type="submit"
									size="lg"
									disabled={saving || data?.answer?.status == 'submitted'}
									variant={data?.answer?.status == 'submitted' ? 'ghost' : 'default'}
								>
									{#if saving}
										Saving...
									{:else if data?.answer?.status == 'submitted'}
										Submitted - wait for analysis (refresh the page periodically to see results)
									{:else}
										Submit & Analyze
									{/if}
								</Button>
							{/if}

							<div class="ml-auto flex flex-row items-center gap-2 text-xs text-neutral-500">
								{#if data?.answer && data?.answer?.status == 'draft'}
									<Badge variant="default" class="bg-blue-500 text-white">Draft</Badge>
								{/if}
								{#if draftStatus === 'saving'}
									<span class="italic">Saving draft...</span>
								{:else if draftStatus === 'saved'}
									<span class="italic text-green-600">Draft saved</span>
								{:else if draftStatus === 'error'}
									<span class="italic text-red-500">Failed to save draft</span>
								{/if}
								<p>Characters: {textValue.length}</p>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>

	<Drawer.Root direction="right" open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
		<Drawer.Content class="fixed flex w-full max-w-lg flex-col after:hidden">
			<div class="flex h-full flex-col overflow-hidden">
				<Drawer.Header class="text-left">
					<Drawer.Title>Full Summaries</Drawer.Title>
				</Drawer.Header>

				<div class="prose flex-1 space-y-3 overflow-y-auto px-4 pb-4">
					{#each sharedState.summary ?? [] as item, i}
						{@const hasResult = item && typeof item === 'object' && 'result' in item}
						{@const result = hasResult ? item.result : item}
						{@const metadata = hasResult ? item.metadata : null}
						{@const isError = typeof result === 'string'}

						{#if isError}
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-red-300 bg-red-200">Item {i + 1} gagal</span>
								</p>
								<p class="text-base text-red-700 leading-6">{result}</p>
							</div>
						{:else}
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-yellow-300 bg-yellow-200">1. Background</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['background']}</p>
							</div>
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-blue-300 bg-blue-200">2. Methods</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['methods']}</p>
							</div>
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-green-300 bg-green-200">3. Results</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['results']}</p>
							</div>
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-teal-300 bg-teal-200">4. Conclusion</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['conclusions']}</p>
							</div>
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-red-300 bg-red-200">5. Limitations</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['limitations']}</p>
							</div>
							<div class="flex flex-col mb-6">
								<p class="text-base font-semibold mb-2 underline">
									<span class="border-b-3 border-purple-300 bg-purple-200">6. Future Work</span>
								</p>
								<p class="text-base text-neutral-800 leading-6">{result['future_works']}</p>
							</div>

							{#if metadata}
								<p class="text-xs text-neutral-400 mb-6">
									model: {metadata.model_version ?? '-'} · tokens: {metadata.usage_metadata
										?.total_token_count ?? '-'}
								</p>
							{/if}
						{/if}
					{/each}
				</div>

				<Drawer.Footer>
					<Drawer.Close>
						<Button variant="outline" class="w-full">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>

	<Drawer.Root
		direction="right"
		open={drawerListAnswerOpen}
		onOpenChange={handleListAnswerDrawerOpenChange}
	>
		<Drawer.Content class="fixed flex w-full max-w-lg flex-col after:hidden">
			<div class="flex h-full flex-col overflow-hidden">
				<Drawer.Header class="text-left">
					<Drawer.Title>Similarity Chunks</Drawer.Title>
				</Drawer.Header>

				<div class="prose flex-1 space-y-3 overflow-y-auto px-4 pb-4">
					{#if sharedState.similarity}
						<Table.Root>
							<Table.Body>
								{#if sharedState.similarity.length === 0}
									<Table.Row>
										<Table.Cell colspan={2}
											>Submit your answer to see the similarity scores.</Table.Cell
										>
									</Table.Row>
								{:else}
									{#each sharedState.similarity as sim}
										<Table.Row
											class="cursor-pointer"
											onclick={() => {
												drawerAnswerOpen = true;
												answerSimilarityDetail = sim;
											}}
										>
											<Table.Cell class="whitespace-normal break-words py-4">
												<p class="line-clamp-1 text-sm mb-1 text-neutral-700">
													<span
														class="w-6 text-center inline-block border-b-3 border-yellow-300 bg-yellow-200 px-1 font-semibold text-sm"
														>A:</span
													>
													{sim.answerChunkContent}
												</p>
												<p class="line-clamp-1 text-sm mb-4 text-neutral-700">
													<span
														class="w-6 text-center inline-block border-b-3 border-blue-300 bg-blue-200 px-1 font-semibold text-sm"
														>P:</span
													>
													{sim.paperChunkContent}
												</p>
												<span
													class="border-b-3 border-green-300 bg-green-200 px-1 text-xs font-semibold"
												>
													Score: {sim.similarityScore}
												</span>
											</Table.Cell>
											<Table.Cell class="text-right">
												<Icon path={mdiChevronRight} size="1.25rem" />
											</Table.Cell>
										</Table.Row>
									{/each}
								{/if}
							</Table.Body>
						</Table.Root>
					{/if}
				</div>

				<Drawer.Root
					direction="right"
					open={drawerAnswerOpen}
					onOpenChange={handleAnswerDrawerOpenChange}
				>
					<Drawer.Content class="fixed flex w-full max-w-lg flex-col after:hidden">
						<div class="flex h-full flex-col overflow-hidden">
							<Drawer.Header class="text-left">
								<Drawer.Title>Answer Details</Drawer.Title>
							</Drawer.Header>

							<div class="prose flex-1 space-y-3 overflow-y-auto px-4 pb-4">
								{#if answerSimilarityDetail}
									<div
										class="mb-6 bg-green-200 border-green-300 h-20 w-full rounded-lg flex flex-col items-center justify-center"
									>
										<span class="font-bold">Similarity Score</span>
										<span class="text-3xl">{answerSimilarityDetail.similarityScore}</span>
									</div>

									<div class="mb-2 text-sm font-semibold">
										<span class="border-b-3 border-yellow-300 bg-yellow-200"> Answer</span>
									</div>
									<p class="text-base">{answerSimilarityDetail.answerChunkContent}</p>

									<div class="mb-2 text-sm font-semibold">
										<span class="border-b-3 border-blue-300 bg-blue-200">Paper Chunk</span>
									</div>
									<p class="text-base">{answerSimilarityDetail.paperChunkContent}</p>
								{/if}
							</div>

							<Drawer.Footer>
								<Drawer.Close>
									<Button variant="outline" class="w-full">Close</Button>
								</Drawer.Close>
							</Drawer.Footer>
						</div>
					</Drawer.Content>
				</Drawer.Root>

				<Drawer.Footer>
					<Drawer.Close>
						<Button variant="outline" class="w-full">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<style>
	:global(.carousel-prev-button),
	:global(.carousel-next-button) {
		background-color: #38b9fc;
	}

	:global(.carousel-prev-button svg),
	:global(.carousel-next-button svg) {
		color: white;
		width: 18px;
		height: 18px;
	}

	:global(.carousel-prev-button) {
		left: -10px;
	}

	:global(.carousel-next-button) {
		right: -10px;
	}

	.prose :global(p) {
		font-family: Newsreader, Georgia, 'Times New Roman', Times, serif;
	}

	@media (min-width: 1024px) {
		:global(.carousel-prev-button),
		:global(.carousel-next-button) {
			display: none;
		}
	}
</style>
