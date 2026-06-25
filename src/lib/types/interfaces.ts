export interface PaperSummary {
    title: string;
    sources: Source[];
    content: string;
    sample?: boolean;
}

export interface Source {
    url: string;
    title: string;
}