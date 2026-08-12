import { createAttachments } from "@/lib/server/db/factories/attachment.factory";
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