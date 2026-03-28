import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rescheck" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section" >
      <div className="page-heading" >
        <h1>AI-Powered Resume Checker That Gets You Hired Faster</h1>
        <h2>Analyze your resume in seconds. Get smart suggestions, improve ATS score, and stand out to recruiters.</h2>
      </div>
    </section>
    {resumes.length>0 &&(
    <div className="resumes-section">
      {resumes.map((resume, index) => (
          <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
    )}
  </main>
}
