import { addNote, getNoteById, updateNote } from "@/lib/server/db/factories/workspace.factory";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    const noteId = url.searchParams.get('id');

    if (noteId) {
        const note = await getNoteById(noteId);
        return { note };
    }

    return {};
}

export const actions = {
    addNote: async ({ request, locals }) => {
        const formData = await request.formData();
        const content = formData.get('content')?.toString() || '';
        const workspaceId = formData.get('workspace_id')?.toString() || '';
        const userId = formData.get('user_id')?.toString() || '';

        if (!content) {
            return fail(400, {
                success: false,
                message: 'Content is required'
            });
        }

        if (!workspaceId) {
            return fail(400, {
                success: false,
                message: 'Workspace ID is required'
            });
        }

        if (!userId) {
            return fail(400, {
                success: false,
                message: 'User ID is required'
            });
        }

        try {
            await addNote({
                workspace_id: workspaceId,
                content: content,
                user_id: userId
            });

            return {
                success: true,
                message: 'Note added successfully'
            };
        } catch (error) {
            console.error('Error adding note:', error);
            return fail(500, {
                success: false,
                message: 'Failed to add note'
            });
        }
    },
    updateNote: async ({ request, locals }) => {
        try {
            const formData = await request.formData();
            const content = formData.get('content')?.toString() || '';
            const noteId = formData.get('note_id')?.toString() || '';

            if (!content) {
                return fail(400, {
                    success: false,
                    message: 'Content is required'
                });
            }

            if (!noteId) {
                return fail(400, {
                    success: false,
                    message: 'Note ID is required'
                });
            }

            await updateNote(noteId, {
                content: content
            });

            return {
                success: true,
                message: 'Note updated successfully'
            };
        } catch (error) {
            console.error('Error update note:', error);
            return fail(500, {
                success: false,
                message: 'Failed to update note'
            });
        }
    }
};