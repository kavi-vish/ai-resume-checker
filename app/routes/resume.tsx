import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Feedback } from "~/types";

export const meta = () => ([
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
]);

const Resume = () => {
    const { fs, kv } = usePuterStore();
    const { id } = useParams();

    const [imageUrl, setImageUrl] = useState<string>('');
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const stored = await kv.get(`resume:${id}`);
            if (!stored) {
                console.error('No resume data found for id:', id);
                return;
            }

            const data = JSON.parse(stored);
            console.log("Loaded data:", data);

            // Load PDF
            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                setResumeUrl(URL.createObjectURL(pdfBlob));
            }

            // Load Image - THIS WAS THE MAIN BUG
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
                const newImageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(newImageUrl);
                console.log("✅ Image URL set:", newImageUrl);
            } else {
                console.error("Failed to load image from path:", data.imagePath);
            }

            if (data.feedback) {
                setFeedback(data.feedback);
            }
        };

        loadResume();
    }, [id, kv, fs]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                {/* Resume Preview */}
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">
                    {imageUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl shadow-2xl"
                                alt="resume preview"
                            />
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    download="my-resume.pdf"
                                    className="block mt-6 text-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    ↓ Download Original PDF
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center gap-4">
                            <div className="text-6xl">🔍</div>
                            Loading resume preview...
                        </div>
                    )}
                </section>

                {/* Feedback Panel */}
                <section className="feedback-section p-8 overflow-auto">
                    <h2 className="text-4xl text-black font-bold mb-8">Resume Review</h2>

                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback.ATS?.score || 0}
                                suggestions={feedback.ATS?.tips || []}
                            />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex justify-center py-20">
                            <img src="/images/resume-scan-2.gif" className="w-64 opacity-70" />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;