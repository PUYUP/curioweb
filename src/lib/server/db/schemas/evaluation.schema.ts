import { pgTable, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { answers } from './challenge.schema.js';
import { challenges } from './challenge.schema.js';
import { challengePapers } from './challenge.schema.js';
import { user } from '../auth.schema.js';

export const evaluations = pgTable('evaluations', {
    id: uuid('id')
        .primaryKey()
        .defaultRandom()
        .notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true }),

    userId: uuid('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),

    answerId: uuid('answer_id')
        .notNull()
        .references(() => answers.id),

    challengeId: uuid('challenge_id')
        .notNull()
        .references(() => challenges.id),

    challengePaperId: uuid('challenge_paper_id')
        .notNull()
        .references(() => challengePapers.id),

    results: jsonb('results'), // Nullable secara default
});