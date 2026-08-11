<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '@/lib/components/ui/button';
	import { Label } from '@/lib/components/ui/label';
	import { Textarea } from '@/lib/components/ui/textarea';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Icon from 'mdi-svelte';
	import { mdiDeleteOutline, mdiContentSaveOutline, mdiAlertCircleOutline } from '@mdi/js';
	import { countWords, MAX_CONTENT_WORDS, MIN_CONTENT_WORDS } from '@/lib/utils';

	const { data } = $props();
	const { workspace, context } = $derived(data);

	let saving: boolean = $state<boolean>(false);
	let deleting: boolean = $state<boolean>(false);
	let errorMessage: string | null = $state<string | null>(null);

	let formValues: { content: string } = $state({
		content: ''
	});

	// --- Auto-draft state ---
	let currentId = $state<string | null>(null);
	let draftTimer: ReturnType<typeof setTimeout> | undefined;
	let draftStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let lastSavedValue = $state<string>('');
	const DRAFT_DEBOUNCE_MS = 1500;

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		if (draftTimer) clearTimeout(draftTimer); // batalkan draft pending saat submit manual

		// Display the standard browser modal
		const confirmed = confirm('Are you sure you want to submit this context?');

		// Halt submission if they choose cancel
		if (!confirmed) {
			cancel();
			return;
		}

		saving = true;
		errorMessage = null;

		return async ({ result, update }) => {
			saving = false;

			if (result.type === 'success') {
				await update({ reset: false });

				const workspaceId = result.data?.context?.workspaceId;
				const entityId = result?.data?.context?.id;

				if (workspaceId) {
					goto(`/workspaces/${workspaceId}/contexts/${entityId}`, {
						replaceState: true
					});
				}
				return;
			}

			if (result.type === 'failure') {
				errorMessage = (result.data?.message as string) || 'Failed to save research context';
				return;
			}

			if (result.type === 'error') {
				errorMessage = result.error?.message || 'Something went wrong';
				return;
			}

			await update({ reset: false });
		};
	};

	$effect(() => {
		if (context) {
			formValues.content = context.content || '';
		}
	});

	async function handleDelete() {
		if (confirm('Are you sure you want to delete this research context?')) {
			deleting = true;
			const response = await fetch(`/api/contexts/${context?.id}`, {
				method: 'DELETE'
			});
			if (response.ok) {
				deleting = false;
				goto(`/workspaces/${context?.workspaceId}`);
			} else {
				deleting = false;
				errorMessage = 'Failed to delete research context';
			}
		}
	}

	function handleInput() {
		draftStatus = 'idle';
		scheduleDraftSave();
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
		if (formValues.content === lastSavedValue) return;
		if (formValues.content.trim().length === 0) return;

		draftStatus = 'saving';

		try {
			const formData = new FormData();
			formData.set('content', formValues.content);

			const payload = {
				...Object.fromEntries(formData.entries()),
				workspaceId: workspace?.id || context?.workspaceId,
				languageCode: workspace?.languageCode || context?.languageCode || 'en',
				status: 'draft',
				submittedAt: null
			};

			const response = await fetch(`/api/contexts/${context ? context.id : 'save-draft'}`, {
				method: context ? 'PATCH' : 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				draftStatus = 'error';
				return;
			}

			const result = await response.json();
			await applyAction(result);

			lastSavedValue = formValues.content;
			draftStatus = 'saved';
			currentId = result?.id as string;

			if (!context) {
				await goto(`/workspaces/${workspace?.id}/contexts/editor?id=${currentId}`, {
					replaceState: true,
					noScroll: true,
					keepFocus: true,
					invalidateAll: false
				});
			}
		} catch (e) {
			console.error('Auto-draft gagal:', e);
			draftStatus = 'error';
		}
	}
</script>

<svelte:head>
	<title>ATLANIZE - Create new workspace</title>
	<meta
		name="description"
		content="Create a new workspace to organize your research and projects."
	/>
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	<div class="mb-4 flex items-center border-b border-neutral-200 pb-2">
		<div class="block">
			<div class="block text-xs text-neutral-500">
				{context?.workspace?.title || workspace?.title}
			</div>
			<h1>{context ? 'Edit Research Context' : 'New Research Context'}</h1>
		</div>
		{#if context}
			<Button
				type="button"
				class="ml-auto text-red-600"
				variant="link"
				disabled={saving || deleting}
				onclick={handleDelete}
			>
				<Icon path={mdiDeleteOutline} size="1rem" />
				Delete
			</Button>
		{/if}
	</div>

	<div class="w-full xl:w-3/7">
		{#if errorMessage}
			<div
				class="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
				role="alert"
			>
				<Icon path={mdiAlertCircleOutline} size="1rem" class="shrink-0" />
				{errorMessage}
			</div>
		{/if}

		<form method="post" action={context ? '?/update' : '?/submit'} use:enhance={handleSubmit}>
			<div class="mb-4">
				<Label for="content" class="mb-2">Content*</Label>
				<Textarea
					id="content"
					name="content"
					bind:value={formValues.content}
					oninput={handleInput}
					placeholder="Research context content"
					class="!text-sm"
					required
				/>
			</div>

			{#if context}
				<input type="hidden" name="id" value={context.id} />
			{/if}

			<input type="hidden" name="languageCode" value={workspace?.languageCode || 'en'} />

			<div class="flex justify-start">
				<Button
					type="submit"
					disabled={saving ||
						deleting ||
						countWords(formValues.content) < MIN_CONTENT_WORDS ||
						countWords(formValues.content) > MAX_CONTENT_WORDS}
				>
					{#if saving}
						Submitting...
					{:else}
						<Icon path={mdiContentSaveOutline} size="1rem" />
						{#if context}
							Submit
						{:else}
							Save
						{/if}
					{/if}
				</Button>

				<div class="ml-auto">
					<div class="flex items-center gap-2 text-xs">
						<div
							class={countWords(formValues.content) >= MIN_CONTENT_WORDS &&
							countWords(formValues.content) <= MAX_CONTENT_WORDS
								? 'text-green-600'
								: 'text-red-600'}
						>
							{countWords(formValues.content)} / {MIN_CONTENT_WORDS}
						</div>

						<div>max {MAX_CONTENT_WORDS} words</div>
					</div>

					<div class="flex flex-row items-center gap-2 text-xs text-neutral-500">
						{#if draftStatus === 'saving'}
							<span>saving draft...</span>
						{:else if draftStatus === 'saved'}
							<span class="text-green-600">draft saved</span>
						{:else if draftStatus === 'error'}
							<span class="text-red-500">failed to save draft</span>
						{:else if context?.status === 'draft'}
							<span class="text-neutral-600">draft</span>
						{/if}
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
