<script lang="ts">
	import Icon from 'mdi-svelte';
	import { mdiFilePdfBox } from '@mdi/js';

	const { item } = $props();
	let lineClamp = $state(3);
</script>

{#if item}
	<li class="text-sm mb-4">
		<div class="mb-2">
			<a
				href={item?.paper?.pdfUrl}
				target="_blank"
				class="flex w-full justify-between text-base font-semibold"
			>
				<span class="flex-1 text-blue-600 text-sm">
					{item?.paper?.title}
				</span>
				<span class="ml-auto text-red-600">
					<Icon path={mdiFilePdfBox} size={0.85} />
				</span>
			</a>

			<div class="mt-0 flex gap-2 items-center text-sm">
				<span class="text-orange-500">Similarity Score:</span>
				<span class="text-orange-600 font-bold underline">
					{(item?.similarityScore * 100).toFixed(1)}%
				</span>
				<span class="text-xs">({item?.similarityScore})</span>
			</div>
		</div>

		<button
			type="button"
			class="block cursor-pointer"
			onclick={() => {
				lineClamp == 3 ? (lineClamp = 100) : (lineClamp = 3);
			}}
		>
			<div class="text-neutral-700 text-left line-clamp-{lineClamp}">
				{item?.documentContent}
			</div>
		</button>
	</li>
{/if}
