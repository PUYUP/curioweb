<script lang="ts">
	import { LineChart } from 'layerchart';
	import { curveLinearClosed } from 'd3-shape';
	import { scaleBand } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let assessmentOpen = $state(false);
	let { data }: { data: any } = $props();

	const categoryDefs = [
		{ month: 'Content Mastery', key: 'content_mastery' },
		{ month: 'Memory Retention', key: 'memory_retention' },
		{ month: 'Academic Language', key: 'academic_language' },
		{ month: 'Cognitive Stretch', key: 'cognitive_stretch' },
		{ month: 'Cognitive Synthesis', key: 'cognitive_synthesis' },
		{ month: 'Critical Thinking', key: 'critical_thinking' },
		{ month: 'Logical Flow', key: 'logical_flow' }
	];

	// Rata-rata skor per kategori dari sekumpulan hasil (results)
	function averageScore(results: any[], key: string) {
		if (!results?.length) return 0;
		const values = results.map((r) => {
			return (
				Number(
					Object.hasOwn(r?.result, 'hots') ? r?.result?.hots?.[key] : r?.result?.[`${key}_score`]
				) || 0
			);
		});
		return values.reduce((sum, v) => sum + v, 0) / values.length;
	}

	// chartData reaktif, dihitung ulang setiap kali `data` berubah
	let chartData = $derived.by(() => {
		const entries = Object.entries(data ?? {});
		const [, paperA] = entries[0] ?? [undefined, undefined];
		const [, paperZ] = entries[1] ?? [undefined, undefined];

		const resultsA = (paperA as any)?.results ?? [];
		const resultsZ = (paperZ as any)?.results ?? [];

		return categoryDefs.map(({ month, key }) => ({
			month,
			key,
			paper_a: averageScore(resultsA, key),
			paper_z: averageScore(resultsZ, key)
		}));
	});

	const chartConfig = {
		paper_a: { label: 'Paper A', color: 'var(--radar-chart-1)' },
		paper_z: { label: 'Paper Z', color: 'var(--radar-chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="h-full">
	<Card.Header class="flex items-center mb-4">
		<div class="flex-1">
			<Card.Title>Multidimensional Cognitive Assessment</Card.Title>
			<Card.Description>Range score: 1 (Worst) - 10 (Best)</Card.Description>
		</div>

		<Button variant="outline" onclick={() => (assessmentOpen = true)}>View Details</Button>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[280px] pb-10">
			<LineChart
				data={chartData}
				series={[
					{
						key: 'paper_a',
						label: 'Paper A',
						color: chartConfig.paper_a.color,
						props: {
							fill: chartConfig.paper_a.color,
							fillOpacity: 0.3
						}
					},
					{
						key: 'paper_z',
						label: 'Paper Z',
						color: chartConfig.paper_z.color,
						props: {
							fill: chartConfig.paper_z.color,
							fillOpacity: 0.3
						}
					}
				]}
				radial
				x="month"
				xScale={scaleBand()}
				padding={8}
				legend={{ classes: { root: '-bottom-10' } }}
				props={{
					spline: {
						curve: curveLinearClosed,
						stroke: '0',
						motion: 'tween'
					},
					xAxis: {
						tickLength: 10
					},
					yAxis: {
						format: () => ''
					},
					grid: {
						radialY: 'linear'
					},
					tooltip: {
						context: {
							mode: 'voronoi'
						}
					},
					highlight: {
						lines: false,
						points: { r: 4 }
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>

<Dialog.Root open={assessmentOpen} onOpenChange={(open) => (assessmentOpen = open)}>
	<Dialog.Content class="flex max-h-[90vh] w-[95vw] max-w-none flex-col sm:max-w-none p-0">
		<Dialog.Header class="p-4 pb-0">
			<Dialog.Title>Assessment Feedback</Dialog.Title>
			<Dialog.Description>
				This AI analytical results for your answer submission.
			</Dialog.Description>

			<div class="grid grid-cols-2 gap-4 pt-2">
				{#each Object.entries(data) as [key, value], index}
					<div class="text-base">
						Paper <strong>{index == 0 ? 'A' : 'Z'}</strong>
					</div>
				{/each}
			</div>
		</Dialog.Header>
		<div class="overflow-y-auto px-4">
			<div class="grid grid-cols-2 gap-8">
				{#each Object.entries(data) as [key, value], index}
					<div class="block prose">
						{#each (value as any).results as result}
							<div class="flex gap-4 flex-col">
								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-purple-300 bg-purple-200 font-semibold text-sm">
											Brain hack question
										</span>
									</div>
									<p>{result.result.brain_hack_question}</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-yellow-300 bg-yellow-200 font-semibold text-sm">
											Neuro growth feedback
										</span>
									</div>
									<p>{result.result.neuro_growth_feedback}</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-blue-300 bg-blue-200 font-semibold text-sm">
											Blind spots
										</span>
									</div>
									<ol class="list-disc pl-4 space-y-1">
										{#each result.result.blind_spots as blindSpot}
											<li>
												<p>{blindSpot}</p>
											</li>
										{/each}
									</ol>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-orange-300 bg-orange-200 font-semibold text-sm">
											Assumption and bias detection
										</span>
									</div>
									<p>
										{#if result.result.international_metrics_evaluated.assumption_and_bias_detection}
											{result.result.international_metrics_evaluated.assumption_and_bias_detection}
										{:else}
											Not evaluated
										{/if}
									</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-slate-300 bg-slate-200 font-semibold text-sm">
											Divergent synthesis
										</span>
									</div>
									<p>
										{#if result.result.international_metrics_evaluated.divergent_synthesis}
											{result.result.international_metrics_evaluated.divergent_synthesis}
										{:else}
											Not evaluated
										{/if}
									</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-indigo-300 bg-indigo-200 font-semibold text-sm">
											Evidence interrogativity
										</span>
									</div>
									<p>
										{#if result.result.international_metrics_evaluated.evidence_interrogativity}
											{result.result.international_metrics_evaluated.evidence_interrogativity}
										{:else}
											Not evaluated
										{/if}
									</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-sky-300 bg-sky-200 font-semibold text-sm">
											Issue clarification depth
										</span>
									</div>
									<p>
										{#if result.result.international_metrics_evaluated.issue_clarification_depth}
											{result.result.international_metrics_evaluated.issue_clarification_depth}
										{:else}
											Not evaluated
										{/if}
									</p>
								</div>

								<div class="block">
									<div class="mb-2 text-base">
										<span class="border-b-3 border-teal-300 bg-teal-200 font-semibold text-sm">
											Systemic implication
										</span>
									</div>
									<p>
										{#if result.result.international_metrics_evaluated.systemic_implication}
											{result.result.international_metrics_evaluated.systemic_implication}
										{:else}
											Not evaluated
										{/if}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<Dialog.Footer class="px-4 pb-4">
			<Dialog.Close>Close</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	@reference "tailwindcss";

	.prose :global(p) {
		@apply text-base leading-6 text-neutral-800;
		font-family: Newsreader, Georgia, 'Times New Roman', Times, serif;
	}
</style>
