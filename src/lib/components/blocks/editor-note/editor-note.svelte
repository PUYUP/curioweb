<script lang="ts">
	import { enhance } from '$app/forms';
	import Textarea from '@/lib/components/ui/textarea/textarea.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { authClient } from '@/lib/auth-client';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	const { workspace, note } = $props();
	let user = $state<any | null>(null);
	let content = $state<string>('');

	$effect(() => {
		(async () => {
			const { data: session } = await authClient.getSession();
			if (session) {
				user = session.user;
			}
		})();

		if (note) {
			content = note.content;
		}
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					await update();
					goto(`/workspaces/${workspace?.id}/notes`, { replaceState: true });
					break;
				case 'error':
					break;
			}
		};
	};
</script>

<div class="block">
	{#if user}
		<form use:enhance={handleSubmit} method="POST" action={note ? `?/updateNote` : `?/addNote`}>
			<Textarea
				name="content"
				class="!text-base"
				required
				placeholder="Write your note here..."
				bind:value={content}
			/>
			<input type="hidden" value={workspace?.id} name="workspace_id" />
			<input type="hidden" value={user?.id} name="user_id" />
			<input type="hidden" value={note?.id} name="note_id" />
			<div class="flex mt-6">
				<Button type="submit">{note ? 'Update' : 'Save'}</Button>
			</div>
		</form>
	{/if}
</div>
