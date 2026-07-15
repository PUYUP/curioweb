import {
    pgTable,
    text,
    timestamp,
    uuid,
    numeric,
    unique,
    index,
    check,
    jsonb,
    pgEnum,
    vector
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from '../auth.schema';
import { CHALLENGE_RESPONSE_STATUSES } from '@/lib/types/models';
import { papers } from './paper.schema';

export const answerStatusEnum = pgEnum('answer_status', ['DRAFT', 'SUBMITTED', 'EVALUATED']);

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
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
}, (table) => [
    // 1. Indexing untuk optimasi pencarian
    index('idx_challenge_papers_challenge_id').on(table.challengeId),
    index('idx_challenge_papers_paper_id').on(table.paperId),

    // 2. Unique Constraint (Satu paper tidak boleh dobel di satu challenge)
    unique('unique_challenge_paper').on(table.challengeId, table.paperId),

    // 3. Check Constraint (relevance_score harus antara 0 dan 1)
    check(
        'check_relevance_score',
        sql`${table.relevanceScore} >= 0 AND ${table.relevanceScore} <= 1`
    )
]);

export const paperSummaries = pgTable('paper_summaries', {
    id: uuid('id').primaryKey().defaultRandom(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow(),

    finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'date' }),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),

    paperId: uuid('paper_id').notNull().references(() => papers.id),
    challengeId: uuid('challenge_id').references(() => challenges.id),
    challengePaperId: uuid('challenge_paper_id').references(() => challengePapers.id),

    results: jsonb('results'),
    tool: text('tool'),
    model: text('model'),
    jobId: text('job_id'),
    status: text('status'),
});

export const challengeResponses = pgTable(
    'challenge_responses',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        challengeId: uuid('challenge_id').notNull(),
        userId: uuid('user_id').notNull(),
        answerText: text('answer_text'),
        embedding: vector('embedding', { dimensions: 1024 }),

        status: text('status', { enum: CHALLENGE_RESPONSE_STATUSES }).notNull(),
        startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()), // Drizzle otomatis mengupdate kolom ini saat row diubah

        submittedAt: timestamp('submitted_at', { withTimezone: true, mode: 'date' }),
    },
    (table) => [
        // 3. Constraint UNIQUE untuk keperluan fitur "Upsert" Draft
        unique('unique_user_challenge').on(
            table.challengeId,
            table.userId
        ),

        // 4. Index HNSW untuk optimasi pencarian Cosine Similarity
        index('challenge_responses_embedding_idx').using(
            'hnsw',
            table.embedding.op('vector_cosine_ops')
        ),
    ]
);