<script lang="ts">
	import Badge from '@/lib/components/ui/badge/badge.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import Icon from 'mdi-svelte';
	import { mdiPlus } from '@mdi/js';
	import { format, isToday, isYesterday } from 'date-fns';
	import { id as localeId } from 'date-fns/locale';

	const { data } = $props();
	const { workspace, notes, user } = $derived(data);

	function dayKey(dateInput: string | Date): string {
		return format(new Date(dateInput), 'yyyy-MM-dd');
	}

	function formatDayHeader(dateInput: string | Date): string {
		const date = new Date(dateInput);
		if (isToday(date)) return 'Hari ini';
		if (isYesterday(date)) return 'Kemarin';
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
							<div class="h-px flex-1 bg-neutral-200"></div>
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
												class="text-blue-600"
												href={`/workspaces/${workspace?.id}/notes/editor?id=${item?.id}`}
											>
												Edit
											</Button>
										{/if}
									</div>
									<div class="block text-sm whitespace-break-spaces">{item.content}</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
