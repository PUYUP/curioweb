<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { scalePoint } from 'd3-scale';
	import { BarChart } from 'layerchart';
	import Icon from 'mdi-svelte';
	import { mdiTrendingUp } from '@mdi/js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cubicInOut } from 'svelte/easing';
	import { parse, format } from 'date-fns';

	type SoloDatum = {
		month: string;
		year: string;
		prestructural: number;
		unistructural: number;
		multistructural: number;
		relational: number;
		extended_abstract: number;
	};

	let chartData = $state<SoloDatum[]>([]);

	const chartConfig = {
		prestructural: { label: 'Prestructural', color: 'var(--chart-1)' },
		unistructural: { label: 'Unistructural', color: 'var(--chart-2)' },
		multistructural: { label: 'Multistructural', color: 'var(--chart-3)' },
		relational: { label: 'Relational', color: 'var(--chart-4)' },
		extended_abstract: { label: 'Extended Abstract', color: 'var(--chart-5)' }
	} satisfies Chart.ChartConfig;

	async function getSummary(): Promise<any[] | null> {
		const response = await fetch(`/api/evaluations/solos`, {
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
					prestructural: Number(r.summary.prestructural),
					unistructural: Number(r.summary.unistructural),
					multistructural: Number(r.summary.multistructural),
					relational: Number(r.summary.relational),
					extended_abstract: Number(r.summary.extended_abstract)
				};
			});

			chartData = x ?? [];
		})();
	});
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Structure of the Observed Learning Outcome</Card.Title>
		<Card.Description>Range score: 1 (Worst) - 10 (Best)</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[220px] w-full">
			<BarChart
				data={chartData}
				xScale={scaleBand().padding(0.15)}
				x="month"
				axis={true}
				yDomain={[0, 10]}
				series={[
					{ key: 'prestructural', label: 'Prestructural', color: chartConfig.prestructural.color },
					{ key: 'unistructural', label: 'Unistructural', color: chartConfig.unistructural.color },
					{
						key: 'multistructural',
						label: 'Multistructural',
						color: chartConfig.multistructural.color
					},
					{ key: 'relational', label: 'Relational', color: chartConfig.relational.color },
					{
						key: 'extended_abstract',
						label: 'Extended Abstract',
						color: chartConfig.extended_abstract.color
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
					xAxis: { format: (d) => d.slice(0, 3) },
					yAxis: { ticks: 10 }
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
