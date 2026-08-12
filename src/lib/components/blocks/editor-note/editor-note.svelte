<script lang="ts">
	import { enhance } from '$app/forms';
	import Textarea from '@/lib/components/ui/textarea/textarea.svelte';
	import Button from '@/lib/components/ui/button/button.svelte';
	import { authClient } from '@/lib/auth-client';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import Icon from 'mdi-svelte';
	import { mdiClose, mdiDelete, mdiDeleteOutline, mdiImage, mdiUpload } from '@mdi/js';
	import { uploadFileToGCS } from '@/lib/gcs-upload-client';
	import type { FileMetadata, UploadProgress } from '@/lib/types/upload';
	import type {
		FilePayload,
		NewAttachmentRow,
		NewFileRow
	} from '@/lib/server/db/schemas/attachment.schema';
	import Spinner from '@/lib/components/ui/spinner/spinner.svelte';

	const { workspace, note } = $props();
	let user = $state<any | null>(null);
	let content = $state<string>('');
	let saveLoading = $state<boolean>(false);

	$effect(() => {
		(async () => {
			const { data: session } = await authClient.getSession();
			if (session) {
				user = session.user;
			}
		})();

		if (note) {
			content = note.content;
			if (note.attachments.length > 0) {
				fileResults = note.attachments.map((item: any) => {
					return {
						...item.file,
						attachmentId: item.id
					};
				});
			}
		}
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		return async ({ result, update }) => {
			saveLoading = true;

			switch (result.type) {
				case 'success':
					await update({ reset: false });
					goto(`/workspaces/${workspace?.id}/notes`, { replaceState: true });

					// save attachments
					if (fileResults.filter((file) => !(file as any)?.attachmentId).length > 0) {
						// update entity id with note id
						const attachments = fileResults.map((file) => ({
							fileId: file.id,
							userId: user?.id,
							entityId: result?.data?.id,
							entityType: 'workspace_notes'
						}));

						await fetch('/api/files/attachments', {
							method: 'POST',
							body: JSON.stringify({ attachments: attachments })
						});
					}

					// delete attachments
					if (deletedAttachmentIds.length > 0) {
						await fetch('/api/files/attachments', {
							method: 'DELETE',
							body: JSON.stringify({ ids: deletedAttachmentIds })
						});
					}
					break;
				case 'error':
					cancel();
					break;
				default:
					break;
			}

			saveLoading = false;
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

	// upload handler
	// svelte-ignore non_reactive_update
	let fileInputElement: HTMLInputElement;
	let progress = $state(0);
	let status = $state<'idle' | 'uploading' | 'done' | 'error'>('idle');
	let metadata = $state<FileMetadata | null>(null);
	let errorMsg = $state('');
	let fileResults = $state<NewFileRow[]>([]);
	let deletedAttachmentIds = $state<string[]>([]);

	function triggerFileSelect() {
		fileInputElement.click();
	}

	function getFileTypePure(mimeType: string) {
		if (!mimeType) return 'unknown';

		const [mainType, subType] = mimeType.split('/');

		// Return kategori utama jika berupa gambar/audio/video
		if (['image', 'audio', 'video'].includes(mainType)) {
			return mainType;
		}

		// Bersihkan karakter tambahan seperti '; charset=utf-8' jika ada
		return subType ? subType.split(';')[0] : 'unknown';
	}

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		status = 'uploading';
		progress = 0;
		errorMsg = '';
		metadata = null;

		try {
			const result = await uploadFileToGCS(
				file,
				{
					onProgress: (p: UploadProgress) => {
						progress = p.percentage; // 45, 65, 100, dst.
					}
				},
				{
					workspaceId: workspace?.id,
					noteId: note?.id
				}
			);

			metadata = result;

			if (user) {
				// save the file
				const filePayload: NewFileRow = {
					userId: user.id,
					disk: 'gcs/atlafiles', // <storage_platform>/<bucket_name>
					fileType: getFileTypePure(file.type), // actually only use like 'image', 'pdf', 'audio', etc not an mime_type such as image/png
					mimeType: metadata.contentType,
					originalFilename: file.name,
					sizeBytes: metadata.size,
					createdAt: metadata.timeCreated,
					updatedAt: metadata.updated,
					checksumSha256: metadata.md5Hash,
					path: metadata.name,
					mediaLink: metadata.mediaLink
				};

				const fileResult = await fetch('/api/files', {
					method: 'POST',
					body: JSON.stringify(filePayload)
				});
				const data = await fileResult.json();

				if (data.success) {
					fileResults.push(data.data);
				}
			}

			status = 'done';
		} catch (err) {
			status = 'error';
			errorMsg = err instanceof Error ? err.message : 'Upload gagal';
		}
	}

	function removeFile(fileId: string, attachmentId?: string) {
		fileResults = fileResults.filter((f) => f.id !== fileId);
		if (attachmentId) {
			deletedAttachmentIds.push(attachmentId);
		}
	}
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
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<Button
							size="icon"
							variant="outline"
							type="button"
							onclick={triggerFileSelect}
							disabled={status === 'uploading'}
						>
							{#if status === 'uploading'}
								<Spinner />
							{:else}
								<Icon path={mdiUpload} size={0.75} />
							{/if}
						</Button>

						<input bind:this={fileInputElement} onchange={handleFileSelect} type="file" hidden />
						<span class="text-xs text-neutral-500">
							{#if status === 'uploading'}
								Uploading... {progress}%
							{:else}
								Accepts Audio, PDF, and Image
							{/if}
						</span>
					</div>
				</div>
				<div class="ml-auto flex items-center gap-3">
					{#if note}
						<Button type="button" variant="link" class="text-red-500" onclick={handleDelete}>
							Delete
						</Button>
					{/if}

					<Button type="submit" disabled={saveLoading || status === 'uploading'}>
						{saveLoading ? 'Saving...' : note ? 'Update' : 'Save'}
					</Button>
				</div>
			</div>

			{#if fileResults.length > 0}
				<div class="flex gap-2 flex-col mt-4">
					{#each fileResults as file}
						<div class="flex items-center text-sm gap-3">
							<Button
								type="button"
								variant="outline"
								size="icon"
								class="text-red-600"
								onclick={() => (file.id ? removeFile(file.id, (file as any)?.attachmentId) : '')}
							>
								<Icon path={mdiClose} size={0.65} />
							</Button>
							<a
								href={file.mediaLink}
								target="_blank"
								class="text-blue-600"
								rel="noopener noreferrer"
							>
								{file.originalFilename}
							</a>
						</div>
					{/each}
				</div>
			{/if}

			{#if status === 'error'}
				<p class="text-xs text-red-600">{errorMsg}</p>
			{/if}
		</form>

		<!-- <div class="upload-box">
			{#if status === 'uploading'}
				<div class="progress-track">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
				<p>{progress}%</p>
			{/if}

			{#if status === 'done' && metadata}
				<div class="metadata">
					<p>✅ Upload selesai</p>
					<ul>
						<li>Nama file: {metadata.name}</li>
						<li>Ukuran: {(metadata.size / 1024).toFixed(2)} KB</li>
						<li>Tipe: {metadata.contentType}</li>
						<li>Dibuat: {metadata.timeCreated}</li>
					</ul>
				</div>
			{/if}

			{#if status === 'error'}
				<p class="error">{errorMsg}</p>
			{/if}
		</div> -->
	{/if}
</div>
