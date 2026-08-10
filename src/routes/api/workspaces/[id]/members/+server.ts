import { db } from "$lib/server/db";
import { eq, and, getTableColumns, exists, sql, desc, asc } from "drizzle-orm";
import { workspaceMembers } from "$lib/server/db/schemas/workspace.schema.js";
import { json, type RequestEvent } from "@sveltejs/kit";
import { user as authUser } from "$lib/server/db/auth.schema";

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
        const res = await db.select({
            ...getTableColumns(workspaceMembers),
            user: {
                id: authUser.id,
                name: authUser.name,
                email: authUser.email,
            }
        })
            .from(workspaceMembers)
            .leftJoin(authUser, eq(workspaceMembers.userId, authUser.id))
            .where(
                and(
                    eq(workspaceMembers.workspaceId, workspaceId),
                    exists(
                        db.select({ n: sql`1` })
                            .from(workspaceMembers)
                            .where(
                                and(
                                    eq(workspaceMembers.workspaceId, workspaceId),
                                    eq(workspaceMembers.userId, user.id)
                                )
                            )
                    )
                )
            )
            .orderBy(
                asc(workspaceMembers.role),
                asc(workspaceMembers.createdAt)
            );

        if (res.length === 0) {
            return json({
                success: false,
                message: "Workspace member not found"
            }, { status: 404 });
        }

        return json({
            data: res,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching workspace members:", error);
        return json({
            success: false,
            message: "Failed to fetch workspace members"
        }, { status: 500 });
    }
}

export async function DELETE({ params, locals, request }: RequestEvent) {
    const user = locals.user;
    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const workspaceId = params.id;
    if (!workspaceId) {
        return json({
            success: false,
            message: "Workspace ID is required"
        }, { status: 400 });
    }

    const { userId } = await request.json();
    if (!userId) {
        return json({
            success: false,
            message: "User ID is required"
        }, { status: 400 });
    }

    try {
        await db.delete(workspaceMembers)
            .where(
                and(
                    eq(workspaceMembers.workspaceId, workspaceId),
                    eq(workspaceMembers.userId, userId)
                )
            );

        return json({
            success: true,
        });
    } catch (error) {
        console.error("Error removing member:", error);
        return json({
            success: false,
            message: "Failed to remove member"
        }, { status: 500 });
    }
}

export async function PATCH({ params, locals, request }: RequestEvent) {
    const user = locals.user;
    if (!user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const workspaceId = params.id;
    if (!workspaceId) {
        return json({
            success: false,
            message: "Workspace ID is required"
        }, { status: 400 });
    }

    const { userId, role } = await request.json();
    if (!userId) {
        return json({
            success: false,
            message: "User ID is required"
        }, { status: 400 });
    }

    if (!role) {
        return json({
            success: false,
            message: "Role is required"
        }, { status: 400 });
    }

    try {
        await db.update(workspaceMembers).set({
            role,
        }).where(and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ));

        return json({
            success: true,
        });
    } catch (error) {
        console.error("Error updating member:", error);
        return json({
            success: false,
            message: "Failed to update member"
        }, { status: 500 });
    }
}