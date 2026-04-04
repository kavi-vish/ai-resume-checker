import React from 'react';
import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

interface FeedbackCategory {
    score?: number;
    feedback?: string;
}

interface Feedback {
    overallScore?: number;
    toneAndStyle?: FeedbackCategory;
    content?: FeedbackCategory;
    structure?: FeedbackCategory;
    skills?: FeedbackCategory;
    ATS?: { score?: number; tips?: string[] };
    [key: string]: any;
}

const Category = ({ title, score = 0 }: { title: string; score?: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const overallScore = feedback?.overallScore ?? 75;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category title="Tone & Style" score={feedback?.toneAndStyle?.score} />
            <Category title="Content" score={feedback?.content?.score} />
            <Category title="Structure" score={feedback?.structure?.score} />
            <Category title="Skills" score={feedback?.skills?.score} />
        </div>
    );
};

export default Summary;