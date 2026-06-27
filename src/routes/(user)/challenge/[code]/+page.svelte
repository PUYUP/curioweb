<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { PageServerData } from './$types';
	import type { PaperSummary } from '@/lib/types/interfaces';
	import { Textarea } from '@/lib/components/ui/textarea';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { PaperItem } from '@/lib/components/blocks/paper-item';

	let { data }: { data: PageServerData } = $props();

	// sample paper summary
	const summaries: PaperSummary[] = [
		{
			sample: true,
			title: 'Bahaya Jalan Pintas di Balik Simulasi Kenaikan Air Laut',
			categories: ['Computer Science'],
			sources: [
				{
					url: 'https://example.com',
					title:
						'Germination capacity of pistachio (Pistacia vera L.) seeds related to genotypic variation and phytochemical contents'
				},
				{
					url: 'https://example.com',
					title:
						'Performance and Interpretability of Convolutional, Transformer, and Hybrid Deep Learning Models in Colorectal Histology Classification'
				}
			],
			content: `Ternyata model prediksi es mencair yang sering dipakai nyimpen *plot twist*. Sekilas, metode *shortcut* (SOSA) dan metode presisi (AD) kelihatan ngasih hasil mirip. Tapi pas dibedah matematis, metode *shortcut* ini sering meremehkan sensitivitas sistem. Efeknya, kondisi es seolah-olah terlihat jauh lebih stabil dan pasti dari realitanya.

Walau masih diuji di skenario terkontrol, ini jadi *wake-up call*. Pakai metode kalkulasi yang akurat bakal ngasih proyeksi kenaikan air laut yang lebih valid. Ini krusial banget buat kebijakan mitigasi perubahan iklim dan tata ruang wilayah pesisir biar kita nggak kebobolan di masa depan.`
		},
		{
			sample: true,
			title:
				'Exact vs approximate second-order derivatives in vertically-integrated ice sheet models',
			categories: ['Biomedical'],
			sources: [
				{
					url: 'https://example.com',
					title: 'JEDEL: Zero-Shot DNA-Encoded Library Design for Early-Stage Drug Discovery'
				},
				{
					url: 'https://example.com',
					title:
						'Identifying structural design principles shaping the computational abilities of recurrent neural networks'
				}
			],
			content: `Evolusi capit kepiting itu *mindblowing* banget! Ternyata banyak bentuk capit yang beda jauh tapi performanya bisa sama persis (*many-to-one mapping*). Kepiting yang beda spesies dan gak berkerabat bisa berevolusi punya capit mirip kalau tantangan habitatnya sama. Alam tuh kayak punya banyak *cheat* buat nyelesaiin satu masalah!

Nah, capit ekstrem kayak penghancur cangkang itu hasil seleksi alam yang super ketat. Peneliti ngebongkar rahasia ini pake *CT-scan 3D* dan simulasi biomekanik. Kerennya, riset ini gak cuma berguna buat biologi, tapi bisa jadi inspirasi buat desain alat biomimetik masa depan. *OP* banget kan alam kita?`
		}
	];

	let textValue = $state('');
	let width = $state(0);
	let height = $state(0);
	let orientation = $derived(width > 1280 ? 'vertical' : 'horizontal') as 'vertical' | 'horizontal';

	function handleInput() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
	}
</script>

<!-- Bind the window dimensions directly -->
<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="mx-auto w-full pt-0 md:pt-0 lg:py-0 px-4">
	<table class="mb-2">
		<tbody>
			<tr class="flex gap-4 py-0.5">
				<td class="text-sm flex-none w-14">Code</td>
				<td class="text-sm font-semibold">: RE-149592</td>
			</tr>

			<tr class="flex gap-4 py-0.5">
				<td class="text-sm flex-none w-14">Status</td>
				<td class="text-sm font-semibold">: In Progress</td>
			</tr>
		</tbody>
	</table>

	<div class="grid grid-cols-1 xl:grid-cols-1 gap-6">
		<div class="flex gap-6">
			{#key orientation}
				<Carousel.Root opts={{ align: 'start' }} orientation={'horizontal'} class="w-full">
					<Carousel.Content>
						{#each summaries as summary, i}
							<Carousel.Item class="basis-full lg:basis-1/2">
								<div class="flex flex-col relative h-full">
									<div class="flex-1 px-0.5 py-1">
										<PaperItem paper={summary} sample={true} />
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

		<div class="w-full py-1">
			<div class="flex flex-col relative h-full">
				<!-- Wrapper relative untuk textarea + button -->
				<div class="relative flex-1 min-h-0">
					<Textarea
						placeholder="Read both papers, connect the key ideas, and expand on them using your knowledge."
						class="h-full w-full !text-base"
						bind:value={textValue}
						oninput={handleInput}
					/>
				</div>

				<!-- Button absolute di dalam textarea, tidak kena scroll -->
				<div class="relative mt-auto py-4 flex justify-between items-center">
					<Button size="lg">Submit & Analyze</Button>
					<div class="ml-auto text-xs text-neutral-500 flex flex-col">
						<p>Characters: {textValue.length}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

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

	@media (min-width: 1024px) {
		:global(.carousel-prev-button),
		:global(.carousel-next-button) {
			display: none;
		}
	}
</style>
