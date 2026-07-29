import { db } from "$lib/server/db/index.js";
import { workspaces } from "$lib/server/db/schemas/workspace.schema.js";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals, params, url }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const entityId = url.searchParams.get('id');

    if (!entityId) {
        return {
            workspace: null
        }
    }

    try {
        const [result] = await db.select()
            .from(workspaces)
            .where(eq(workspaces.id, entityId))
            .limit(1);

        return { workspace: result };
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return { workspace: null };
    }
};

export const actions = {
    insert: async ({ request, locals }) => {
        const user = locals.user;

        if (!user) {
            return {
                success: false,
                message: "Unauthorized"
            }
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');

        if (!title) {
            return fail(400, {
                success: false,
                message: "Title is required"
            })
        }

        try {
            const [result] = await db.insert(workspaces).values({
                title: title as string,
                description: description as string,
                userId: user.id
            }).returning()

            return {
                success: true,
                message: "Workspace created successfully",
                workspace: result
            }
        } catch (error) {
            console.error("Error creating workspace:", error);
            return fail(500, {
                success: false,
                message: "Failed to create workspace"
            })
        }
    },

    update: async ({ request, locals }) => {
        const user = locals.user;

        if (!user) {
            return {
                success: false,
                message: "Unauthorized"
            }
        }

        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');

        if (!title || !id) {
            return fail(400, {
                success: false,
                message: "Title and ID are required"
            })
        }

        try {
            const [result] = await db.update(workspaces)
                .set({
                    title: title as string,
                    description: description as string,
                    userId: user.id,
                    updatedAt: new Date(),
                })
                .where(eq(workspaces.id, id as string))
                .returning()

            return {
                success: true,
                message: "Workspace updated successfully",
                workspace: result
            }
        } catch (error) {
            console.error("Error updating workspace:", error);
            return fail(500, {
                success: false,
                message: "Failed to update workspace"
            })
        }
    }
}