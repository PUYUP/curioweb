import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { randomUUID } from 'node:crypto';
import type { SignedUrlRequest, SignedUrlResponse } from '@/lib/types/upload';
import { bucket } from '@/lib/server/gcs-storage';

// Sesuaikan dengan kebutuhan aplikasi kamu
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'application/pdf',
	'video/mp4'
];
const SIGNED_URL_EXPIRY_MS = 15 * 60 * 1000; // 15 menit

export const POST: RequestHandler = async ({ request, locals }) => {
	const body: SignedUrlRequest = await request.json();
	const { fileName, contentType, fileSize, entityMetadata } = body;

	if (!fileName || !contentType) {
		throw error(400, 'fileName dan contentType wajib diisi');
	}

	if (!ALLOWED_MIME_TYPES.includes(contentType)) {
		throw error(400, `Tipe file tidak diizinkan: ${contentType}`);
	}

	if (fileSize && fileSize > MAX_FILE_SIZE) {
		throw error(400, `Ukuran file melebihi batas maksimum ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	// TODO: cek locals.user di sini kalau endpoint ini perlu autentikasi,
	// supaya tidak sembarang orang bisa generate signed URL ke bucket kamu.
	// if (!locals.user) throw error(401, 'Unauthorized');

	// Buat path unik supaya tidak bentrok antar upload, dan supaya nama file
	// asli dari user tidak dipakai langsung sebagai path (path traversal, dsb).
	const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
	let baseFolder = '';
	if (entityMetadata) {
		const { workspaceId, noteId } = entityMetadata;
		if (workspaceId) baseFolder = `workspaces/${workspaceId}/`;
		if (noteId) baseFolder = `workspaces/${workspaceId}/notes/${noteId}/`;
	}
	const objectPath = `uploads/${baseFolder}${Date.now()}-${randomUUID()}${ext ? `.${ext}` : ''}`;

	const file = bucket.file(objectPath);
	const expiresAt = Date.now() + SIGNED_URL_EXPIRY_MS;

	try {
		const [signedUrl] = await file.getSignedUrl({
			version: 'v4',
			action: 'write',
			expires: expiresAt,
			// PENTING: contentType di sini harus SAMA PERSIS dengan header
			// Content-Type yang dikirim client saat PUT ke signed URL ini,
			// kalau tidak GCS akan menolak request dengan 403.
			contentType
		});

		const response: SignedUrlResponse = {
			signedUrl,
			objectPath,
			expiresAt: new Date(expiresAt).toISOString()
		};

		return json(response);
	} catch (err) {
		console.error('Gagal membuat signed URL:', err);
		throw error(500, 'Gagal membuat signed URL');
	}
};
