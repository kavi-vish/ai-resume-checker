import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";
export const meta=()=>([
    {title:'Rescheck|Review'},
    {name:'description',content:'Detailed overview of your resume'},
])
const Resume = () => {
    const{auth, isLoading, fs, kv}=usePuterStore();
    const{id} = useParams();
    const[imageUrl,setImageUrl]=useState('');
    const[resumeUrl,setResumeUrl]=useState('');
    const[feedback,setfeedback]=useState<Feedback | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=resume/${id}`);
    }, [isLoading]);


    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;

            const stored = await kv.get(`resume:${id}`);
            if (!stored) {
                console.error('No resume data found for id:', id);
                return;
            }

            const data = JSON.parse(stored);

            // Load PDF
            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                setResumeUrl(URL.createObjectURL(pdfBlob));
            }

            // Load image (the one that actually shows)
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
            }

            setfeedback(data.feedback);

            console.log('✅ Loaded resume data:', {
                id: data.id,
                imageUrl: imageUrl,      // will show correct URL now
                resumeUrl: resumeUrl,
                feedback: data.feedback
            });
        };

        loadResume();
    }, [id, kv, fs]);   // ← added dependencies

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">BACK TO THE HOME PAGE</span>
                </Link>

            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl &&(
                        <div className="animate-in fade-in duration-1000 gradient-boarder max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a>
                                <img
                                    src={imageUrl}    // ←←← CHANGED HERE
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume preview"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl text-black font-bold">Resume Review</h2>
                    {feedback?(
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback}/>

                            <Details feedback={feedback}/>

                        </div>
                    ):(
                        <img src="/images/resume-scan-2.gif" className="w-full"/>
                    )}
                </section>

            </div>
        </main>
    )
}
export default Resume
