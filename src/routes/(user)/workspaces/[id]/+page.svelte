<script lang="ts">
	import { Spinner } from '@/lib/components/ui/spinner';
	import { Button } from '@/lib/components/ui/button';
	import Icon from 'mdi-svelte';
	import { mdiPlus, mdiCog, mdiEye } from '@mdi/js';
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import { format, isToday, isYesterday } from 'date-fns';

	let loading: boolean = $state<boolean>(true);

	const { data } = $props();
	let { notes, workspace, user } = $derived(data);

	function dayKey(dateInput: string | Date): string {
		return format(new Date(dateInput), 'yyyy-MM-dd');
	}

	function formatDayHeader(dateInput: string | Date): string {
		const date = new Date(dateInput);
		if (isToday(date)) return 'Today';
		if (isYesterday(date)) return 'Yesterday';
		return format(date, 'EEEE, d MMMM yyyy');
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

	$effect(() => {
		if (workspace) {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{workspace?.title}</title>
	<meta name="description" content={workspace?.description} />
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="pb-4 px-4">
	{#if loading}
		<div class="flex items-center justify-center size-full">
			<Spinner />
		</div>
	{:else if workspace}
		<div class="mb-4 border-b border-neutral-200 pb-2">
			<div class="block text-xs text-neutral-500">Workspace</div>
			<div class="flex w-full justify-between items-center gap-2">
				<h1 class="!mb-0 font-semibold">{workspace?.title}</h1>
				<Badge variant={workspace?.scope === 'individual' ? 'default' : 'secondary'}>
					{workspace?.scope === 'individual' ? 'Individual' : 'Group'}
				</Badge>
				<Button class="ml-auto" href={`/workspaces/editor?id=${workspace?.id}`} variant="outline">
					Edit
				</Button>
			</div>
		</div>

		<div class="w-full lg:w-3/6 text-sm whitespace-break-spaces">
			{workspace?.description ? workspace.description : 'No description given.'}
		</div>

		{#if workspace.scope === 'group'}
			<div
				class="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mt-6"
			>
				<!-- notes stat -->
				<div
					class="flex items-center justify-center flex-col h-26 w-full bg-neutral-50 rounded-lg border border-neutral-200"
				>
					<div class="mb-1 flex items-center justify-center flex-col">
						<div class="block font-semibold text-center text-xl xl:text-2xl">
							{workspace?.noteCount}
						</div>
						<div class="text-sm flex items-center gap-2">
							<span class="text-xs">Notes</span>
							{#if workspace?.countTodayNotes && workspace?.countTodayNotes > 0}
								<span class="text-xs pt-0.5 text-green-600 italic">
									({workspace.countTodayNotes} today)
								</span>
							{/if}
						</div>
					</div>
					<div class="w-full flex justify-center gap-1">
						<Button
							variant="outline"
							class="text-xs text-blue-500 flex items-center pl-1"
							size="sm"
							href={`/workspaces/${workspace?.id}/notes/editor`}
						>
							<Icon path={mdiPlus} size={0.65} />
							<span class="!text-xs">Add</span>
						</Button>
					</div>
				</div>

				<!-- materials stat -->
				<div
					class="flex items-center justify-center flex-col h-26 w-full bg-neutral-50 rounded-lg border border-neutral-200"
				>
					<div class="mb-1 flex items-center justify-center flex-col">
						<div class="block font-semibold text-center text-xl xl:text-2xl">
							{workspace?.materialCount}
						</div>
						<div class="text-sm flex items-center gap-2">
							<span class="text-xs">Learn Materials</span>
							{#if workspace?.countTodayMaterials && workspace?.countTodayMaterials > 0}
								<span class="text-xs pt-0.5 text-green-600 italic">
									({workspace.countTodayMaterials} today)
								</span>
							{/if}
						</div>
					</div>
					<div class="w-full flex justify-center gap-1">
						<Button
							variant="link"
							class="text-xs text-blue-500 flex items-center"
							size="sm"
							href={`/workspaces/${workspace?.id}/materials`}
						>
							<Icon path={mdiEye} size={0.65} />
							<span class="!text-xs">View all</span>
						</Button>
					</div>
				</div>

				<!-- members stat -->
				<div
					class="flex items-center justify-center flex-col h-26 w-full bg-neutral-50 rounded-lg border border-neutral-200"
				>
					<div class="mb-1 flex items-center justify-center flex-col">
						<div class="block font-semibold text-center text-xl xl:text-2xl">
							{workspace.memberCount}
						</div>
						<div class="text-xs">Members</div>
					</div>
					<div class="w-full flex justify-center">
						<Button
							variant="link"
							class="text-xs text-blue-500"
							size="sm"
							href={`/workspaces/${workspace?.id}/members`}
						>
							<Icon path={mdiCog} size={0.65} />
							<span class="!text-xs">Manage</span>
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<div class="mb-4 mt-8 flex items-center border-b border-neutral-200 pb-2">
			<span class="text-sm">Notes</span>

			<Button
				variant="outline"
				class="ml-auto"
				size="sm"
				href={`/workspaces/${workspace?.id}/notes`}
			>
				<span class="!text-xs">View all</span>
			</Button>
		</div>

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
											<div class="mt-4 text-xs text-neutral-500 mb-1">Attachments:</div>
											<ol class="w-full list-decimal list-inside">
												{#each item.attachments as attachment}
													<li class="text-xs">
														<a
															href={attachment.file?.mediaLink}
															target="_blank"
															rel="noreferrer"
															class="text-blue-600"
														>
															{attachment.file?.originalFilename}
														</a>
													</li>
												{/each}
											</ol>
										{/if}

										{#if item.notePapers.length > 0}
											<div class="mt-2">
												<div class="mt-4 text-xs text-neutral-500 mb-1">Related papers:</div>
												<ul class="w-full list-decimal list-inside">
													{#each item.notePapers.slice(0, 3) as notePaper}
														<li class="text-xs">
															<a
																href={notePaper.paper?.pdfUrl}
																target="_blank"
																rel="noreferrer"
																class="text-blue-600"
															>
																{notePaper.paper?.title}
															</a>
														</li>
													{/each}
												</ul>
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
	{:else}
		<div class="flex items-center justify-center size-full">Workspace not found.</div>
	{/if}
</div>
