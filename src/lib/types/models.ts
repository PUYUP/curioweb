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