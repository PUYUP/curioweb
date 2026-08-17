import { db } from "@/lib/server/db";
import { workspaceMembers, workspaceNotes, workspaces } from "@/lib/server/db/schemas/workspace.schema";
import { json } from "@sveltejs/kit";
import { count, desc, eq, getTableColumns, inArray, or, and, sql } from "drizzle-orm";
import type { RequestEvent } from "./$types";
import { alias } from "drizzle-orm/pg-core";
import { learningMaterials } from "@/lib/server/db/schemas/material.schema";

export const GET = async ({ locals }: RequestEvent) => {
    if (!locals.user) {
        return json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const userId = locals.user.id;
    const memberWorkspaceIds = db
        .select({ workspaceId: workspaceMembers.workspaceId })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.userId, userId));

    // sub-query builder
    const currentUserMembership = alias(workspaceMembers, "current_user_membership");
    const memberCountSubquery = db
        .select({
            workspaceId: workspaceMembers.workspaceId,
            memberCount: count(workspaceMembers.id).as('member_count'),
        })
        .from(workspaceMembers)
        .groupBy(workspaceMembers.workspaceId)
        .as('member_count_sq');

    const noteCountSubquery = db
        .select({
            workspaceId: workspaceNotes.workspaceId,
            noteCount: count(workspaceNotes.id).as('note_count'),
        })
        .from(workspaceNotes)
        .groupBy(workspaceNotes.workspaceId)
        .as('note_count_sq');

    const countTodayNotesSubquery = db
        .select({
            workspaceId: workspaceNotes.workspaceId,
            countTodayNotes: sql<number>`count(${workspaceNotes.id})`.as('count_today_notes'),
        })
        .from(workspaceNotes)
        .where(sql`${workspaceNotes.createdAt}::date = CURRENT_DATE`)
        .groupBy(workspaceNotes.workspaceId)
        .as('count_today_notes');

    const materialCountSubquery = db
        .select({
            workspaceId: learningMaterials.workspaceId,
            materialCount: count(learningMaterials.id).as('material_count'),
        })
        .from(learningMaterials)
        .groupBy(learningMaterials.workspaceId)
        .as('material_count_sq');

    const countTodayMaterialsSubquery = db
        .select({
            workspaceId: learningMaterials.workspaceId,
            countTodayMaterials: sql<number>`count(${learningMaterials.id})`.as('count_today_materials'),
        })
        .from(learningMaterials)
        .where(sql`${learningMaterials.createdAt}::date = CURRENT_DATE`)
        .groupBy(learningMaterials.workspaceId)
        .as('count_today_materials');

    const workspaceResults = await db.select({
        ...getTableColumns(workspaces),
        memberCount: sql<number>`coalesce(${memberCountSubquery.memberCount}, 0)`,
        noteCount: sql<number>`coalesce(${noteCountSubquery.noteCount}, 0)`,
        countTodayNotes: sql<number>`coalesce(${countTodayNotesSubquery.countTodayNotes}, 0)`,
        currentUserRole: currentUserMembership.role,
        materialCount: sql<number>`coalesce(${materialCountSubquery.materialCount}, 0)`,
        countTodayMaterials: sql<number>`coalesce(${countTodayMaterialsSubquery.countTodayMaterials}, 0)`,
    })
        .from(workspaces)
        .leftJoin(memberCountSubquery, eq(workspaces.id, memberCountSubquery.workspaceId))
        .leftJoin(noteCountSubquery, eq(workspaces.id, noteCountSubquery.workspaceId))
        .leftJoin(countTodayNotesSubquery, eq(workspaces.id, countTodayNotesSubquery.workspaceId))
        .leftJoin(materialCountSubquery, eq(workspaces.id, materialCountSubquery.workspaceId))
        .leftJoin(countTodayMaterialsSubquery, eq(workspaces.id, countTodayMaterialsSubquery.workspaceId))
        .leftJoin(
            currentUserMembership,
            and(
                eq(currentUserMembership.workspaceId, workspaces.id),
                eq(currentUserMembership.userId, userId)
            )
        )
        .where(
            or(
                eq(workspaces.userId, userId),      // dia owner
                inArray(workspaces.id, memberWorkspaceIds)   // dia member
            )
        )
        .orderBy(desc(workspaces.createdAt));

    return new Response(JSON.stringify(workspaceResults), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}