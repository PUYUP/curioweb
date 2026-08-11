import { addNote } from "@/lib/server/db/factories/workspace.factory";
import { fail } from "@sveltejs/kit";

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
    }
};