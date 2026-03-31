import React, { useState } from "react";
import type { FormEvent } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { convertPdfToImage } from "~/lib/pdf2img";
import { prepareInstructions } from "../../constants";

function Upload() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);

            // 1. Upload PDF
            setStatusText("Uploading resume...");
            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile) {
                setStatusText("Error: Failed to upload resume.");
                setIsProcessing(false);
                return;
            }

            // 2. Convert PDF → Image
            setStatusText("Converting to image...");
            const imageFile = await convertPdfToImage(file);

            if (!imageFile?.file) {
                setStatusText("Error: Failed to convert PDF.");
                setIsProcessing(false);
                return;
            }

            // 3. Upload Image
            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageFile.file]);

            if (!uploadedImage) {
                setStatusText("Error: Failed to upload image.");
                setIsProcessing(false);
                return;
            }

            // 4. Save initial data
            setStatusText("Preparing data...");
            const uuid = generateUUID();

            const data: any = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: null,
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // 5. AI Analysis
            setStatusText("Analyzing resume...");
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) {
                setStatusText("Error: AI analysis failed.");
                setIsProcessing(false);
                return;
            }

            // 6. Extract AI response safely
            const feedbackText =
                typeof feedback?.message?.content === "string"
                    ? feedback.message.content
                    : feedback?.message?.content?.[0]?.text || "{}";

            try {
                data.feedback = JSON.parse(feedbackText);
            } catch {
                data.feedback = { raw: feedbackText };
            }

            // 7. Save final result
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete ✅");

            // 8. Redirect to result page
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error(error);
            setStatusText("Something went wrong ❌");
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) {
            alert("Please upload a resume");
            return;
        }

        await handleAnalyze({
            companyName,
            jobTitle,
            jobDescription,
            file,
        });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart Feedback for Your Dream Job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                className="w-full max-w-md mx-auto"
                            />
                        </>
                    ) : (
                        <h2>
                            Drop your resume for an ATS score and improvement tips
                        </h2>
                    )}

                    {!isProcessing && (
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mt-8"
                        >
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input
                                    name="company-name"
                                    type="text"
                                    id="company-name"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    name="job-title"
                                    type="text"
                                    id="job-title"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">
                                    Job Description
                                </label>
                                <textarea
                                    name="job-description"
                                    rows={5}
                                    id="job-description"
                                />
                            </div>

                            <div className="form-div">
                                <label>Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;