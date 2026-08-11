import { db } from "$lib/server/db/index.js";
import { workspaces } from "$lib/server/db/schemas/workspace.schema.js";
import { addMember } from "@/lib/server/db/factories/workspace.factory.js";
import { fail, redirect } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";

export const load = async ({ locals, params, url }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    // limitation
    const subscription = (locals.user as any)?.subscription;
    const entityId = url.searchParams.get('id');

    if (!entityId) {
        const [result] = await db.select({ count: count() })
            .from(workspaces)
            .where(eq(workspaces.userId, locals.user.id));

        const workspaceCount = result.count;
        if (workspaceCount >= subscription.attributes.maxWorkspaces) {
            throw redirect(302, '/subscription?error=limit-exceeded');
        }

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
        const languageCode = formData.get('languageCode');
        const scope = formData.get('scope');

        if (!title || !languageCode) {
            return fail(400, {
                success: false,
                message: "Title and language code are required"
            })
        }

        try {
            const [result] = await db.insert(workspaces).values({
                title: title as string,
                description: description as string,
                languageCode: languageCode as string,
                scope: scope as string,
                userId: user.id
            }).returning();

            // make creator as first member
            await addMember({
                workspace_id: result.id,
                email_address: user.email!,
                role: 'admin'
            });

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
        const languageCode = formData.get('languageCode');
        const scope = formData.get('scope');

        if (!title || !id || !languageCode || !scope) {
            return fail(400, {
                success: false,
                message: "Title and ID and language code and scope are required"
            })
        }

        try {
            const [result] = await db.update(workspaces)
                .set({
                    title: title as string,
                    description: description as string,
                    languageCode: languageCode as string,
                    scope: scope as string,
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