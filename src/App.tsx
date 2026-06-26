import React, { useState, useEffect } from "react";
import { JobPosting, Candidate } from "./types";
import { INITIAL_JOBS, INITIAL_CANDIDATES } from "./data";
import DashboardView from "./components/DashboardView";
import ResumeScreenerView from "./components/ResumeScreenerView";
import InterviewSimulatorView from "./components/InterviewSimulatorView";
import JobDescriptionView from "./components/JobDescriptionView";
import AnalyticsView from "./components/AnalyticsView";
import JobManagementView from "./components/JobManagementView";
import { 
  Briefcase, 
  Users, 
  BrainCircuit, 
  TrendingUp, 
  Sparkles, 
  Compass,
  FileText,
  Workflow,
  Download
} from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  // Views state
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // DB States (persisted via LocalStorage)
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Selection states for cross-navigation
  const [selectedInitialCandidate, setSelectedInitialCandidate] = useState<Candidate | null>(null);
  const [selectedInitialJob, setSelectedInitialJob] = useState<JobPosting | null>(null);

  // Prefilled states for interview simulator
  const [prefilledCandidateName, setPrefilledCandidateName] = useState("");
  const [prefilledJobTitle, setPrefilledJobTitle] = useState("");
  const [prefilledQuestion, setPrefilledQuestion] = useState("");

  // Initialize and load from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem("ai_recruit_jobs");
    const savedCandidates = localStorage.getItem("ai_recruit_candidates");

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(INITIAL_JOBS);
      localStorage.setItem("ai_recruit_jobs", JSON.stringify(INITIAL_JOBS));
    }

    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      setCandidates(INITIAL_CANDIDATES);
      localStorage.setItem("ai_recruit_candidates", JSON.stringify(INITIAL_CANDIDATES));
    }
  }, []);

  // Sync state modifications to localStorage
  const saveJobsToStorage = (updatedJobs: JobPosting[]) => {
    setJobs(updatedJobs);
    localStorage.setItem("ai_recruit_jobs", JSON.stringify(updatedJobs));
  };

  const saveCandidatesToStorage = (updatedCandidates: Candidate[]) => {
    setCandidates(updatedCandidates);
    localStorage.setItem("ai_recruit_candidates", JSON.stringify(updatedCandidates));
  };

  // Actions
  const handleAddJob = (newJob: JobPosting) => {
    const updated = [newJob, ...jobs];
    saveJobsToStorage(updated);
  };

  const handleAddCandidate = (newCandidate: Candidate) => {
    // Check if candidate already exists with same email to avoid duplicates
    const filtered = candidates.filter(c => c.email.toLowerCase() !== newCandidate.email.toLowerCase());
    const updated = [newCandidate, ...filtered];
    saveCandidatesToStorage(updated);
  };

  const handleUpdateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    saveCandidatesToStorage(updated);
  };

  // Cross-Navigation handlers
  const handleSelectCandidateFromDashboard = (candidate: Candidate) => {
    setSelectedInitialCandidate(candidate);
    const matchedJob = jobs.find(j => j.id === candidate.jobId) || null;
    setSelectedInitialJob(matchedJob);
    setCurrentTab("jobs");
  };

  const handleSelectJobFromDashboard = (job: JobPosting) => {
    setSelectedInitialJob(job);
    setSelectedInitialCandidate(null);
    setCurrentTab("jobs");
  };

  const handleNavigateToInterviewFromScreener = (candidateName: string, jobTitle: string, initialQuestion: string) => {
    setPrefilledCandidateName(candidateName);
    setPrefilledJobTitle(jobTitle);
    setPrefilledQuestion(initialQuestion);
    setCurrentTab("interview");
  };

  const handleClearInitialSelections = () => {
    setSelectedInitialCandidate(null);
    setSelectedInitialJob(null);
  };

  const handleClearPrefilledInterview = () => {
    setPrefilledCandidateName("");
    setPrefilledJobTitle("");
    setPrefilledQuestion("");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "screener", label: "Resume Screener", icon: BrainCircuit },
    { id: "interview", label: "Interview Simulator", icon: Workflow },
    { id: "jd-generator", label: "JD Generator", icon: Sparkles },
    { id: "jobs", label: "Hiring Pipelines", icon: Briefcase },
    { id: "analytics", label: "Pipeline Analytics", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-800 font-sans flex flex-col" id="app-root">
      {/* Premium Header Banner */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40" id="app-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-blue-600 p-2 text-white shadow-sm flex items-center justify-center">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-neutral-900 font-sans">
                  Kora AI <span className="text-xs font-semibold text-neutral-400 font-mono bg-neutral-100 border border-neutral-200 px-1.5 py-0.2 rounded-md ml-1">v1.2</span>
                </span>
                <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">Executive Recruitment Suite</p>
              </div>
            </div>

            {/* Export project zip info */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Local Mode Active
              </span>
              <div className="text-xs font-medium text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl hidden md:block">
                Deploy compatible: <strong>Cloudflare / GitHub / CLI</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8" id="main-content-layout">
        
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 flex flex-row md:flex-col gap-1.5 md:h-fit" id="nav-rail">
          <div className="w-full flex flex-wrap md:flex-col gap-1 bg-white border border-neutral-200 p-2 rounded-2xl shadow-sm">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // Clear selections if manually switching
                    if (item.id !== "jobs") handleClearInitialSelections();
                  }}
                  className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                  id={`nav-tab-${item.id}`}
                >
                  <IconComponent className="h-4.5 w-4.5 flex-shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dynamic Views Viewport */}
        <main className="flex-1 min-w-0" id="view-viewport">
          {currentTab === "dashboard" && (
            <DashboardView
              jobs={jobs}
              candidates={candidates}
              onNavigate={(view) => setCurrentTab(view)}
              onSelectCandidate={handleSelectCandidateFromDashboard}
              onSelectJob={handleSelectJobFromDashboard}
            />
          )}

          {currentTab === "screener" && (
            <ResumeScreenerView
              jobs={jobs.filter(j => j.status === "Active")}
              onAddCandidate={handleAddCandidate}
              onNavigateToInterview={handleNavigateToInterviewFromScreener}
            />
          )}

          {currentTab === "interview" && (
            <InterviewSimulatorView
              candidates={candidates}
              jobs={jobs.filter(j => j.status === "Active")}
              prefilledCandidateName={prefilledCandidateName}
              prefilledJobTitle={prefilledJobTitle}
              prefilledQuestion={prefilledQuestion}
              onClearPrefilled={handleClearPrefilledInterview}
            />
          )}

          {currentTab === "jd-generator" && (
            <JobDescriptionView
              onAddJob={handleAddJob}
            />
          )}

          {currentTab === "jobs" && (
            <JobManagementView
              jobs={jobs}
              candidates={candidates}
              onUpdateCandidateStatus={handleUpdateCandidateStatus}
              selectedInitialCandidate={selectedInitialCandidate}
              selectedInitialJob={selectedInitialJob}
              onNavigateToInterview={handleNavigateToInterviewFromScreener}
              onClearInitialSelections={handleClearInitialSelections}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsView
              jobs={jobs}
              candidates={candidates}
            />
          )}
        </main>
      </div>

      {/* Elegant minimalist footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-4" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400 font-mono">
          <span>&copy; 2026 Kora Recruiter Systems. All capabilities active.</span>
          <div className="flex gap-4">
            <span>Server: Express</span>
            <span>Frontend: React + Tailwind CSS</span>
            <span>Models: Gemini 3.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
