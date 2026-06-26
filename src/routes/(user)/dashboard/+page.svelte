<script lang="ts">
	import * as Card from '@/lib/components/ui/card/index.js';
	import type { LayoutServerData } from './$types';
	import { Button } from '@/lib/components/ui/button';
	import languages from '@/lib/assets/data/ISO-639-1-language.json';

	let { data }: { data: LayoutServerData } = $props();
	const profile = $derived(data ? data.profile : null);
	const language = $derived(languages.find((l) => l.code === profile?.languageCode)?.name);
</script>

<svelte:head>
	<title>{data.user.name} - Dashboard</title>
</svelte:head>

<div class="flex flex-col p-4 w-full md:max-w-xl">
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex justify-between items-center">
				<div class="flex flex-col gap-1">
					<span class="font-semibold">Your Interests</span>
					<span class="text-xs text-neutral-600">Prefered language: {language}</span>
				</div>

				<Button variant="outline" href="/dashboard/onboarding" size="sm">Change</Button>
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<p class="interest-content text-lg">{profile?.interest || 'No interests added'}</p>
		</Card.Content>
	</Card.Root>
</div>

<style>
	.interest-content {
		font-family: Newsreader, sans-serif;
	}
</style>
