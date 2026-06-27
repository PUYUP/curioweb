export interface ProfileData {
    interest: string;
    languageCode: string;
}

export interface PaperData {
    url: string;
    title: string;
}

export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'read' | 'rejected';

export interface ChallengeData {
    userId: string;
    targetDate: string;
    status: ChallengeStatus;
    code: string;
}

export interface ChallengeResponse extends ChallengeData {
    papers: PaperData[];
}