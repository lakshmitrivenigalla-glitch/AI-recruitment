import React, { useState } from "react";
import { JobPosting, Candidate } from "../types";
import { 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JobManagementViewProps {
  jobs: JobPosting[];
  candidates: Candidate[];
  onUpdateCandidateStatus: (candidateId: string, newStatus: Candidate['status']) => void;
  selectedInitialCandidate: Candidate | null;
  selectedInitialJob: JobPosting | null;
  onNavigateToInterview: (candidateName: string, jobTitle: string, initialQuestion: string) => void;
  onClearInitialSelections: () => void;
}

export default function JobManagementView({
  jobs,
  candidates,
  onUpdateCandidateStatus,
  selectedInitialCandidate,
  selectedInitialJob,
  onNavigateToInterview,
  onClearInitialSelections
}: JobManagementViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    selectedInitialJob?.id || selectedInitialCandidate?.jobId || jobs[0]?.id || ""
  );
  
  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const jobCandidates = candidates.filter(c => c.jobId === selectedJobId);

  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(
    selectedInitialCandidate?.id || (jobCandidates[0]?.id || null)
  );

  const activeCandidate = candidates.find(c => c.id === activeCandidateId);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const filtered = candidates.filter(c => c.jobId === jobId);
    if (filtered.length > 0) {
      setActiveCandidateId(filtered[0].id);
    } else {
      setActiveCandidateId(null);
    }
    if (onClearInitialSelections) onClearInitialSelections();
  };

  const handleCandidateSelect = (candidateId: string) => {
    setActiveCandidateId(candidateId);
    if (onClearInitialSelections) onClearInitialSelections();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="job-pipeline-wrapper">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-600" />
          Active Hiring Pipelines
        </h1>
        <p className="text-sm text-neutral-500">
          Manage job postings, review automated AI match summaries, and track applicant funnel progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="pipeline-grids">
        {/* Left Column: Job postings List (span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Active Openings</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto" id="pipeline-jobs-list">
            {jobs.map((job) => {
              const count = candidates.filter(c => c.jobId === job.id).length;
              return (
                <div
                  key={job.id}
                  onClick={() => handleJobSelect(job.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex justify-between items-center ${
                    selectedJobId === job.id
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                  }`}
                  id={`pipeline-job-row-${job.id}`}
                >
                  <div className="space-y-0.5 truncate flex-1 pr-2">
                    <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                    <p className={`text-[10px] font-mono ${selectedJobId === job.id ? "text-blue-100" : "text-neutral-400"}`}>
                      {job.department} · {job.location.split("(")[0]}
                    </p>
                  </div>
                  <span className={`rounded-lg text-[10px] font-mono font-bold px-2 py-0.5 ${
                    selectedJobId === job.id
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Applicants List (span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">
            Applicants ({jobCandidates.length})
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto" id="pipeline-candidates-list">
            {jobCandidates.length > 0 ? (
              jobCandidates
                .sort((a, b) => b.matchScore - a.matchScore)
                .map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => handleCandidateSelect(candidate.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      activeCandidateId === candidate.id
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                        : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                    }`}
                    id={`pipeline-candidate-row-${candidate.id}`}
                  >
                    <div className="flex items-center gap-3 truncate flex-1">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-9 w-9 rounded-full object-cover border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate space-y-0.5">
                        <h4 className="font-semibold text-sm truncate">{candidate.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-semibold border ${
                            activeCandidateId === candidate.id
                              ? "bg-white/20 border-white/10 text-white"
                              : "bg-neutral-100 border-neutral-200 text-neutral-600"
                          }`}>
                            {candidate.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-sm font-bold ${
                        activeCandidateId === candidate.id
                          ? "text-sky-300"
                          : candidate.matchScore >= 85
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {candidate.matchScore}%
                      </span>
                      <p className={`text-[8px] font-mono ${activeCandidateId === candidate.id ? "text-neutral-400" : "text-neutral-400"}`}>
                        Match
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center text-xs text-neutral-400">
                No active applicants in this pipeline.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full AI Profile Details (span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">AI Evaluation Panel</h3>
          
          <AnimatePresence mode="wait">
            {activeCandidate ? (
              <motion.div
                key={activeCandidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5 max-h-[560px] overflow-y-auto"
                id="candidate-evaluation-panel"
              >
                {/* Profile Header */}
                <div className="flex items-start justify-between border-b border-neutral-100 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeCandidate.avatar}
                      alt={activeCandidate.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-neutral-900 text-base">{activeCandidate.name}</h3>
                      <div className="flex flex-col gap-0.5 text-xs text-neutral-500 font-sans mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-neutral-400" /> {activeCandidate.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-neutral-400" /> {activeCandidate.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <span className={`text-xl font-extrabold ${
                        activeCandidate.matchScore >= 85 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {activeCandidate.matchScore}%
                      </span>
                      <ShieldCheck className={`h-5 w-5 ${activeCandidate.matchScore >= 85 ? "text-emerald-500" : "text-neutral-400"}`} />
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono">Match Score</p>
                  </div>
                </div>

                {/* Pipeline Funnel Stage Changer */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-neutral-500 font-mono">Recruiter Decision Status</span>
                  <select
                    value={activeCandidate.status}
                    onChange={(e) => onUpdateCandidateStatus(activeCandidate.id, e.target.value as Candidate['status'])}
                    className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold text-neutral-700 outline-none focus:border-blue-500"
                    id="pipeline-status-changer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* AI Screening summary */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">AI Profiler Summary</span>
                  <p className="text-neutral-700 text-xs leading-relaxed font-sans">{activeCandidate.summary}</p>
                </div>

                {/* Strengths & Gaps */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider block">Key Assessments</span>
                  <div className="space-y-2">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 space-y-1.5">
                      <h4 className="text-xs font-semibold text-emerald-800 flex items-center gap-1 font-mono">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Strengths
                      </h4>
                      <ul className="space-y-1 text-[11px] text-neutral-700 list-disc pl-3 leading-relaxed">
                        {activeCandidate.strengths?.slice(0, 2).map((str, i) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 space-y-1.5">
                      <h4 className="text-xs font-semibold text-amber-800 flex items-center gap-1 font-mono">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Minor Concerns / Gaps
                      </h4>
                      <ul className="space-y-1 text-[11px] text-neutral-700 list-disc pl-3 leading-relaxed">
                        {activeCandidate.gaps?.slice(0, 2).map((gap, i) => <li key={i}>{gap}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions: recommended questions */}
                {activeCandidate.recommendedQuestions && activeCandidate.recommendedQuestions.length > 0 && (
                  <div className="space-y-2 border-t border-neutral-100 pt-4">
                    <span className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider block">Recommended Interview Questions</span>
                    <div className="space-y-2">
                      {activeCandidate.recommendedQuestions.slice(0, 2).map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-neutral-50 hover:bg-indigo-50/35 border border-neutral-150 hover:border-indigo-150 rounded-xl flex items-start gap-2.5 transition cursor-pointer group"
                          onClick={() => onNavigateToInterview(activeCandidate.name, selectedJob?.title || "Staff Developer", q)}
                          id={`management-question-${idx}`}
                        >
                          <BrainCircuit className="h-4.5 w-4.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-0.5">
                            <p className="text-[11px] text-neutral-700 leading-relaxed font-sans">{q}</p>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 group-hover:underline">
                              Launch behavioral simulator
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center text-xs text-neutral-400">
                Select an active candidate to view full AI screening dashboards.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
