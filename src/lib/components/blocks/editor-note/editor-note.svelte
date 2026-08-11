<script lang="ts">
	import { enhance } from '$app/forms';
	import Textarea from '@/lib/components/ui/textarea/textarea.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { authClient } from '@/lib/auth-client';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import Separator from '@/lib/components/ui/separator/separator.svelte';
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

	const handleDelete = async () => {
		const confirmed = confirm('Are you sure you want to delete this note?');
		if (!confirmed) {
			return;
		}

		const res = await fetch(`/api/workspaces/${workspace?.id}/notes`, {
			method: 'DELETE',
			body: JSON.stringify({
				noteId: note?.id,
				userId: user?.id
			})
		});

		if (res.ok) {
			goto(`/workspaces/${workspace?.id}/notes`, { replaceState: true });
		}
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
			<div class="flex mt-6 gap-6">
				<Button type="submit">{note ? 'Update' : 'Save'}</Button>
				{#if note}
					<Separator orientation="vertical" />
					<Button class="ml-auto" type="button" variant="destructive" onclick={handleDelete}>
						Delete
					</Button>
				{/if}
			</div>
		</form>
	{/if}
</div>
