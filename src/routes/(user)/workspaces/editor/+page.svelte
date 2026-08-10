<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '@/lib/components/ui/button';
	import { Label } from '@/lib/components/ui/label';
	import { Textarea } from '@/lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import type { PageData } from '../[id]/$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Icon from 'mdi-svelte';
	import { mdiDeleteOutline, mdiContentSaveOutline } from '@mdi/js';
	import languages from '$lib/assets/data/ISO-639-1-language.json';

	const { data } = $props() as { data: PageData };

	let saving: boolean = $state<boolean>(false);
	let deleting: boolean = $state<boolean>(false);
	let selectedLanguage = $state('en');
	let scope = $state('individual');

	let formValues: {
		title: string;
		description: string;
		languageCode: string;
		scope: string;
	} = $state({
		title: '',
		description: '',
		languageCode: 'en',
		scope: 'individual'
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		saving = true;

		return async ({ result, update }) => {
			await update();

			saving = false;

			if (result.type === 'success') {
				const entityId = result.data?.workspace?.id;
				if (entityId) {
					goto(`/workspaces/${entityId}`, {
						replaceState: true
					});
				}
			}
		};
	};

	const workspace = $derived(data.workspace);

	$effect(() => {
		if (workspace) {
			formValues.title = workspace.title || '';
			formValues.description = workspace.description || '';
			formValues.languageCode = workspace.languageCode || '';
			selectedLanguage = workspace.languageCode || 'en';
			scope = workspace.scope || 'individual';
		}
	});

	async function handleDelete() {
		if (confirm('Are you sure you want to delete this workspace?')) {
			deleting = true;
			const response = await fetch(`/api/workspaces/${workspace?.id}`, {
				method: 'DELETE'
			});
			if (response.ok) {
				deleting = false;
				goto('/workspaces');
			}
		}
	}

	const triggerContent = $derived(
		languages.find((f) => f.code === selectedLanguage)?.name?.split(';')?.[0] ?? 'Select languages'
	);
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
		<h1>{workspace ? 'Edit Workspace' : 'New Workspace'}</h1>
		{#if workspace}
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
		<form method="post" action={workspace ? '?/update' : '?/insert'} use:enhance={handleSubmit}>
			<div class="mb-4">
				<Label for="title" class="mb-2">Name*</Label>
				<Input
					type="text"
					id="title"
					name="title"
					bind:value={formValues.title}
					placeholder="Workspace name"
					required
				/>
			</div>

			<div class="mb-4">
				<Label for="languageCode" class="mb-2">Preferred language*</Label>

				<Select.Root type="single" name="languageCode" required bind:value={selectedLanguage}>
					<Select.Trigger class="w-full">
						{triggerContent}
					</Select.Trigger>

					<Select.Content class="w-full max-h-[300px]">
						<Select.Group>
							<Select.Label>Languages</Select.Label>
							{#each languages as language (language.code)}
								<Select.Item value={language.code} label={language.name.split(';')?.[0]}>
									{language.name.split(';')?.[0]}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="mb-4">
				<Label for="scope" class="mb-2">Scope*</Label>
				<RadioGroup.Root name="scope" bind:value={scope}>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="individual" id="individual" />
						<Label for="individual">Individual</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="group" id="group" />
						<Label for="group">Group</Label>
					</div>
				</RadioGroup.Root>
			</div>

			<div class="mb-4">
				<Label for="description" class="mb-2">Description</Label>
				<Textarea
					id="description"
					name="description"
					bind:value={formValues.description}
					placeholder="Workspace description"
				/>
			</div>

			{#if workspace}
				<input type="hidden" name="id" value={workspace.id} />
			{/if}

			<div class="flex justify-start">
				<Button type="submit" disabled={saving || deleting}>
					{#if saving}
						Saving...
					{:else}
						<Icon path={mdiContentSaveOutline} size="1rem" />
						{#if workspace}
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
