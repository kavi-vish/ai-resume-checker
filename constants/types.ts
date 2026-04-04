// types.ts
export interface Tip {
    type: "good" | "improve";
    tip: string;
    explanation?: string;
}

export interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: string[];           // Keep as string[] for ATS (simpler)
    };
    toneAndStyle: {
        score: number;
        tips: Tip[];
    };
    content: {
        score: number;
        tips: Tip[];
    };
    structure: {
        score: number;
        tips: Tip[];
    };
    skills: {
        score: number;
        tips: Tip[];
    };
}