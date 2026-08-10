import { addMember, updateMember, type WorkspaceRole } from "@/lib/server/db/factories/workspace.factory.js";
import { fail, redirect } from "@sveltejs/kit";
import { DrizzleQueryError } from "drizzle-orm/errors";

export const load = async ({ params, locals, fetch }) => {
    if (!locals.user) {
        redirect(302, '/auth/login');
    }

    const workspaceId = params.id;
    const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        // avoid crashing the page if the API call fails
        console.error(`Failed to load members: ${res.status}`);
    }

    return {
        workspaceId,
        members: await res.json()
    };
};

// actions
export const actions = {
    addMember: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email_address')?.toString() || '';
        const role = formData.get('role')?.toString() || 'member';
        const workspaceId = formData.get('workspace_id')?.toString() || '';

        if (!email) {
            return {
                success: false,
                message: "Email is required"
            };
        }

        if (!workspaceId) {
            return {
                success: false,
                message: "Workspace ID is required"
            };
        }

        try {
            await addMember({
                workspace_id: workspaceId,
                email_address: email,
                role: role as WorkspaceRole,
            });

            return {
                success: true,
                message: "Member added successfully"
            };
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if ((error.cause as Error)?.message.includes("unique constraint")) {
                    return fail(409, {
                        success: false,
                        message: "User already a member"
                    });
                }
            }

            if (error instanceof Error && error.message === "User not found") {
                return fail(404, {
                    success: false,
                    message: "No user found with that email address"
                });
            }

            console.error("Error adding member:", error);
            return fail(500, {
                success: false,
                message: (error as Error).message
            });
        }
    },
    updateMember: async ({ request, locals }) => {
        const formData = await request.formData();
        const userId = formData.get('user_id')?.toString() || '';
        const role = formData.get('role')?.toString() || 'member';
        const workspaceId = formData.get('workspace_id')?.toString() || '';

        if (!userId) {
            return {
                success: false,
                message: "User ID is required"
            };
        }

        if (!workspaceId) {
            return {
                success: false,
                message: "Workspace ID is required"
            };
        }

        try {
            await updateMember(workspaceId, userId, {
                role: role as WorkspaceRole,
            });

            return {
                success: true,
                message: "Member updated successfully"
            };
        } catch (error) {
            console.error("Error updating member role:", error);
            return {
                success: false,
                message: "Failed to update member role"
            };
        }
    },
}