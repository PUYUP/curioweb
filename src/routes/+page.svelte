<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import pubmed from '$lib/assets/sources/pubmed-logo.png';
	import arxiv from '$lib/assets/sources/arxiv-logo.png';
	import doaj from '$lib/assets/sources/doaj-logo.png';
	import core from '$lib/assets/sources/core-logo.png';
	import biorxiv from '$lib/assets/sources/biorxiv-logo.png';
	import PaperItem from '@/lib/components/blocks/paper-item/paper-item.svelte';
	import type { PaperSummary } from '@/lib/types/interfaces';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Icon from 'mdi-svelte';
	import { mdiBrain, mdiTrendingUp } from '@mdi/js';
	import { Textarea } from '@/lib/components/ui/textarea';
	import { AreaChart } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import { scaleUtc } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';

	import { Navbar } from '$lib/components/blocks/navbar/index.js';
	import { Footer } from '$lib/components/blocks/footer/index.js';

	// sample paper summary
	const summaries: PaperSummary[] = [
		{
			sample: true,
			pdfUrl: null,
			title: 'Bahaya Jalan Pintas di Balik Simulasi Kenaikan Air Laut',
			fieldsOfStudy: ['Computer Science'],
			abstract: `Ternyata model prediksi es mencair yang sering dipakai nyimpen *plot twist*. Sekilas, metode *shortcut* (SOSA) dan metode presisi (AD) kelihatan ngasih hasil mirip. Tapi pas dibedah matematis, metode *shortcut* ini sering meremehkan sensitivitas sistem. Efeknya, kondisi es seolah-olah terlihat jauh lebih stabil dan pasti dari realitanya.

Walau masih diuji di skenario terkontrol, ini jadi *wake-up call*. Pakai metode kalkulasi yang akurat bakal ngasih proyeksi kenaikan air laut yang lebih valid. Ini krusial banget buat kebijakan mitigasi perubahan iklim dan tata ruang wilayah pesisir biar kita nggak kebobolan di masa depan.`
		},
		{
			sample: true,
			pdfUrl: null,
			title:
				'Exact vs approximate second-order derivatives in vertically-integrated ice sheet models',
			fieldsOfStudy: ['Biomedical'],
			abstract: `Evolusi capit kepiting itu *mindblowing* banget! Ternyata banyak bentuk capit yang beda jauh tapi performanya bisa sama persis (*many-to-one mapping*). Kepiting yang beda spesies dan gak berkerabat bisa berevolusi punya capit mirip kalau tantangan habitatnya sama. Alam tuh kayak punya banyak *cheat* buat nyelesaiin satu masalah!

Nah, capit ekstrem kayak penghancur cangkang itu hasil seleksi alam yang super ketat. Peneliti ngebongkar rahasia ini pake *CT-scan 3D* dan simulasi biomekanik. Kerennya, riset ini gak cuma berguna buat biologi, tapi bisa jadi inspirasi buat desain alat biomimetik masa depan. *OP* banget kan alam kita?`
		}
	];

	const chartData = [
		{ date: new Date('2024-6-01'), desktop: 0 },
		{ date: new Date('2024-7-01'), desktop: 105 },
		{ date: new Date('2024-8-01'), desktop: 120 },
		{ date: new Date('2024-9-01'), desktop: 150 },
		{ date: new Date('2024-10-01'), desktop: 165 },
		{ date: new Date('2024-11-01'), desktop: 205 },
		{ date: new Date('2024-12-01'), desktop: 230 }
	];
	const chartConfig = {
		desktop: { label: 'Score', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;

	let api = $state<CarouselAPI>();
	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<svelte:head>
	<title>ATLANIZE - Sifting Breakthroughs, Challenging Your Curiosity</title>
	<meta
		name="description"
		content="Discover the latest research and challenge your curiosity with ATLANIZE."
	/>
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<Navbar />

<div class="max-w-5xl mx-auto px-4">
	<div class="flex items-center justify-center">
		<div class="w-full text-center py-6 pb-14 sm:py-12 md:py-24">
			<h1 class="text-4xl sm:text-6xl font-bold mb-4 sm:mb-12">
				<span class="text-[#072e5f] block mb-2"><u class="italic">Sifting</u> Breakthroughs</span>
				<span class="text-[#38b9fc] block">Challenge Your <u class="italic">Curiosity</u></span>
			</h1>

			<div class="max-w-2xl mx-auto">
				<p class="text-neutral-700 text-base sm:text-xl">
					Elevate how you learn. We distill the core ideas from the latest research into engaging
					insights. Dive deeper, expand on them, and let our AI evaluate your understanding.
				</p>
			</div>
		</div>
	</div>

	<div class="block">
		<div class="text-center text-neutral-600 mb-8 sm:mb-10">Selected sources (Open Access)</div>
		<div class="flex flex-wrap justify-center items-center gap-8 sm:gap-8 lg:gap-12">
			<div class="flex justify-center">
				<img src={pubmed} alt="Pubmed" class="h-7 sm:h-10 lg:h-12 w-auto" />
			</div>
			<div class="flex justify-center">
				<img src={arxiv} alt="Arxiv" class="h-7 sm:h-10 lg:h-12 w-auto" />
			</div>
			<div class="flex justify-center">
				<img src={doaj} alt="Doaj" class="h-7 sm:h-10 lg:h-12 w-auto" />
			</div>
			<div class="flex justify-center">
				<img src={core} alt="Core" class="h-7 sm:h-10 lg:h-12 w-auto" />
			</div>
			<div class="flex justify-center">
				<img src={biorxiv} alt="Biorxiv" class="h-7 sm:h-10 lg:h-12 w-auto" />
			</div>
		</div>
		<div class="text-center text-sm text-neutral-500 mt-4 italic">...and many more</div>
	</div>

	<div class="block py-14 pb-8 sm:py-18 sm:pb-8">
		<div class="w-full sm:w-12/12 md:w-10/12 lg:w-8/12 mx-auto">
			<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto relative">
				<div class="arrow-down absolute bottom-0 left-1/2 -translate-x-1/2"></div>
			</div>

			<Empty.Root>
				<Empty.Header class="max-w-xl">
					<div class="block">
						<Icon path={mdiBrain} size={2} />
					</div>
					<Empty.Title class="mb-2">My Preferences</Empty.Title>
					<Empty.Description
						class="text-xl leading-8 italic"
						style="font-family: Newsreader, Georgia, 'Times New Roman', Times, serif;"
					>
						"Exploring the intersection of Computer Science and Biological Sciences through
						artificial intelligence, bioinformatics, computational biology, data analysis, and
						technology-driven approaches"
					</Empty.Description>
				</Empty.Header>
				<Button variant="outline">Change</Button>
			</Empty.Root>
		</div>

		<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto"></div>

		<div class="flex gap-6">
			<Carousel.Root
				opts={{ align: 'start' }}
				setApi={(emblaApi) => (api = emblaApi)}
				class="w-full px-0 md:px-0"
			>
				<Carousel.Content>
					{#each summaries as summary, i}
						<Carousel.Item class="basis-full md:basis-1/2">
							<div class="flex flex-col relative h-full">
								<div class="block">
									{#if i % 2 === 0}
										<!-- EVEN: garis di kiri -->
										<div
											class="w-6/12 h-[1px] bg-[#38b9fc] relative"
											style="width: calc(50% + 1.5rem + 0.5px); margin-left: calc(50% - 0.5px);"
										></div>
									{:else}
										<!-- ODD: garis di kanan -->
										<div
											class="w-6/12 h-[1px] bg-[#38b9fc] relative"
											style="width: calc(50% + 0.5px); margin-right: calc(50% + 1.5rem + 0.5px);"
										></div>
									{/if}

									<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto relative">
										<div class="arrow-down absolute bottom-0 left-1/2 -translate-x-1/2"></div>
									</div>
								</div>

								<div class="flex-1 px-0.5 md:px-2 pt-4 relative">
									{#if i % 2 === 0}
										<div
											class="jargon"
											style="
												position: absolute;
												font-size: 220px;
												font-weight: 700;
												rotate: -30deg;
												top: -25px;
												z-index: 0;
												opacity: 0.08;
											"
										>
											A
										</div>
									{:else}
										<div
											class="jargon"
											style="
												position: absolute;
												font-size: 220px;
												font-weight: 700;
												rotate: 30deg;
												top: -35px;
												right: 45px;
												z-index: 0;
												opacity: 0.08;
											"
										>
											Z
										</div>
									{/if}

									<PaperItem paper={summary} sample={true} />
								</div>

								<div class="block mt-4">
									<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto relative"></div>

									{#if i % 2 === 0}
										<!-- EVEN: garis di kiri -->
										<div
											class="w-6/12 h-[1px] bg-[#38b9fc] relative"
											style="width: calc(50% + 1.5rem + 0.5px); margin-left: calc(50% - 0.5px);"
										></div>
									{:else}
										<!-- ODD: garis di kanan -->
										<div
											class="w-6/12 h-[1px] bg-[#38b9fc] relative"
											style="width: calc(50% + 0.5px); margin-right: calc(50% + 1.5rem + 0.5px);"
										></div>
									{/if}
								</div>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>

				<Carousel.Previous class="carousel-prev-button" />
				<Carousel.Next class="carousel-next-button" />
			</Carousel.Root>
		</div>

		<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto relative">
			<div class="arrow-down absolute bottom-0 left-1/2 -translate-x-1/2"></div>
		</div>

		<div class="text-muted-foreground py-2 text-center text-xs md:hidden">
			Slide {current} of {count}
		</div>

		<div class="w-full mx-auto mt-6 child-width">
			<Textarea
				placeholder="Read both papers, connect the key ideas, and expand on them using your knowledge."
				class="min-h-26 !text-base"
			/>

			<div class="flex justify-center mt-6">
				<Button size="lg">Submit & Analyze</Button>
			</div>
		</div>

		<div class="h-16 w-[1px] bg-[#38b9fc] mx-auto relative mt-8">
			<div class="arrow-down absolute bottom-0 left-1/2 -translate-x-1/2"></div>
		</div>
	</div>

	<div class="xs:!w-full mx-auto mb-16 child-width">
		<Card.Root class="!border-none !shadow-none">
			<Card.Header>
				<div class="flex w-full items-start gap-2 text-sm">
					<div class="grid gap-2">
						<div class="flex items-center gap-2 leading-none font-medium">
							Your knowledges grew by 5.2% this month <Icon path={mdiTrendingUp} />
						</div>
						<div class="text-muted-foreground flex items-center gap-2 leading-none">
							January - June 2024
						</div>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<Chart.Container config={chartConfig} class="h-[160px] w-full">
					<AreaChart
						data={chartData}
						x="date"
						xScale={scaleUtc()}
						series={[
							{
								key: 'desktop',
								label: 'Score',
								color: chartConfig.desktop.color
							}
						]}
						axis="x"
						props={{
							area: {
								curve: curveNatural,
								fillOpacity: 0.4,
								line: { class: 'stroke-1' },
								motion: 'tween'
							},
							xAxis: {
								format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' })
							}
						}}
					>
						{#snippet tooltip()}
							<Chart.Tooltip
								labelFormatter={(v: Date) => v.toLocaleDateString('en-US', { month: 'long' })}
								indicator="line"
							/>
						{/snippet}
					</AreaChart>
				</Chart.Container>
			</Card.Content>
		</Card.Root>
	</div>

	<div
		class="text-2xl md:text-3xl lg:text-3xl xl:text-3xl heading py-4 md:py-12 pb-14 md:pb-20 text-center leading-8 md:leading-12 lg:leading-12 px-2 md:px-4"
	>
		&quot;Knowledge <strong class="underline text-[#38b9fc]">isn't copied it is built</strong>. Read
		research papers, connect ideas across disciplines,
		<strong class="underline">evaluate the evidence</strong>, and write your own insights.
		<strong class="underline">We help you think, not think for you.</strong>&quot;
	</div>
</div>

<Footer />

<style>
	.arrow-down {
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 10px solid #38b9fc;
	}

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

	@media (min-width: 768px) {
		.child-width {
			width: calc(50% + 1.5rem - 10px);
		}

		:global(.carousel-prev-button),
		:global(.carousel-next-button) {
			display: none;
		}
	}

	.heading {
		font-family: newsreader, serif;
	}
</style>
