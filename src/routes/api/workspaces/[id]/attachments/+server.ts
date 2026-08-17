import { getAttachmentsByEntity } from "@/lib/server/db/factories/attachment.factory";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ params, locals }: RequestEvent) {
    const user = locals.user;
    const workspaceId = params.id;

    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    if (!workspaceId) {
        return json({
            success: false,
            message: "Workspace ID is required"
        }, { status: 400 });
    }

    try {
        const attachments = await getAttachmentsByEntity('learning_material', workspaceId);
        return json({
            success: true,
            data: attachments
        });
    } catch (error) {
        return json({
            success: false,
            message: "Failed to fetch notes"
        }, { status: 500 });
    }
}
