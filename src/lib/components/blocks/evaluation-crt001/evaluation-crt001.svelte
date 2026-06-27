<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { scalePoint } from 'd3-scale';
	import { BarChart } from 'layerchart';
	import Icon from 'mdi-svelte';
	import { mdiTrendingUp } from '@mdi/js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cubicInOut } from 'svelte/easing';

	const chartData = [
		{
			month: 'March',
			prestructural: 261,
			unistructural: 34,
			multistructural: 147,
			relational: 189,
			extendedabstract: 95
		},
		{
			month: 'April',
			prestructural: 88,
			unistructural: 276,
			multistructural: 53,
			relational: 134,
			extendedabstract: 310
		},
		{
			month: 'May',
			prestructural: 193,
			unistructural: 61,
			multistructural: 284,
			relational: 117,
			extendedabstract: 42
		},
		{
			month: 'June',
			prestructural: 127,
			unistructural: 218,
			multistructural: 76,
			relational: 295,
			extendedabstract: 163
		}
	];

	const chartConfig = {
		prestructural: { label: 'Prestructural', color: 'var(--chart-1)' },
		unistructural: { label: 'Unistructural', color: 'var(--chart-2)' },
		multistructural: { label: 'Multistructural', color: 'var(--chart-3)' },
		relational: { label: 'Relational', color: 'var(--chart-4)' },
		extendedabstract: { label: 'Extended Abstract', color: 'var(--chart-5)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Content Mastery and Accuracy</Card.Title>
		<Card.Description>January - June 2024</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[160px] w-full">
			<BarChart
				data={chartData}
				xScale={scaleBand().padding(0.15)}
				x="month"
				axis="x"
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
						key: 'extendedabstract',
						label: 'Extended Abstract',
						color: chartConfig.extendedabstract.color
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
			<div class="grid grid-cols-2 gap-1 space-2">
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
