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
	import { Badge } from '@/lib/components/ui/badge';
	import { onDestroy } from 'svelte';

	let { code } = page.params;
	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let saving = $state<boolean>(false);
	let textValue = $state<string>('');
	let width = $state<number>(0);
	let height = $state<number>(0);
	let orientation = $derived(width > 1280 ? 'vertical' : 'horizontal') as 'vertical' | 'horizontal';
	let drawerOpen = $state<boolean>(false);

	// --- Auto-draft state ---
	let draftTimer: ReturnType<typeof setTimeout> | undefined;
	let draftStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let lastSavedValue = $state<string>('');
	const DRAFT_DEBOUNCE_MS = 1500;

	$effect(() => {
		if (sharedState.summary && sharedState.summary.length > 0) {
			drawerOpen = true;
		}

		if (data.answer) {
			textValue = data.answer.content || '';
		}
	});

	function handleDrawerOpenChange(open: boolean) {
		drawerOpen = open;
		if (!open) {
			// Bersihkan summary begitu drawer ditutup (tombol close, overlay, swipe, atau Escape)
			sharedState.summary = null;
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
					<Carousel.Root opts={{ align: 'start' }} orientation={'horizontal'} class="w-full">
						<Carousel.Content>
							{#each data.challenge.challenge_papers as challenge, i}
								<Carousel.Item class="basis-full lg:basis-1/2">
									<div class="flex flex-col relative h-full">
										<div class="flex-1 px-0.5 py-1">
											<PaperItem paper={{ ...challenge.paper }} {challenge} sample={false} />
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
				<form
					method="post"
					action="?/submit"
					class="flex flex-col relative h-full"
					use:enhance={() => {
						if (draftTimer) clearTimeout(draftTimer); // batalkan draft pending saat submit manual
						form = null;
						saving = true;
						return async ({ update }) => {
							await update();
							saving = false;
							lastSavedValue = textValue;
							draftStatus = 'idle';
						};
					}}
				>
					<!-- Wrapper relative untuk textarea + button -->
					<div class="relative flex-1 min-h-0">
						<Textarea
							placeholder="Read both papers, connect the key ideas, and expand on them using your knowledge."
							class="h-full w-full !text-base"
							bind:value={textValue}
							oninput={handleInput}
							name="content"
						/>
					</div>

					<!-- Button absolute di dalam textarea, tidak kena scroll -->
					<div class="relative mt-auto py-4">
						<!-- {#if form?.message}
							<p style="color: red" class="text-xs mb-2">{form?.message}</p>
						{/if} -->

						<div class="flex justify-between items-center">
							<Button type="submit" size="lg" disabled={saving}>
								{#if saving}
									Saving...
								{:else}
									Submit & Analyze
								{/if}
							</Button>
							<div class="ml-auto flex flex-row items-center gap-2 text-xs text-neutral-500">
								{#if data.answer && data.answer.status == 'draft'}
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
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-yellow-300 bg-yellow-200">1. Background</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['background']}</p>
						</div>
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-blue-300 bg-blue-200">2. Methods</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['methods']}</p>
						</div>
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-green-300 bg-green-200">3. Results</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['results']}</p>
						</div>
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-teal-300 bg-teal-200">4. Conclusion</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['conclusions']}</p>
						</div>
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-red-300 bg-red-200">5. Limitations</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['limitations']}</p>
						</div>
						<div class="flex flex-col mb-6">
							<p class="text-base font-semibold mb-2 underline">
								<span class="border-b-3 border-purple-300 bg-purple-200">6. Future Work</span>
							</p>
							<p class="text-base text-neutral-800 leading-6">{item['future_works']}</p>
						</div>
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
