<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { scalePoint } from 'd3-scale';
	import { BarChart } from 'layerchart';
	import Icon from 'mdi-svelte';
	import { mdiTrendingUp } from '@mdi/js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cubicInOut } from 'svelte/easing';
	import { format, parse } from 'date-fns';

	type HotsDatum = {
		month: string;
		year: string;
		content_mastery: number;
		logical_flow: number;
		critical_thinking: number;
		academic_language: number;
		cognitive_synthesis: number;
		memory_retention: number;
		cognitive_stretch: number;
	};

	let chartData = $state<HotsDatum[]>([]);

	const chartConfig = {
		content_mastery: { label: 'Content Mastery', color: 'var(--chart-1)' },
		logical_flow: { label: 'Logical Flow', color: 'var(--chart-2)' },
		critical_thinking: { label: 'Critical Thinking', color: 'var(--chart-3)' },
		academic_language: { label: 'Academic Language', color: 'var(--chart-4)' },
		cognitive_synthesis: { label: 'Cognitive Synthesis', color: 'var(--chart-5)' },
		memory_retention: { label: 'Memory Retention', color: 'var(--chart-6)' },
		cognitive_stretch: { label: 'Cognitive Stretch', color: 'var(--chart-7)' }
	} satisfies Chart.ChartConfig;

	async function getSummary(): Promise<string[] | null> {
		const response = await fetch(`/api/evaluations/hots`, {
			method: 'GET'
		});

		if (!response.ok) {
			console.error(`Fetch gagal (${response.status})`);
			return null;
		}

		const text = await response.text();
		if (!text) {
			console.warn(`Response kosong`);
			return null;
		}

		try {
			return JSON.parse(text);
		} catch (e) {
			console.error('Gagal parse JSON:', text);
			return null;
		}
	}

	$effect(() => {
		(async () => {
			const results = await getSummary();

			const x = results?.map((r: any) => {
				const dateObj = parse(r.month, 'MM-yyyy', new Date());
				return {
					month: format(dateObj, 'MMMM'),
					year: format(dateObj, 'yyyy'),
					content_mastery: Number(r.summary.content_mastery),
					logical_flow: Number(r.summary.logical_flow),
					critical_thinking: Number(r.summary.critical_thinking),
					academic_language: Number(r.summary.academic_language),
					cognitive_synthesis: Number(r.summary.cognitive_synthesis),
					memory_retention: Number(r.summary.memory_retention),
					cognitive_stretch: Number(r.summary.cognitive_stretch)
				};
			});

			chartData = x ?? [];
		})();
	});
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Multidimensional Cognitive Assessment</Card.Title>
		<Card.Description>Range score: 1 (Worst) - 10 (Best)</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[160px] w-full">
			<BarChart
				data={chartData}
				xScale={scaleBand().padding(0.15)}
				x="month"
				axis="x"
				series={[
					{
						key: 'content_mastery',
						label: 'Content Mastery',
						color: chartConfig.content_mastery.color
					},
					{ key: 'logical_flow', label: 'Logical Flow', color: chartConfig.logical_flow.color },
					{
						key: 'critical_thinking',
						label: 'Critical Thinking',
						color: chartConfig.critical_thinking.color
					},
					{
						key: 'academic_language',
						label: 'Academic Language',
						color: chartConfig.academic_language.color
					},
					{
						key: 'cognitive_synthesis',
						label: 'Cognitive Synthesis',
						color: chartConfig.cognitive_synthesis.color
					},
					{
						key: 'memory_retention',
						label: 'Memory Retention',
						color: chartConfig.memory_retention.color
					},
					{
						key: 'cognitive_stretch',
						label: 'Cognitive Stretch',
						color: chartConfig.cognitive_stretch.color
					}
				]}
				x1Scale={scaleBand().paddingInner(0.2)}
				seriesLayout="group"
				rule={false}
				props={{
					bars: {
						stroke: 'none',
						strokeWidth: 0,
						rounded: 'all',
						motion: { type: 'tween', duration: 500, easing: cubicInOut }
					},
					highlight: { area: { fill: 'none' } },
					xAxis: { format: (d) => d.slice(0, 3) }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="dashed" />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 mt-4 text-sm">
			<div class="grid grid-cols-2 gap-1 space-2 w-full">
				{#each Object.entries(chartConfig) as [key, value]}
					<div class="flex items-center gap-2 text-sm">
						<span class="size-2.5 rounded-sm shrink-0" style="background-color: {value.color}"
						></span>
						<span class="text-muted-foreground text-xs">{value.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</Card.Footer>
</Card.Root>
