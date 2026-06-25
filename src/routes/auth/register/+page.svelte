<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Input } from '@/lib/components/ui/input';
	import { Button } from '@/lib/components/ui/button';
	import { Textarea } from '@/lib/components/ui/textarea';

	let { form }: { form: ActionData } = $props();
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
		<form method="post" action="?/signUpEmail" use:enhance>
			<Field.Group>
				<Field.Set>
					<Field.Legend class="!text-lg">Create an Account</Field.Legend>
					<Field.Description>
						Start your new learning journey of discovery with Curiosift.
					</Field.Description>
					<Field.Group class="mt-4">
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
					<div class="grid grid-cols-2 gap-4">
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
					</div>
				</Field.Set>
				<Field.Separator />
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label for="interests">What you interested in*</Field.Label>
							<Textarea
								id="interests"
								name="interests"
								placeholder="Tell us, we'll use it to recommend papers for you"
								class="resize-none"
							/>
						</Field.Field>
					</Field.Group>
				</Field.Set>
				<Field.Field orientation="horizontal" class="justify-end mt-2">
					<p style="color: red" class="text-sm">{form?.message ?? ''}</p>
					<Button type="submit">Submit</Button>
				</Field.Field>
			</Field.Group>
		</form>
	</div>
</div>
