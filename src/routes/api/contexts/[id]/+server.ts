import { db } from "@/lib/server/db";
import { researchContexts } from "@/lib/server/db/schemas/workspace.schema";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function PATCH({ params, locals, request }: RequestEvent) {
    const user = locals.user;
    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
        return json({
            success: false,
            message: "Context ID is required"
        }, { status: 400 });
    }

    const payload: typeof researchContexts.$inferInsert = await request.json();

    try {
        const [updated] = await db.update(researchContexts)
            .set(payload)
            .where(eq(researchContexts.id, id))
            .returning();

        if (!updated) {
            return json({
                success: false,
                message: "Context not found"
            }, { status: 404 });
        }

        return json({
            success: true,
            message: "Context updated successfully",
        });
    } catch (error) {
        console.error("Error updating context:", error);
        return json({
            success: false,
            message: "Failed to update context"
        }, { status: 500 });
    }
}

export async function DELETE({ params, locals }: RequestEvent) {
    const user = locals.user;
    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
        return json({
            success: false,
            message: "Context ID is required"
        }, { status: 400 });
    }

    try {
        const [deleted] = await db.delete(researchContexts)
            .where(eq(researchContexts.id, id))
            .returning();

        if (!deleted) {
            return json({
                success: false,
                message: "Context not found"
            }, { status: 404 });
        }

        return json({
            success: true,
            message: "Context deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting context:", error);
        return json({
            success: false,
            message: "Failed to delete context"
        }, { status: 500 });
    }
}