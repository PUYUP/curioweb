<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';
	import { format, isToday, isYesterday } from 'date-fns';
	import { enUS as localeId } from 'date-fns/locale';

	const { data } = $props();
	let { workspace, notes, user } = $derived(data);

	console.log(notes);

	function dayKey(dateInput: string | Date): string {
		return format(new Date(dateInput), 'yyyy-MM-dd');
	}

	function formatDayHeader(dateInput: string | Date): string {
		const date = new Date(dateInput);
		if (isToday(date)) return 'Today';
		if (isYesterday(date)) return 'Yesterday';
		return format(date, 'EEEE, d MMMM yyyy', { locale: localeId });
	}

	// Kelompokkan notes berdasarkan hari. Dihitung dari `notes` milik halaman
	// saat ini saja, jadi kalau halaman 2 dimulai dari hari yang berbeda,
	// separator tanggal baru otomatis muncul di paling atas halaman itu.
	const groupedNotes = $derived.by(() => {
		const groups: { key: string; label: string; items: typeof notes }[] = [];
		const indexByKey = new Map<string, number>();

		for (const item of notes ?? []) {
			const key = dayKey(item.createdAt);
			if (!indexByKey.has(key)) {
				indexByKey.set(key, groups.length);
				groups.push({ key, label: formatDayHeader(item.createdAt), items: [] });
			}
			groups[indexByKey.get(key)!].items.push(item);
		}

		return groups;
	});

	// delete note
	const deleteHandler = async (item: any) => {
		const confirmed = confirm('Are you sure you want to delete this note?');
		if (!confirmed) {
			return;
		}

		const res = await fetch(`/api/workspaces/${workspace?.id}/notes`, {
			method: 'DELETE',
			body: JSON.stringify({
				noteId: item?.id,
				userId: item?.userId
			})
		});

		if (res.ok) {
			notes = notes.filter((note) => note.id !== item.id);
		}
	};
</script>

<svelte:head>
	<title>{workspace?.title} - Notes</title>
	<meta name="description" content={workspace?.description} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	<div class="mb-4 border-b border-neutral-200 pb-2">
		<div class="block text-xs text-neutral-500">Notes collection</div>
		<div class="flex w-full justify-between items-center gap-2">
			<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
			<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
				{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
			</Badge>
			<Button
				class="ml-auto flex items-center gap-1"
				href={`/workspaces/${workspace?.id}/notes/editor`}
			>
				<Icon path={mdiPlus} size={0.75} />
				Add Note
			</Button>
		</div>
	</div>

	{#if workspace}
		<div class="w-full xl:w-4/6">
			<div class="flex flex-col gap-6">
				{#each groupedNotes as group (group.key)}
					<div class="flex flex-col gap-3">
						<div class="flex items-center gap-3">
							<span class="text-xs font-semibold uppercase tracking-wide text-orange-600">
								{group.label}
							</span>
							<div class="h-px flex-1 border-b border-dashed border-orange-300"></div>
						</div>

						<div class="flex flex-col gap-4">
							{#each group.items as item (item.id)}
								<div class="p-3 border border-neutral-200 rounded-lg">
									<div class="flex items-center gap-2 mb-2 text-xs text-neutral-500">
										<span class="font-semibold underline">{item.user?.name}</span>
										<span class="text-neutral-400">&bull;</span>
										<span>{format(item.createdAt, 'HH:mm')}</span>
										{#if user.id === item.userId}
											<span class="text-neutral-400">&bull;</span>
											<Button
												variant="link"
												size="sm"
												class="text-blue-600 !px-1"
												href={`/workspaces/${workspace?.id}/notes/editor?id=${item?.id}`}
											>
												Edit
											</Button>
										{/if}
										{#if workspace.currentUserRole === 'admin' || user.id === item.userId}
											<span class="text-neutral-400">&bull;</span>
											<Button
												variant="link"
												size="sm"
												class="text-red-600 !px-1"
												onclick={async () => deleteHandler(item)}
											>
												Delete
											</Button>
										{/if}
									</div>
									<div class="block">
										<div class="block text-sm whitespace-break-spaces">
											{item.content}
										</div>

										{#if item.attachments.length > 0}
											<div class="mt-4 text-xs text-neutral-500">Attachments:</div>
											<div class="flex gap-2 w-full">
												{#each item.attachments as attachment}
													<div class="block text-xs">
														<a
															href={attachment.file?.mediaLink}
															target="_blank"
															rel="noreferrer"
															class="text-blue-600"
														>
															{attachment.file?.originalFilename}
														</a>
													</div>
												{/each}
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
