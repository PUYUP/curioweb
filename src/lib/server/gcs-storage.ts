// src/lib/server/gcs-storage.ts
// File ini HANYA boleh diimport dari kode server (+server.ts / +page.server.ts),
// karena berisi credentials. SvelteKit otomatis melindungi folder $lib/server
// dari ter-bundle ke client.

import { Storage } from '@google-cloud/storage';
import { env } from '$env/dynamic/private';

if (!env.GCS_BUCKET_NAME) {
	throw new Error('Env GCS_BUCKET_NAME belum di-set');
}

// Opsi 1: pakai Application Default Credentials (ADC)
// - Di Cloud Run / GKE / Compute Engine, ini otomatis pakai service account bawaan.
// - Di lokal, jalankan `gcloud auth application-default login` dulu.
//
// Opsi 2: pakai key file (JSON service account) secara eksplisit,
// lebih gampang kalau butuh signed URL tanpa akses IAM signBlob (lihat README).
export const storage = new Storage({
	projectId: env.GOOGLE_CLOUD_PROJECT,
	...(env.GCP_KEY_FILE ? { keyFilename: env.GCP_KEY_FILE } : {})
});

export const bucket = storage.bucket(env.GCS_BUCKET_NAME);
