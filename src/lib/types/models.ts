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
    userId: string;
    targetDate: string;
    status: ChallengeStatus;
    code: string;
    challenge_papers: {
        title: string;
        pdfUrl: string;
    }[];
}

export interface ChallengeResponse extends ChallengeData {
    papers: PaperData[];
}

export const CHALLENGE_RESPONSE_STATUSES = ['draft', 'submitted', 'evaluated'] as const;
export type ChallengeResponseStatus = typeof CHALLENGE_RESPONSE_STATUSES[number];

export interface ChallengeResponseData {
    challengeId: string;
    userId: string;
    answerText: string;
    status: ChallengeResponseStatus;
    startedAt: Date;
    updatedAt: Date;
    submittedAt: Date;
}

export type SaveDraftInput = Pick<ChallengeResponseData, 'userId' | 'challengeId' | 'answerText'>; 