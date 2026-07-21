<script lang="ts">
	import { LineChart } from 'layerchart';
	import { curveLinearClosed } from 'd3-shape';
	import { scaleBand } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data }: { data: any } = $props();

	const categoryDefs = [
		{ month: 'Prestructural', key: 'prestructural' },
		{ month: 'Unistructural', key: 'unistructural' },
		{ month: 'Multistructural', key: 'multistructural' },
		{ month: 'Relational', key: 'relational' },
		{ month: 'Extended Abstract', key: 'extended_abstract' }
	];

	// Rata-rata skor per kategori dari sekumpulan hasil (results)
	function averageScore(results: any[], key: string) {
		if (!results?.length) return 0;
		const values = results.map((r) => {
			return (
				Number(
					Object.hasOwn(r?.result, 'solo') ? r?.result?.solo?.[key] : r?.result?.[`${key}_score`]
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

		return categoryDefs.map(({ month, key }) => {
			const result = {
				month,
				key,
				paper_a: averageScore(resultsA, key) || 1,
				paper_z: averageScore(resultsZ, key) || 1
			};
			return result;
		});
	});

	const chartConfig = {
		paper_a: { label: 'Paper A', color: 'var(--radar-chart-1)' },
		paper_z: { label: 'Paper Z', color: 'var(--radar-chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="h-full">
	<Card.Header class="items-center mb-4">
		<Card.Title>Structure of the Observed Learning Outcome</Card.Title>
		<Card.Description>Range score: 1 (Worst) - 10 (Best)</Card.Description>
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
