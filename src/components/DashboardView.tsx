import React from "react";
import { JobPosting, Candidate } from "../types";
import { 
  Users, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  Award
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardViewProps {
  jobs: JobPosting[];
  candidates: Candidate[];
  onNavigate: (view: string) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectJob: (job: JobPosting) => void;
}

export default function DashboardView({
  jobs,
  candidates,
  onNavigate,
  onSelectCandidate,
  onSelectJob
}: DashboardViewProps) {
  const activeJobs = jobs.filter(j => j.status === "Active");
  const avgMatchScore = Math.round(
    candidates.reduce((sum, c) => sum + c.matchScore, 0) / (candidates.length || 1)
  );

  // Status counters
  const screeningCount = candidates.filter(c => c.status === "Screening" || c.status === "Applied").length;
  const interviewCount = candidates.filter(c => c.status === "Interview").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
      id="dashboard-container"
    >
      {/* Header Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 text-white shadow-xl"
        id="dashboard-hero"
      >
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--color-sky-500),transparent)]"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sky-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            AI-Powered Co-Pilot Active
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-sans sm:text-4xl">
            Streamline your talent acquisition with executive-grade intelligence
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base font-sans">
            Screen resumes instantly, generate bias-free job listings, and conduct simulated behavioral mock interviews with custom analytics.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => onNavigate("screener")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-100"
              id="hero-screener-btn"
            >
              <BrainCircuit className="h-4 w-4 text-sky-600" />
              Screen a Resume
            </button>
            <button 
              onClick={() => onNavigate("interview")}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-700"
              id="hero-interview-btn"
            >
              <TrendingUp className="h-4 w-4" />
              Launch Mock Interview
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        id="metrics-grid"
      >
        {[
          {
            title: "Open Positions",
            value: activeJobs.length,
            sub: `${jobs.length - activeJobs.length} drafts / closed`,
            icon: Briefcase,
            color: "text-blue-600 bg-blue-50 border-blue-100"
          },
          {
            title: "Total Candidates",
            value: candidates.length,
            sub: `${screeningCount} in screening pipeline`,
            icon: Users,
            color: "text-indigo-600 bg-indigo-50 border-indigo-100"
          },
          {
            title: "Active Interviews",
            value: interviewCount,
            sub: "Mock simulator active",
            icon: Clock,
            color: "text-amber-600 bg-amber-50 border-amber-100"
          },
          {
            title: "Average Match Rating",
            value: `${avgMatchScore}%`,
            sub: "Target match threshold is 75%",
            icon: Award,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100"
          }
        ].map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div 
              key={idx} 
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              id={`metric-card-${idx}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">{m.title}</span>
                <div className={`rounded-xl p-2.5 border ${m.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">{m.value}</span>
                <p className="text-xs text-neutral-400 font-mono">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Main Splits */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3" id="dashboard-splits">
        {/* Left column: Recent candidates */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col space-y-4"
          id="recent-candidates-panel"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Highly Compatible Candidates</h2>
              <p className="text-xs text-neutral-500">Ranked by AI Resume Match ratings</p>
            </div>
            <button 
              onClick={() => onNavigate("jobs")} 
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              id="view-all-jobs-btn"
            >
              View Jobs Pipeline
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-100" id="candidates-list">
            {candidates
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 4)
              .map((candidate) => {
                const job = jobs.find(j => j.id === candidate.jobId);
                return (
                  <div 
                    key={candidate.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-neutral-50 transition cursor-pointer gap-4"
                    onClick={() => onSelectCandidate(candidate)}
                    id={`candidate-row-${candidate.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={candidate.avatar} 
                        alt={candidate.name} 
                        className="h-11 w-11 rounded-full object-cover border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm">{candidate.name}</h4>
                        <p className="text-xs text-neutral-500">
                          Applied for <span className="font-medium text-neutral-700">{job?.title || "Unknown Position"}</span>
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium border
                            ${candidate.status === 'Interview' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                            ${candidate.status === 'Screening' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${candidate.status === 'Applied' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                            ${candidate.status === 'Offered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                            ${candidate.status === 'Rejected' ? 'bg-neutral-50 text-neutral-500 border-neutral-200' : ''}
                          `}>
                            {candidate.status}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{candidate.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className={`text-base font-bold ${
                            candidate.matchScore >= 85 ? "text-emerald-600" :
                            candidate.matchScore >= 70 ? "text-amber-600" : "text-neutral-500"
                          }`}>
                            {candidate.matchScore}%
                          </span>
                          <ShieldCheck className={`h-4 w-4 ${candidate.matchScore >= 85 ? "text-emerald-500" : "text-neutral-400"}`} />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">Resume Match</p>
                      </div>
                      <span className="text-neutral-300 hidden sm:block">|</span>
                      <button 
                        className="rounded-lg bg-neutral-50 hover:bg-neutral-100 p-1.5 border border-neutral-200 text-xs font-semibold text-neutral-700"
                        id={`review-btn-${candidate.id}`}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Right column: Hot Job listing overview */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col space-y-4"
          id="hot-jobs-panel"
        >
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Active Job Postings</h2>
            <p className="text-xs text-neutral-500">Pipeline health and recruiter needs</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px]" id="dashboard-jobs-list">
            {activeJobs.map((job) => {
              const matches = candidates.filter(c => c.jobId === job.id);
              const bestMatch = matches.length > 0 ? Math.max(...matches.map(m => m.matchScore)) : 0;
              return (
                <div 
                  key={job.id} 
                  className="rounded-xl border border-neutral-100 p-4 hover:border-neutral-200 hover:bg-neutral-50 transition cursor-pointer space-y-2"
                  onClick={() => onSelectJob(job)}
                  id={`dashboard-job-${job.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-sm">{job.title}</h4>
                      <p className="text-xs text-neutral-500 font-mono">{job.department} · {job.location}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-xs">
                    <span className="text-neutral-500 font-mono">
                      Applicants: <strong className="text-neutral-800">{matches.length}</strong>
                    </span>
                    {bestMatch > 0 && (
                      <span className="text-neutral-500 font-mono">
                        Best Match: <strong className="text-emerald-600">{bestMatch}%</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("jd-generator")}
            className="w-full justify-center inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            id="dashboard-new-jd-btn"
          >
            <Sparkles className="h-4 w-4" />
            AI JD Generator
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
