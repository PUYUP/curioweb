import { db } from "@/lib/server/db";
import { researchContexts, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { redirect } from "@sveltejs/kit";
import { eq, getTableColumns } from "drizzle-orm";

export const load = async ({ locals, params, url }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    let workspace: any = null;
    const workspaceId = params.id;
    const entityId = url.searchParams.get('id');

    try {
        const [workspaceResult] = await db.select({
            ...getTableColumns(workspaces),
        })
            .from(workspaces)
            .where(eq(workspaces.id, workspaceId))
            .limit(1);
        if (!workspaceResult) {
            return redirect(302, '/workspaces');
        }
        workspace = workspaceResult;
    } catch (error) {
        return redirect(302, '/workspaces');
    }

    if (!entityId) {
        return {
            context: null,
            workspace: workspace
        }
    }

    try {
        const [result] = await db.select({
            ...getTableColumns(researchContexts),
            workspace: workspaces
        })
            .from(researchContexts)
            .leftJoin(workspaces, eq(researchContexts.workspaceId, workspaces.id))
            .where(eq(researchContexts.id, entityId))
            .limit(1);

        return { context: result };
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return { context: null };
    }
};

export const actions = {
    insert: async ({ request, locals, params }) => {
        const user = locals.user;
        if (!user) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }

        const formData = await request.formData();
        const content = formData.get('content')?.toString() || '';
        const languageCode = formData.get('languageCode')?.toString() || '';
        const workspaceId = params.id;

        if (!content) {
            return {
                success: false,
                message: "Content is required"
            };
        }

        if (!workspaceId) {
            return {
                success: false,
                message: "Workspace ID is required"
            };
        }

        try {
            const [context] = await db.insert(researchContexts)
                .values({
                    content: content,
                    userId: user.id,
                    workspaceId: workspaceId,
                    languageCode: languageCode,
                })
                .returning();

            return {
                success: true,
                context
            };
        } catch (error) {
            console.error("Error creating context:", error);
            return {
                success: false,
                message: "Failed to create context"
            };
        }
    },

    update: async ({ request, locals }) => {
        const user = locals.user;
        if (!user) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }

        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const content = formData.get('content')?.toString() || '';
        const languageCode = formData.get('languageCode')?.toString() || '';

        if (!id) {
            return {
                success: false,
                message: "Context ID is required"
            };
        }

        if (!content) {
            return {
                success: false,
                message: "Content is required"
            };
        }

        try {
            const [context] = await db.update(researchContexts)
                .set({
                    content: content,
                    languageCode: languageCode,
                    updatedAt: new Date(),
                })
                .where(eq(researchContexts.id, id))
                .returning();

            return {
                success: true,
                context
            };
        } catch (error) {
            console.error("Error updating context:", error);
            return {
                success: false,
                message: "Failed to update context"
            };
        }
    }
};