import { db } from "@/lib/server/db";
import { researchContexts, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { countWords, MAX_CONTENT_WORDS, MIN_CONTENT_WORDS } from "@/lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { count, eq, getTableColumns } from "drizzle-orm";

export const load = async ({ locals, params, url }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    // limitation
    const subscription = (locals.user as any)?.subscription;
    const entityId = url.searchParams.get('id');

    if (!entityId) {
        const [result] = await db.select({ count: count() })
            .from(researchContexts)
            .where(eq(researchContexts.workspaceId, params.id));
        const contextCount = result.count;

        if (contextCount >= subscription.attributes.maxOfContextsPerWorkspace) {
            throw redirect(302, '/subscription?error=limit-exceeded');
        }

        return {
            context: null,
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
    submit: async ({ request, locals, params }) => {
        const user = locals.user;
        if (!user) {
            return fail(401, {
                success: false,
                message: "Unauthorized"
            });
        }

        const formData = await request.formData();
        const content = formData.get('content')?.toString() || '';
        const languageCode = formData.get('languageCode')?.toString() || '';
        const workspaceId = params.id;

        if (!content) {
            return fail(400, {
                success: false,
                message: "Content is required"
            });
        }

        const wordCount = countWords(content);
        if (wordCount < MIN_CONTENT_WORDS || wordCount > MAX_CONTENT_WORDS) {
            return fail(400, {
                success: false,
                message: `Content must be between ${MIN_CONTENT_WORDS} and ${MAX_CONTENT_WORDS} words (currently ${wordCount})`
            });
        }

        if (!workspaceId) {
            return fail(400, {
                success: false,
                message: "Workspace ID is required"
            });
        }

        try {
            const [context] = await db.insert(researchContexts)
                .values({
                    content: content,
                    userId: user.id,
                    workspaceId: workspaceId,
                    languageCode: languageCode,
                    status: 'retrieved',
                    submittedAt: new Date(),
                })
                .returning();

            return {
                success: true,
                context
            };
        } catch (error) {
            console.error("Error creating context:", error);
            return fail(500, {
                success: false,
                message: "Failed to create context"
            });
        }
    },

    draft: async ({ request, params, locals }) => {
        const user = locals.user;
        if (!user) {
            return fail(401, {
                success: false,
                message: "Unauthorized"
            });
        }

        const formData = await request.formData();
        const content = formData.get('content')?.toString() || '';
        const languageCode = formData.get('languageCode')?.toString() || '';
        const workspaceId = params.id;

        if (!content) {
            return fail(400, {
                success: false,
                message: "Content is required"
            });
        }

        const wordCount = countWords(content);
        if (wordCount < MIN_CONTENT_WORDS || wordCount > MAX_CONTENT_WORDS) {
            return fail(400, {
                success: false,
                message: `Content must be between ${MIN_CONTENT_WORDS} and ${MAX_CONTENT_WORDS} words (currently ${wordCount})`
            });
        }

        if (!workspaceId) {
            return fail(400, {
                success: false,
                message: "Workspace ID is required"
            });
        }

        try {
            const [context] = await db.insert(researchContexts)
                .values({
                    content: content,
                    userId: user.id,
                    workspaceId: workspaceId,
                    languageCode: languageCode,
                    status: 'draft',
                })
                .returning();

            return {
                success: true,
                context
            };
        } catch (error) {
            console.error("Error creating context:", error);
            return fail(500, {
                success: false,
                message: "Failed to create context"
            });
        }
    },

    update: async ({ request, locals }) => {
        const user = locals.user;
        if (!user) {
            return fail(401, {
                success: false,
                message: "Unauthorized"
            });
        }

        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const content = formData.get('content')?.toString() || '';
        const languageCode = formData.get('languageCode')?.toString() || '';

        if (!id) {
            return fail(400, {
                success: false,
                message: "Context ID is required"
            });
        }

        if (!content) {
            return fail(400, {
                success: false,
                message: "Content is required"
            });
        }

        const wordCount = countWords(content);
        if (wordCount < MIN_CONTENT_WORDS || wordCount > MAX_CONTENT_WORDS) {
            return fail(400, {
                success: false,
                message: `Content must be between ${MIN_CONTENT_WORDS} and ${MAX_CONTENT_WORDS} words (currently ${wordCount})`
            });
        }

        try {
            const [context] = await db.update(researchContexts)
                .set({
                    content: content,
                    languageCode: languageCode,
                    status: 'retrieved',
                    submittedAt: new Date(),
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
            return fail(500, {
                success: false,
                message: "Failed to update context"
            });
        }
    }
};