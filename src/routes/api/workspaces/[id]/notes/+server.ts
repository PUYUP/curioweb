import { deleteNote, getNotes } from "@/lib/server/db/factories/workspace.factory";
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
        const notes = await getNotes(workspaceId);
        return json({
            success: true,
            data: notes
        });
    } catch (error) {
        return json({
            success: false,
            message: "Failed to fetch notes"
        }, { status: 500 });
    }
}

export async function PATCH({ params, locals, request }: RequestEvent) {
    const user = locals.user;
    const payload = await request.json();

    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    return json({
        success: true,
    }, { status: 200 });
}

export async function DELETE({ params, locals, request }: RequestEvent) {
    const user = locals.user;
    const payload = await request.json();

    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    if (!payload.noteId) {
        return json({
            success: false,
            message: "Note ID is required"
        }, { status: 400 });
    }

    try {
        await deleteNote(payload.noteId, user.id);
        return json({
            success: true,
        }, { status: 200 });
    } catch (error) {
        console.error('Delete note', error);
        return json({
            success: false,
            message: "Failed to delete note"
        }, { status: 500 });
    }
}