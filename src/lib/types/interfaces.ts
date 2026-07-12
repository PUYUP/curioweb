export interface PaperSummary {
    title: string;
    pdfUrl: string | null;
    abstract: string;
    fieldsOfStudy?: string[] | [];
    sample?: boolean;
    processingResult?: any[];
}

export interface ChallengeFilter {
    limit: number;
    offset: number;
}