<script lang="ts">
	import { LineChart } from 'layerchart';
	import { scalePoint } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const chartData = [
		{
			month: 'January',
			line_1: 42,
			line_2: 158,
			line_3: 89,
			line_4: 201
		},
		{
			month: 'February',
			line_1: 175,
			line_2: 93,
			line_3: 312,
			line_4: 45
		},
		{
			month: 'March',
			line_1: 261,
			line_2: 34,
			line_3: 147,
			line_4: 189
		},
		{
			month: 'April',
			line_1: 88,
			line_2: 276,
			line_3: 53,
			line_4: 134
		},
		{
			month: 'May',
			line_1: 193,
			line_2: 61,
			line_3: 284,
			line_4: 117
		},
		{
			month: 'June',
			line_1: 127,
			line_2: 218,
			line_3: 76,
			line_4: 295
		}
	];

	const chartConfig = {
		line_1: { label: 'Content Mastery and Accuracy', color: 'var(--chart-1)' },
		line_2: { label: 'Critical Thinking and Analysis', color: 'var(--chart-2)' },
		line_3: { label: 'Logical Flow of Arguments', color: 'var(--chart-3)' },
		line_4: { label: 'Academic Language and Writing Mechanics', color: 'var(--chart-4)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Evaluation Criteria</Card.Title>
		<Card.Description>Understand your strengths and areas for improvement.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[160px] w-full">
			<LineChart
				data={chartData}
				xScale={scalePoint().padding(0)}
				x="month"
				axis="x"
				series={[
					{
						key: 'line_1',
						label: '',
						color: chartConfig.line_1.color
					},
					{
						key: 'line_2',
						label: '',
						color: chartConfig.line_2.color
					},
					{
						key: 'line_3',
						label: '',
						color: chartConfig.line_3.color
					},
					{
						key: 'line_4',
						label: '',
						color: chartConfig.line_4.color
					}
				]}
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
			></LineChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="mt-auto">
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
