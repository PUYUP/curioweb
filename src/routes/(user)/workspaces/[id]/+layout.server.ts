import { db } from "$lib/server/db";
import { eq, desc, getTableColumns, count, and, sql } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";
import { researchContexts, workspaceMembers, workspaceNotes, workspaces } from "$lib/server/db/schemas/workspace.schema.js";
import { alias } from "drizzle-orm/pg-core";

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
    .where(sql`${workspaceNotes.createdAt}::date = CURRENT_DATE`) // see note below
    .groupBy(workspaceNotes.workspaceId)
    .as('count_today_notes');

export const load = async ({ locals, params }) => {
    const workspaceId = params.id;
    const userId = locals.user?.id;

    if (!userId) {
        return redirect(302, '/auth/login');
    }

    try {
        const [workspace] = await db
            .select({
                ...getTableColumns(workspaces),
                memberCount: sql<number>`coalesce(${memberCountSubquery.memberCount}, 0)`,
                noteCount: sql<number>`coalesce(${noteCountSubquery.noteCount}, 0)`,
                countTodayNotes: sql<number>`coalesce(${countTodayNotesSubquery.countTodayNotes}, 0)`,
                currentUserRole: currentUserMembership.role,
            })
            .from(workspaces)
            .leftJoin(memberCountSubquery, eq(workspaces.id, memberCountSubquery.workspaceId))
            .leftJoin(noteCountSubquery, eq(workspaces.id, noteCountSubquery.workspaceId))
            .leftJoin(countTodayNotesSubquery, eq(workspaces.id, countTodayNotesSubquery.workspaceId))
            .leftJoin(
                currentUserMembership,
                and(
                    eq(currentUserMembership.workspaceId, workspaces.id),
                    eq(currentUserMembership.userId, userId)
                )
            )
            .where(eq(workspaces.id, workspaceId))
            .limit(1);

        const contexts = await db.select()
            .from(researchContexts)
            .where(eq(researchContexts.workspaceId, workspaceId))
            .orderBy(desc(researchContexts.createdAt));

        return {
            workspace: workspace,
            contexts: contexts
        };
    } catch (error) {
        console.error("Error fetching workspace:", error);
        return {
            workspace: null,
            contexts: []
        };
    }
};