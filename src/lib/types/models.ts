export interface ProfileData {
    interest: string;
    languageCode: string;
}

export interface PaperData {
    pdfUrl: string;
    title: string;
}

export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'read' | 'rejected';

export interface ChallengeData {
    readonly id: string;
    userId: string;
    targetDate: string;
    status: ChallengeStatus;
    code: string;
    challenge_papers: {
        title: string;
        pdfUrl: string;
    }[];
}

export const ANSWERS_STATUSES = ['draft', 'submitted', 'evaluated'] as const;
export type AnswerStatus = typeof ANSWERS_STATUSES[number];

export interface AnswerData {
    challengeId: string;
    userId: string;
    content: string;
    status: AnswerStatus;
    startedAt: Date;
    updatedAt: Date;
    submittedAt: Date | null;
}

export type SaveAnswerInput = Pick<AnswerData, 'userId' | 'challengeId' | 'content' | 'status' | 'submittedAt'>;
export type SaveDraftInput = Pick<AnswerData, 'userId' | 'challengeId' | 'content' | 'status'>;