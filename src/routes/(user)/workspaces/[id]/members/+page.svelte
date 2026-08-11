<script lang="ts">
	import Button, { buttonVariants } from '@/lib/components/ui/button/button.svelte';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Badge } from '@/lib/components/ui/badge';
	import { Label } from '@/lib/components/ui/label/index.js';
	import { Input } from '@/lib/components/ui/input/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { authClient } from '@/lib/auth-client';
	import type { ActionData } from './$types';
	import Icon from 'mdi-svelte';
	import { mdiDeleteOutline, mdiLogout } from '@mdi/js';

	let { data, form }: { data: any; form: ActionData } = $props();
	let { workspaceId, members: membersResult, workspace } = $derived(data);
	let user = $state<any>(null);

	// add member flow
	let submitting = $state<boolean>(false);
	let addMemberOpen = $state<boolean>(false);
	let role = $state<string>('member');
	let email = $state<string>('');
	let errorMessage = $state<string>('');
	let selectedMember = $state<any>(null);

	const submitHandler: SubmitFunction = ({ cancel }) => {
		submitting = true;

		return async ({ update, result }) => {
			submitting = false;

			switch (result.type) {
				case 'success':
					addMemberOpen = false;
					await update({ reset: true });
					break;
				case 'failure':
					errorMessage = result.data?.message ?? 'An error occurred. Please try again.';
					await update({ reset: false });
					break;
			}
		};
	};

	// tools
	const deleteMembership = async (member: any) => {
		const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
			method: 'DELETE',
			body: JSON.stringify({ userId: member.userId })
		});

		const data = await res.json();
		if (!data.success) {
			errorMessage = data.message ?? 'Failed to remove member';
		} else {
			membersResult = {
				...membersResult,
				data: membersResult.data.filter((m: any) => m.userId !== member.userId)
			};
		}
	};

	const removeMember = async (member: any) => {
		if (!confirm(`Remove ${member.user.name} from workspace?`)) return;
		deleteMembership(member);
	};

	const leaveWorkspace = async (member: any) => {
		if (!confirm(`Are you sure you want to leave ${workspace?.title} workspace?`)) return;
		deleteMembership(member);
	};

	const changeRole = async (member: any) => {
		selectedMember = member;
		addMemberOpen = true;
		email = member.user.email;
		role = member.role;
	};

	$effect(() => {
		(async () => {
			const { data: session } = await authClient.getSession();
			user = session?.user ?? null;
		})();

		if (!addMemberOpen) {
			form = null;
			email = '';
			role = 'member';
			errorMessage = '';
			submitting = false;
			selectedMember = null;
		}
	});
</script>

<svelte:head>
	<title>{workspace?.title} | Members</title>
	<meta name="description" content={`Members of ${workspace?.title}`} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if workspace && user}
		<div class="mb-4 border-b border-neutral-200 pb-2">
			<div class="block text-xs text-neutral-500">Members &bull; {workspace.memberCount}</div>
			<div class="flex w-full justify-between items-center gap-2">
				<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
				<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
					{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
				</Badge>
				{#if workspace?.currentUserRole === 'admin'}
					<Button class="ml-auto" onclick={() => (addMemberOpen = true)}>Add Member</Button>
				{/if}
			</div>
		</div>

		<div class="flex w-full gap-4 flex-col">
			{#each membersResult.data as member}
				<Item.Root variant="outline">
					<Item.Content class="gap-0">
						<Item.Title>
							{member.user.name}
							{#if member.role === 'admin'}
								<Badge variant="secondary">{member.role}</Badge>
							{/if}
						</Item.Title>
						<Item.Description>{member.user.email}</Item.Description>
					</Item.Content>
					{#if member.user.id !== workspace?.userId}
						<Item.Actions>
							{#if member.user.id === user?.id}
								<Button
									class="w-20"
									variant="destructive"
									onclick={async () => await leaveWorkspace(member)}
								>
									<Icon path={mdiLogout} size={0.75} />
									Leave
								</Button>
							{:else if member.user.id !== workspace?.userId}
								{#if workspace?.currentUserRole === 'admin'}
									<Button variant="outline" onclick={async () => await changeRole(member)}>
										Change role
									</Button>

									<Button
										class="w-20"
										variant="destructive"
										onclick={async () => await removeMember(member)}
									>
										<Icon path={mdiDeleteOutline} size={0.75} />
										Remove
									</Button>
								{/if}
							{/if}
						</Item.Actions>
					{/if}
				</Item.Root>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center items-center p-6">
			<Spinner />
		</div>
	{/if}
</div>

<Dialog.Root bind:open={addMemberOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			method="POST"
			action={selectedMember ? '?/updateMember' : '?/addMember'}
			use:enhance={submitHandler}
		>
			<Dialog.Header class="mb-4">
				<Dialog.Title>{selectedMember ? 'Update member role' : 'Add Member'}</Dialog.Title>
				<Dialog.Description>
					{selectedMember
						? 'Update the role of this member'
						: 'Invite others to this workspace by email, or copy invitation link to share with them.'}
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="email_address">Email address</Label>
					<Input
						id="email_address"
						name="email_address"
						required
						type="email"
						bind:value={email}
						{...selectedMember ? { disabled: true } : {}}
					/>
				</div>
				<div class="grid gap-3">
					<Label for="role">Role</Label>
					<RadioGroup.Root name="role" bind:value={role} required>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="member" id="member" />
							<Label for="member">Member</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="admin" id="admin" />
							<Label for="admin">Admin</Label>
						</div>
					</RadioGroup.Root>
				</div>

				<input type="hidden" name="workspace_id" value={workspaceId} />
				<input type="hidden" name="user_id" value={selectedMember?.userId} />
			</div>
			<Dialog.Footer class="pt-4 flex flex-row items-center">
				{#if errorMessage != ''}
					<p class="text-red-600">{errorMessage}</p>
				{/if}
				<div class="flex gap-2">
					<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
						Cancel
					</Dialog.Close>
					<Button type="submit" disabled={submitting}>
						{#if submitting}
							Saving...
						{:else}
							Save
						{/if}
					</Button>
				</div>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
