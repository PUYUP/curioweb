import { createAttachments, deleteAttachments } from "@/lib/server/db/factories/attachment.factory";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const { attachments } = await request.json();

    try {
        const result = await createAttachments(attachments);
        return json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Failed to process attachment:', err);
        throw error(500, 'Failed to process attachment');
    }
}

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw error(400, 'Invalid attachment ids');
        }

        const result = await deleteAttachments(ids);
        return json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Failed to delete attachment:', err);
        throw error(500, 'Failed to delete attachment');
    }
}
