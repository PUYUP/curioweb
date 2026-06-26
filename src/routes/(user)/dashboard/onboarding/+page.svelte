<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import Textarea from '@/lib/components/ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { enhance } from '$app/forms';
	import languages from '$lib/assets/data/ISO-639-1-language.json';
	import type { ActionData, LayoutServerData } from '../$types';

	let loading = $state(false);
	let interest = $state('');
	let selectedLanguage = $state('');

	const triggerContent = $derived(
		languages.find((f) => f.code === selectedLanguage)?.name?.split(';')?.[0] ?? 'Select languages'
	);

	let { form, data }: { form: ActionData; data: LayoutServerData } = $props();
	const profile = $derived(data ? data.profile : null);

	// form value binding
	$effect(() => {
		if (profile) {
			interest = profile.interest;
			selectedLanguage = profile.languageCode;
		}
	});
</script>

<div class="p-4 w-full md:w-12/12 lg:w-7/12 xl:w-6/12">
	<div class="block text-lg font-bold">Last step! Complete your interests.</div>
	<div class="mt-0 text-sm text-neutral-600">
		We need some information about your interests to create your personalized papers.
	</div>

	<form
		method="POST"
		action="?/updateProfile"
		use:enhance={() => {
			loading = true;
			form = null; // reset form
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="mt-4">
			<Textarea
				id="interest"
				name="interest"
				placeholder="Describe here..."
				class="min-h-24 !text-base"
				bind:value={interest}
			/>
		</div>

		<div class="mt-4">
			<div class="text-sm mb-2 text-neutral-600">Preferred language*</div>

			<Select.Root type="single" name="languageCode" required bind:value={selectedLanguage}>
				<Select.Trigger class="w-[220px]">
					{triggerContent}
				</Select.Trigger>

				<Select.Content class="w-[220px] max-h-[300px]">
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

		<div class="mt-6 flex items-center gap-4">
			<Button type="submit" class="" disabled={loading}>
				{loading ? 'Saving...' : 'Save & Continue'}
			</Button>

			{#if form?.message}
				<p style="color: red" class="text-xs">{form?.message}</p>
			{/if}
		</div>
	</form>
</div>
