<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Input } from '@/lib/components/ui/input';
	import { Button } from '@/lib/components/ui/button';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Curiosift - Login</title>
	<meta name="description" content="Login to your CurioSift account" />
	<meta
		name="keywords"
		content="login,Curiosift,research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="CurioSift" />
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-8 md:py-24">
	<div class="w-full max-w-md">
		<form
			method="post"
			action="?/signInEmail"
			use:enhance={() => {
				loading = true;
				form = null; // reset form
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<Field.Group>
				<Field.Set>
					<Field.Legend class="!text-lg">Welcome back!</Field.Legend>
					<Field.Description>
						Continue your learning journey of discovery with Curiosift.
					</Field.Description>
					<Field.Group class="mt-4">
						<Field.Field>
							<Field.Label for="email">Email Address</Field.Label>
							<Input id="email" name="email" type="email" placeholder="my@email.com" required />
						</Field.Field>

						<Field.Field>
							<Field.Label for="password">Password</Field.Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								required
							/>
						</Field.Field>
					</Field.Group>
				</Field.Set>
				{#if form?.message}
					<p style="color: red" class="text-xs mt-2">{form?.message}</p>
				{/if}
				<Field.Field orientation="horizontal" class="justify-start mt-2">
					<Button type="submit" disabled={loading}>
						{loading ? 'Submitting...' : 'Submit'}
					</Button>
				</Field.Field>
			</Field.Group>
		</form>
	</div>
</div>
