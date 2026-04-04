# AI Resume Checker

**Smart AI-powered resume analyzer** that gives you detailed feedback, ATS score, and improvement suggestions based on your target job.

Built with **React + TypeScript + Puter AI**.

## ✨ Features

- Upload PDF resume → Automatic conversion to image for better AI analysis
- Job-specific analysis (Company Name, Job Title, Job Description)
- **ATS Score** with detailed breakdown
- Categorized feedback:
  - Tone & Style
  - Content
  - Structure
  - Skills
- Beautiful resume preview with original PDF download
- Clean, modern, and responsive UI
- Real-time AI feedback using Puter AI (Claude / Gemini)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **AI & Backend**: Puter (AI Chat, File System, KV Store)
- **PDF Processing**: `pdf.js`
- **Icons & Animations**: Custom + Tailwind

## 📸 Screenshots
<img width="1898" height="910" alt="image" src="https://github.com/user-attachments/assets/02810c3a-678a-4974-a847-126c4ed0d7f2" />
<img width="1897" height="911" alt="image" src="https://github.com/user-attachments/assets/bcae7baa-353d-4ab9-85e8-08f1579d447d" />


## 📁 Project Structure

```bash
src/
├── routes/                 # Page components (Upload, Resume, etc.)
├── components/             # Reusable UI components
│   ├── Summary.tsx
│   ├── Details.tsx
│   ├── ATS.tsx
│   ├── ScoreGauge.tsx
│   └── FileUploader.tsx
├── lib/
│   ├── puter.ts            # Puter SDK integration
│   ├── pdf2img.ts          # PDF to Image converter
│   └── utils.ts
├── types.ts                # TypeScript interfaces
└── constants.ts            # AI instructions & config

🛠️ Installation & Setup
Prerequisites

Node.js (v18 or higher)
A Puter account

Steps

Clone the repositoryBashgit clone https://github.com/kavi-vish/ai-resume-checker.git
cd ai-resume-checker
Install dependenciesBashnpm install
Configure Puter
Make sure ~/lib/puter.ts is correctly set up with your Puter authentication.
Ensure the ai.feedback() method uses a vision-capable model.

Run locallyBashnpm run dev
Open http://localhost:5173

How It Works

User enters Company Name, Job Title, and Job Description
Uploads a PDF resume
The app converts PDF → high-quality image
AI analyzes the resume image against the job description
Returns structured JSON with scores and actionable tips
Displays beautiful preview + detailed feedback

Key Technologies Used

Vision AI: Uses converted resume image for better analysis
Structured Output: Strict prompting to get consistent JSON format
File Handling: Puter FS + KV for storing resumes and results

Contributing
Contributions are welcome! Feel free to:

Open an issue for bugs or feature requests
Submit pull requests for improvements
Improve the AI prompt for better feedback quality

License
This project is open source and available under the MIT License.
Acknowledgments

Built using Puter – All-in-one cloud platform
Inspired by modern resume optimization tools
Thanks to the open-source community for pdf.js and React ecosystem


Made with ❤️ to help job seekers land their dream roles
