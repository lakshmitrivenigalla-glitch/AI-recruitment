import React, { useState } from "react";
import { JobPosting, Candidate } from "../types";
import { analyzeResume } from "../utils";
import { 
  FileText, 
  Upload, 
  BrainCircuit, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ClipboardList,
  MessageSquareQuote
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResumeScreenerViewProps {
  jobs: JobPosting[];
  onAddCandidate: (candidate: Candidate) => void;
  onNavigateToInterview: (candidateName: string, jobTitle: string, initialQuestion: string) => void;
}

const SAMPLE_RESUMES = [
  {
    name: "Jane Doe (Staff Engineer Resume)",
    text: `Jane Doe
jane.doe@email.com | +1 (555) 111-2222
Staff Software Engineer with 8+ years experience building highly resilient client-side architecture.

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3, SQL
Frameworks & Tools: React (v16-v19), Next.js, Vite, Tailwind CSS, Jest, Cypress, Docker, Git

EXPERIENCE:
Staff Frontend Architect | TechGlobal Corp (2022 - Present)
- Led team of 6 engineers refactoring main React billing dashboard, reducing hydration latency by 32%.
- Engineered design system library with Tailwind CSS, improving designer-to-developer handoff rate.
- Introduced strict TypeScript guidelines, decreasing compile-time exceptions by 40%.

Senior Web Developer | CloudSystems Ltd (2018 - 2022)
- Built progressive web applications (PWA) with React and state management.
- Spearheaded the adoption of Vite build tool, lowering hot-reload waiting times by 80%.`
  },
  {
    name: "John Smith (Product Manager Resume)",
    text: `John Smith
john.smith@email.com | +1 (555) 888-9999
Product Manager focused on generative AI systems and platform analytics.

TECHNICAL SKILLS:
Skills: Product Strategy, Large Language Models, Prompt Tuning, User Research, Agile, SQL, Jira, Mixpanel

EXPERIENCE:
Senior Product Manager | Innovation Labs (2023 - Present)
- Formulated strategy and launched public facing LLM interface, gaining 200k active users in first quarter.
- Collaborated with ML researchers to improve model output accuracy by 15% through reinforcement loops.
- Defined product roadmaps and ran sprint meetings with 3 development squads.

Associate Product Lead | Analytics Group (2020 - 2023)
- Tracked user engagement metrics with SQL dashboards and directed redesigns of customer onboarding flow.`
  },
  {
    name: "Alex Dev (Junior Resume - High Potential but Gaps)",
    text: `Alex Dev
alex.dev@email.com | +1 (555) 333-4444
Self-taught developer looking for mid-level frontend or full-stack positions.

TECHNICAL SKILLS:
Skills: HTML, CSS, JavaScript, React basics, Express, Git

EXPERIENCE:
Freelance Web Developer (2024 - Present)
- Styled static websites for local brick-and-mortar storefronts.
- Familiar with writing simple backend REST APIs with Express and Node.`
  }
];

export default function ResumeScreenerView({
  jobs,
  onAddCandidate,
  onNavigateToInterview
}: ResumeScreenerViewProps) {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const [resumeInput, setResumeInput] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handlePasteSample = (text: string, titleHint: string) => {
    setResumeInput(text);
    // Auto populate generic name details
    const lines = text.split("\n");
    if (lines.length > 0) {
      setCandidateName(lines[0].trim());
    }
    setCandidateEmail(lines.length > 1 && lines[1].includes("@") ? lines[1].split("|")[0].trim() : "candidate@example.com");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeInput.trim() || !selectedJobId) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const statuses = [
      "Reading resume metadata...",
      "Analyzing alignment with job requirements...",
      "Tuning skills map and computing match index...",
      "Generating customized interview questions..."
    ];

    let statusIdx = 0;
    setLoadingStatus(statuses[0]);

    const statusInterval = setInterval(() => {
      if (statusIdx < statuses.length - 1) {
        statusIdx++;
        setLoadingStatus(statuses[statusIdx]);
      }
    }, 1200);

    try {
      const data = await analyzeResume(
        resumeInput,
        selectedJob?.title || "Role",
        selectedJob?.requirements || []
      );

      clearInterval(statusInterval);
      setResults(data);

      // Create a candidate automatically
      const newCandidate: Candidate = {
        id: `cand-${Date.now()}`,
        name: candidateName.trim() || "Anonymous Applicant",
        email: candidateEmail.trim() || "candidate@example.com",
        phone: "+1 (555) 019-2834",
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=200`,
        jobId: selectedJobId,
        matchScore: data.matchScore,
        status: "Applied",
        appliedDate: new Date().toISOString().split('T')[0],
        resumeText: resumeInput,
        skillsMatch: data.skillsMatch,
        strengths: data.strengths,
        gaps: data.gaps,
        recommendedQuestions: data.recommendedQuestions,
        summary: data.summary
      };

      onAddCandidate(newCandidate);

    } catch (err: any) {
      clearInterval(statusInterval);
      setError("Failed to parse resume. Please ensure network is stable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="screener-view-wrapper">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-blue-600" />
            AI Resume Screener & Analyzer
          </h1>
          <p className="text-sm text-neutral-500">
            Paste a resume and match it against any job opening instantly to identify strengths, gaps, and match scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5" id="screener-grid">
        {/* Left Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Job selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Target Job Position</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm font-medium focus:border-blue-500 focus:bg-white outline-none"
                  required
                >
                  <option value="" disabled>Select active opening</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                  ))}
                </select>
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 font-mono">Candidate Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 font-mono">Candidate Email</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="jane@email.com"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-sm focus:border-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Paste shortcuts */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-500 font-mono block">Sample Resumes (Quick Test)</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_RESUMES.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handlePasteSample(sample.text, sample.name)}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition"
                      id={`sample-btn-${idx}`}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume text area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Resume Content (Plain Text)</label>
                <textarea
                  value={resumeInput}
                  onChange={(e) => setResumeInput(e.target.value)}
                  placeholder="Paste candidate's plain-text resume structure here..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm focus:border-blue-500 focus:bg-white outline-none font-sans h-56 resize-none"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading || !resumeInput.trim()}
                className={`w-full justify-center inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50`}
                id="analyze-submit-btn"
              >
                <BrainCircuit className="h-4 w-4" />
                {loading ? "AI Analysis in progress..." : "Run AI Resume Match"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
                id="screener-loading"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                  <BrainCircuit className="h-6 w-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-900 text-lg">Thinking and Matching</h3>
                  <p className="text-sm text-neutral-400 font-mono max-w-sm">{loadingStatus}</p>
                </div>
              </motion.div>
            )}

            {!loading && !results && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
                id="screener-empty"
              >
                <div className="rounded-2xl bg-neutral-100 p-4">
                  <Upload className="h-8 w-8 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-900 text-base">Awaiting Analysis</h3>
                  <p className="text-sm text-neutral-400 max-w-sm">
                    Select a target job and paste or click a sample resume on the left to initialize AI-based recruitment screening.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm flex items-start gap-4"
                id="screener-error"
              >
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-bold text-red-900 text-base">Engine Interrupted</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {results && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
                id="screener-results"
              >
                {/* Scoring Block */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      {/* Match Circle */}
                      <div className="h-20 w-20 rounded-full flex items-center justify-center bg-neutral-50 border-4 border-neutral-100">
                        <span className={`text-2xl font-black ${
                          results.matchScore >= 85 ? "text-emerald-600" :
                          results.matchScore >= 70 ? "text-amber-600" : "text-neutral-500"
                        }`}>
                          {results.matchScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-1.5">
                        AI Compatibility Score
                        <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Based on keyword matches, scope density, and seniority alignment.
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-1.5 border border-blue-200 text-xs font-semibold text-blue-800">
                    Candidate saved to Applied pipeline!
                  </div>
                </div>

                {/* Evaluation Summary */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-500 font-mono">AI Screening Evaluation</h3>
                  <p className="text-neutral-800 text-sm leading-relaxed font-sans">{results.summary}</p>
                </div>

                {/* Skills Match Alignment */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-500 font-mono">Skills Requirements Grid</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.skillsMatch?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium ${
                          item.matched 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                            : "bg-neutral-50 border-neutral-100 text-neutral-500"
                        }`}
                        id={`skill-match-${idx}`}
                      >
                        <span className="truncate">{item.skill}</span>
                        {item.matched ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 ml-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-neutral-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Gaps Splits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Key Core Strengths
                    </h3>
                    <ul className="space-y-2 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                      {results.strengths?.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-1.5 text-amber-700">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Identified Skills Gaps
                    </h3>
                    <ul className="space-y-2 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                      {results.gaps?.map((gap: string, i: number) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Deep Technical Behavioral interview questions */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-1.5">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                      Recommended Behavioral/Technical Questions
                    </h3>
                    <p className="text-[10px] text-neutral-400">Customized specific to candidate profile deficiencies</p>
                  </div>

                  <div className="space-y-3">
                    {results.recommendedQuestions?.map((q: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 flex items-start gap-3 hover:border-blue-200 hover:bg-blue-50/20 transition group cursor-pointer"
                        onClick={() => onNavigateToInterview(candidateName || "Jane Doe", selectedJob?.title || "Staff Engineer", q)}
                        id={`question-card-${idx}`}
                      >
                        <MessageSquareQuote className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-neutral-800 leading-relaxed font-medium">{q}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 group-hover:underline">
                            Launch simulator with this prompt
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
