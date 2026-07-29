<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '@/lib/components/ui/button';
	import { Label } from '@/lib/components/ui/label';
	import { Textarea } from '@/lib/components/ui/textarea';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Icon from 'mdi-svelte';
	import { mdiDeleteOutline, mdiContentSaveOutline } from '@mdi/js';
	import type { PageData } from '../../$types';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	let saving: boolean = $state<boolean>(false);
	let deleting: boolean = $state<boolean>(false);

	let formValues: { content: string } = $state({
		content: ''
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		saving = true;

		return async ({ result, update }) => {
			await update();
			saving = false;

			if (result.type === 'success') {
				const workspaceId = result.data?.context?.workspaceId;
				const entityId = result?.data?.context?.id;

				if (workspaceId) {
					goto(`/workspaces/${workspaceId}/contexts/${entityId}`, {
						replaceState: true
					});
				}
			}
		};
	};

	const context = $derived(data.context);

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
		<h1>{context ? 'Edit Research Context' : 'New Research Context'}</h1>
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
			</div>
		</form>
	</div>
</div>
