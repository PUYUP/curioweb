<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '@/lib/components/ui/button';
	import { Label } from '@/lib/components/ui/label';
	import { Textarea } from '@/lib/components/ui/textarea';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Icon from 'mdi-svelte';
	import { mdiDeleteOutline, mdiContentSaveOutline, mdiAlertCircleOutline } from '@mdi/js';
	import type { PageServerData } from './$types';
	import { countWords, MIN_CONTENT_WORDS } from '@/lib/utils';

	const { data }: { data: PageServerData } = $props();
	const { workspace, context } = $derived(data);

	let saving: boolean = $state<boolean>(false);
	let deleting: boolean = $state<boolean>(false);
	let errorMessage: string | null = $state<string | null>(null);

	let formValues: { content: string } = $state({
		content: ''
	});

	const handleSubmit: SubmitFunction = () => {
		saving = true;
		errorMessage = null;

		return async ({ result, update }) => {
			saving = false;

			if (result.type === 'success') {
				await update();

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

			await update();
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

		<form method="post" action={context ? '?/update' : '?/insert'} use:enhance={handleSubmit}>
			<div class="mb-4">
				<Label for="content" class="mb-2">Content*</Label>
				<Textarea
					id="content"
					name="content"
					bind:value={formValues.content}
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
				<Button type="submit" disabled={saving || deleting}>
					{#if saving}
						Saving...
					{:else}
						<Icon path={mdiContentSaveOutline} size="1rem" />
						{#if context}
							Update
						{:else}
							Save
						{/if}
					{/if}
				</Button>

				<div class="ml-auto flex items-center gap-2 text-xs">
					<div
						class={countWords(formValues.content) >= MIN_CONTENT_WORDS
							? 'text-green-600'
							: 'text-red-600'}
					>
						{countWords(formValues.content)} / {MIN_CONTENT_WORDS}
						words
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
