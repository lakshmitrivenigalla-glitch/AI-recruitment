import React, { useState } from "react";
import { JobPosting } from "../types";
import { generateJobDescription } from "../utils";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Briefcase, 
  CheckCircle,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JobDescriptionViewProps {
  onAddJob: (job: JobPosting) => void;
}

export default function JobDescriptionView({ onAddJob }: JobDescriptionViewProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"Entry" | "Mid" | "Senior" | "Lead">("Mid");
  const [keyRequirements, setKeyRequirements] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [published, setPublished] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !department.trim()) return;

    setLoading(true);
    setPublished(false);
    setResults(null);

    try {
      const data = await generateJobDescription({
        title,
        department,
        experienceLevel,
        keyRequirements
      });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!results) return;
    const text = `
Position: ${title}
Department: ${department}
Experience Level: ${experienceLevel}

Description:
${results.description}

Key Requirements:
${results.requirements?.map((r: string) => `- ${r}`).join("\n")}

Responsibilities:
${results.responsibilities?.map((r: string) => `- ${r}`).join("\n")}

Benefits:
${results.benefits?.map((b: string) => `- ${b}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    if (!results) return;
    
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title,
      department,
      location: "San Francisco, CA (Hybrid)",
      type: "Full-time",
      experienceLevel,
      description: results.description,
      requirements: results.requirements?.slice(0, 6) || [],
      status: "Active",
      applicantsCount: 0,
      datePosted: new Date().toISOString().split('T')[0]
    };

    onAddJob(newJob);
    setPublished(true);
  };

  return (
    <div className="space-y-8" id="jd-optimizer-wrapper">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          AI Job Description Optimizer
        </h1>
        <p className="text-sm text-neutral-500">
          Generate structured, professional, inclusive job requirements and responsibilities customized for any department or experience level.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5" id="jd-grid">
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Architect"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm focus:border-blue-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Engineering, Product, Analytics"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm focus:border-blue-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Experience Seniority</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Entry", "Mid", "Senior", "Lead"] as const).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`rounded-xl py-2 text-xs font-semibold border transition ${
                        experienceLevel === level
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Core Focus (Comma Separated)</label>
                <textarea
                  value={keyRequirements}
                  onChange={(e) => setKeyRequirements(e.target.value)}
                  placeholder="TypeScript, state machine development, performance analysis, mentoring juniors..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm focus:border-blue-500 focus:bg-white outline-none font-sans h-28 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim() || !department.trim()}
                className="w-full justify-center inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                id="generate-jd-submit"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating Listing..." : "AI Generate Description"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
                id="jd-loading"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                  <Sparkles className="h-6 w-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">AI Drafting in Progress</h3>
                  <p className="text-sm text-neutral-400 font-mono mt-1">Sourcing professional templates & balancing skill benchmarks...</p>
                </div>
              </motion.div>
            )}

            {!loading && !results && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
                id="jd-empty"
              >
                <div className="rounded-2xl bg-neutral-100 p-4">
                  <FileText className="h-8 w-8 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Description Workspace</h3>
                  <p className="text-sm text-neutral-400 max-w-sm mt-1">
                    Fill in the position title, experience scope, and focus on the left. The AI writer will generate structured responsibilities and perks.
                  </p>
                </div>
              </motion.div>
            )}

            {results && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="jd-results"
              >
                {/* Actions banner */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-emerald-600 font-mono flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Listing Successfully Drafted
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm"
                      id="copy-jd-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Clipboard
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePublish}
                      disabled={published}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
                      id="publish-jd-btn"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {published ? "Published!" : "Publish to Jobs board"}
                    </button>
                  </div>
                </div>

                {/* JD Render Panel */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
                  {/* Job Title header */}
                  <div className="border-b border-neutral-100 pb-4">
                    <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{department} Department · {experienceLevel} Seniority</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Role Overview</h3>
                    <p className="text-neutral-800 text-sm leading-relaxed font-sans">{results.description}</p>
                  </div>

                  {/* Requirements & Responsibilities Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Core Requirements</h3>
                      <ul className="space-y-1.5 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                        {results.requirements?.map((req: string, idx: number) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Responsibilities</h3>
                      <ul className="space-y-1.5 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                        {results.responsibilities?.map((resp: string, idx: number) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="border-t border-neutral-100 pt-4 space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Benefits & Perks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.benefits?.map((b: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
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
