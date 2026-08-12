import { createFile } from "@/lib/server/db/factories/attachment.factory";
import type { NewFileRow } from "@/lib/server/db/schemas/attachment.schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body: NewFileRow = await request.json();

    try {
        const result = await createFile(body);
        return json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Failed to process file:', err);
        throw error(500, 'Failed to process file');
    }
}