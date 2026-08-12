// Kenapa perlu endpoint terpisah? Karena setelah client PUT langsung ke GCS,
// respons dari GCS tidak mengembalikan metadata lengkap (size pasti ada di
// header, tapi field lain seperti md5Hash/crc32c lebih gampang & konsisten
// diambil lewat Storage API di server, sekalian validasi file benar-benar ada).

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FileMetadata } from '@/lib/types/upload';
import { bucket } from '@/lib/server/gcs-storage';

export const POST: RequestHandler = async ({ request }) => {
	const { objectPath } = await request.json();

	if (!objectPath || typeof objectPath !== 'string') {
		throw error(400, 'objectPath wajib diisi');
	}

	// Validasi sederhana supaya endpoint ini tidak dipakai untuk baca path bebas
	if (!objectPath.startsWith('uploads/')) {
		throw error(400, 'objectPath tidak valid');
	}

	const file = bucket.file(objectPath);

	try {
		const [exists] = await file.exists();
		if (!exists) {
			throw error(404, 'File tidak ditemukan di bucket — upload mungkin belum selesai atau gagal');
		}

		const [metadata] = await file.getMetadata();

		const result: FileMetadata = {
			name: metadata.name ?? objectPath,
			bucket: metadata.bucket ?? '',
			size: Number(metadata.size ?? 0),
			contentType: metadata.contentType ?? 'application/octet-stream',
			md5Hash: metadata.md5Hash,
			crc32c: metadata.crc32c,
			etag: metadata.etag,
			timeCreated: metadata.timeCreated ?? '',
			updated: metadata.updated ?? '',
			mediaLink: metadata.mediaLink
		};

		return json(result);
	} catch (err) {
		console.error('Gagal mengambil metadata:', err);
		throw error(500, 'Gagal mengambil metadata file');
	}
};
