import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score = 0 }: { score?: number }) => {
    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
                score > 69 ? "bg-badge-green" :
                    score > 39 ? "bg-badge-yellow" : "bg-badge-red"
            )}
        >
            <img
                src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score"
                className="size-4"
            />
            <p className={cn("text-sm font-medium",
                score > 69 ? "text-badge-green-text" :
                    score > 39 ? "text-badge-yellow-text" : "text-badge-red-text"
            )}>
                {score}/100
            </p>
        </div>
    );
};

const CategoryHeader = ({ title, categoryScore = 0 }: { title: string; categoryScore?: number }) => {
    return (
        <div className="flex flex-row gap-4 items-center py-2">
            <p className="text-2xl font-semibold">{title}</p>
            <ScoreBadge score={categoryScore} />
        </div>
    );
};

const CategoryContent = ({ tips = [] }: { tips?: any[] }) => {
    if (!tips || tips.length === 0) {
        return <p className="text-gray-500 py-8 text-center">No detailed feedback available for this section yet.</p>;
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {tips.map((tip, index) => (
                <div key={index} className={cn(
                    "rounded-2xl p-5",
                    tip.type === "good"
                        ? "bg-green-50 border border-green-200"
                        : "bg-yellow-50 border border-yellow-200"
                )}>
                    <div className="flex items-start gap-3">
                        <img
                            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            className="size-5 mt-1"
                        />
                        <div>
                            <p className="font-semibold text-lg">{tip.tip}</p>
                            <p className="mt-2 text-gray-700">{tip.explanation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Details = ({ feedback }: { feedback: any }) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Accordion>
                <AccordionItem id="tone-style">
                    <AccordionHeader itemId="tone-style">
                        <CategoryHeader title="Tone & Style" categoryScore={feedback?.toneAndStyle?.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="tone-style">
                        <CategoryContent tips={feedback?.toneAndStyle?.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="content">
                    <AccordionHeader itemId="content">
                        <CategoryHeader title="Content" categoryScore={feedback?.content?.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="content">
                        <CategoryContent tips={feedback?.content?.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="structure">
                    <AccordionHeader itemId="structure">
                        <CategoryHeader title="Structure" categoryScore={feedback?.structure?.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="structure">
                        <CategoryContent tips={feedback?.structure?.tips} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem id="skills">
                    <AccordionHeader itemId="skills">
                        <CategoryHeader title="Skills" categoryScore={feedback?.skills?.score} />
                    </AccordionHeader>
                    <AccordionContent itemId="skills">
                        <CategoryContent tips={feedback?.skills?.tips} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default Details;