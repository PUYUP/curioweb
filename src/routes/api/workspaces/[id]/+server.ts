import { db } from "@/lib/server/db";
import { workspaces } from "@/lib/server/db/schemas/workspace.schema";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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
            message: "Workspace ID is required"
        }, { status: 400 });
    }

    try {
        const deleted = await db.delete(workspaces)
            .where(eq(workspaces.id, id))
            .returning();

        if (deleted.length === 0) {
            return json({
                success: false,
                message: "Workspace not found"
            }, { status: 404 });
        }

        return json({
            success: true,
            message: "Workspace deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting workspace:", error);
        return json({
            success: false,
            message: "Failed to delete workspace"
        }, { status: 500 });
    }
}