import {
    pgTable,
    text,
    timestamp,
    uuid,
    numeric,
    unique,
    index,
    check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from '../auth.schema';

export const challenges = pgTable('challenges', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    code: text('code').notNull().unique(),
    targetDate: timestamp('target_date', { mode: 'date' }).notNull(),
    status: text('status', { enum: ['pending', 'active', 'completed', 'read', 'rejected'] })
        .default('pending')
        .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
});

export const challengePapers = pgTable('challenge_papers', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),

    challengeId: uuid('challenge_id')
        .notNull()
        .references(() => challenges.id, { onDelete: 'cascade' }),
    paperId: uuid('paper_id').notNull(),
    relevanceScore: numeric('relevance_score', { precision: 3, scale: 2 }),
    relevanceLabel: text('relevance_label', { enum: ['closest', 'farthest'] }),
    status: text('status').default('unread').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => {
    return {
        // 1. Indexing untuk optimasi pencarian
        challengeIdIdx: index('idx_challenge_papers_challenge_id').on(table.challengeId),
        paperIdIdx: index('idx_challenge_papers_paper_id').on(table.paperId),

        // 2. Unique Constraint (Satu paper tidak boleh dobel di satu challenge)
        unqChallengePaper: unique('unique_challenge_paper').on(table.challengeId, table.paperId),

        // 3. Check Constraint (relevance_score harus antara 0 dan 1)
        checkRelevanceScore: check(
            'check_relevance_score',
            sql`${table.relevanceScore} >= 0 AND ${table.relevanceScore} <= 1`
        )
    };
});