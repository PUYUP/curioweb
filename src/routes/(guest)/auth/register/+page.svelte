<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Input } from '@/lib/components/ui/input';
	import { Button } from '@/lib/components/ui/button';
	import { Textarea } from '@/lib/components/ui/textarea';
	import { signInWithGoogle } from '@/lib/auth-client';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ChevronRightIcon, GoogleIcon } from '@hugeicons/core-free-icons';
	import Separator from '@/lib/components/ui/separator/separator.svelte';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Curiosift - Register</title>
	<meta name="description" content="Register to your CurioSift account" />
	<meta
		name="keywords"
		content="register,Curiosift,research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="CurioSift" />
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-8 md:py-16">
	<div class="w-full max-w-md">
		<form
			method="post"
			action="?/signUpEmail"
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
					<Field.Legend class="!text-lg">Create an Account</Field.Legend>
					<Field.Description>
						Start your new learning journey of discovery with Curiosift.
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

					<Field.Group class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field.Field>
							<Field.Label for="name">Full Name*</Field.Label>
							<Input id="name" name="name" placeholder="John Doe" required />
						</Field.Field>
						<Field.Field>
							<Field.Label for="email">Email Address*</Field.Label>
							<Input id="email" name="email" type="email" placeholder="my@email.com" required />
						</Field.Field>
					</Field.Group>
					<Field.Separator />
					<Field.Group class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field.Field>
							<Field.Label for="password">Password*</Field.Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								required
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label for="repeat-password">Repeat Password*</Field.Label>
							<Input
								id="repeat-password"
								name="repeat-password"
								type="password"
								placeholder="Repeat password"
								required
							/>
						</Field.Field>
					</Field.Group>
				</Field.Set>
				<Field.Separator />
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label for="interest">What you interested in*</Field.Label>
							<Textarea
								id="interest"
								name="interest"
								placeholder="Tell us, we'll use it to recommend papers for you"
								class="resize-none"
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
