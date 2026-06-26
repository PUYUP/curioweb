<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Input } from '@/lib/components/ui/input';
	import { Button } from '@/lib/components/ui/button';
	import { signInWithGoogle } from '@/lib/auth-client';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ChevronRightIcon, GoogleIcon } from '@hugeicons/core-free-icons';
	import { Separator } from '@/lib/components/ui/separator';

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

					<button onclick={signInWithGoogle} type="button" class="cursor-pointer">
						<Item.Root variant="outline" size="sm">
							<Item.Media>
								<HugeiconsIcon icon={GoogleIcon} class="size-5" />
							</Item.Media>
							<Item.Content>
								<Item.Title>Continue with Google</Item.Title>
							</Item.Content>
							<Item.Actions>
								<HugeiconsIcon icon={ChevronRightIcon} class="size-4" />
							</Item.Actions>
						</Item.Root>
					</button>

					<div class="flex items-center gap-2">
						<Separator class="flex-1" />
						<p>or</p>
						<Separator class="flex-1" />
					</div>

					<Field.Group>
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
				<Field.Field orientation="horizontal" class="justify-between mt-2 items-center">
					<Button type="submit" disabled={loading}>
						{loading ? 'Submitting...' : 'Submit'}
					</Button>

					{#if form?.message}
						<p style="color: red" class="text-xs">{form?.message}</p>
					{/if}
				</Field.Field>
			</Field.Group>
		</form>
	</div>
</div>
