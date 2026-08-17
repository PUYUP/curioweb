<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { format } from 'date-fns';
	import Icon from 'mdi-svelte';
	import { mdiEye, mdiFilePdfBox } from '@mdi/js';

	const { data } = $props();
	let { workspace, material } = $derived(data);

	console.log(material);

	let iframeEl: HTMLIFrameElement | undefined = $state();
	let iframeHeight = $state(0);

	function handleIframeLoad() {
		const doc = iframeEl?.contentWindow?.document;
		if (!doc) return;

		// Reset margin & matikan scroll di dalam document iframe,
		// supaya scrollHeight yang dihitung akurat & tidak ada scrollbar internal
		const style = doc.createElement('style');
		style.textContent = `
			html, body {
				margin: 0;
				padding: 0;
				overflow: hidden !important;
			}
		`;
		doc.head?.appendChild(style);

		iframeHeight = Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement?.scrollHeight ?? 0);
	}
</script>

<svelte:head>
	<title>{workspace?.title} | Learning Materials</title>
	<meta name="description" content={`Learning materials of ${workspace?.title}`} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if workspace}
		<div class="mb-4 border-b border-neutral-200 pb-2">
			<div class="block text-xs text-neutral-500 mb-1">Read learning material</div>
			<div class="flex w-full justify-between items-center gap-2">
				<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
				<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
					{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
				</Badge>
			</div>
		</div>

		<div class="block mt-4">
			{#if material?.attachments && material.attachments.length > 0}
				<a
					href={material.attachments[0].file.mediaLink}
					target="_blank"
					class="text-blue-600 hover:underline flex items-center gap-2"
				>
					<Icon path={mdiFilePdfBox} size={1} />
					Download PDF
				</a>
			{/if}

			<iframe
				bind:this={iframeEl}
				srcdoc={material?.content || ''}
				title="Learning material content"
				sandbox="allow-same-origin"
				scrolling="no"
				class="w-full border-0 overflow-hidden"
				style="height: {iframeHeight}px"
				onload={handleIframeLoad}
			></iframe>
		</div>
	{/if}
</div>
