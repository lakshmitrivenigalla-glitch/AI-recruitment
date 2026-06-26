import React, { useState, useEffect, useRef } from "react";
import { Candidate, InterviewMessage, InterviewSession } from "../types";
import { sendInterviewMessage, evaluateInterview } from "../utils";
import { 
  Send, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  Play, 
  User, 
  UserCheck, 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart2,
  RefreshCw
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface InterviewSimulatorViewProps {
  candidates: Candidate[];
  jobs: any[];
  prefilledCandidateName?: string;
  prefilledJobTitle?: string;
  prefilledQuestion?: string;
  onClearPrefilled?: () => void;
}

export default function InterviewSimulatorView({
  candidates,
  jobs,
  prefilledCandidateName = "",
  prefilledJobTitle = "",
  prefilledQuestion = "",
  onClearPrefilled
}: InterviewSimulatorViewProps) {
  const [candidateName, setCandidateName] = useState(prefilledCandidateName || "Jane Doe");
  const [jobTitle, setJobTitle] = useState(prefilledJobTitle || "Senior React Engineer");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize prefilled values if they exist
  useEffect(() => {
    if (prefilledCandidateName) setCandidateName(prefilledCandidateName);
    if (prefilledJobTitle) setJobTitle(prefilledJobTitle);

    if (prefilledQuestion && prefilledCandidateName && prefilledJobTitle) {
      // Auto launch session
      startSession(prefilledCandidateName, prefilledJobTitle, prefilledQuestion);
    }
  }, [prefilledCandidateName, prefilledJobTitle, prefilledQuestion]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startSession = async (cName: string, jTitle: string, initialQ?: string) => {
    setIsSessionActive(true);
    setEvaluation(null);
    setLoading(true);

    const firstMsg: InterviewMessage = {
      id: "msg-init",
      sender: "ai",
      text: initialQ || `Hello ${cName}! Welcome to your AI behavioral interview for the ${jTitle} position. To start off, could you please introduce yourself and walk me through a major project you shipped recently that you are particularly proud of?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([firstMsg]);
    setLoading(false);
    if (onClearPrefilled) onClearPrefilled();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg: InterviewMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendInterviewMessage(updatedMessages, jobTitle, candidateName);
      const aiMsg: InterviewMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndEvaluate = async () => {
    if (messages.length < 2) return;
    setEvaluating(true);

    try {
      const data = await evaluateInterview(messages, jobTitle, candidateName);
      setEvaluation(data);
      setIsSessionActive(false);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setIsSessionActive(false);
    setMessages([]);
    setInputMessage("");
  };

  // Score charts data
  const chartData = evaluation ? [
    { name: "Communication", score: evaluation.communicationScore, fill: "#3b82f6" },
    { name: "Technical / Logic", score: evaluation.technicalScore, fill: "#10b981" }
  ] : [];

  return (
    <div className="space-y-8" id="interview-simulator-wrapper">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-indigo-600" />
          AI Behavioral Interview Practice Console
        </h1>
        <p className="text-sm text-neutral-500">
          Conduct simulated professional behavioral interviews. Type answers to standard and custom prompts and get executive-level evaluation.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Setup Screen */}
        {!isSessionActive && !evaluation && !evaluating && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm space-y-6"
            id="setup-card"
          >
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Configure Practice Session</h2>
                <p className="text-xs text-neutral-500 font-mono">Simulate a high-level candidate experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Candidate Name / Persona</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 font-mono">Interviewing For Position</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Staff React Engineer"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
                />
                <span className="text-[10px] text-neutral-400 block">Or select an active template:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {jobs.slice(0, 3).map((job, i) => (
                    <button
                      key={i}
                      onClick={() => setJobTitle(job.title)}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 transition"
                      id={`job-tag-${i}`}
                    >
                      {job.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => startSession(candidateName, jobTitle)}
              className="w-full justify-center inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              id="start-interview-btn"
            >
              Start AI Behavioral Session
            </button>
          </motion.div>
        )}

        {/* Active Session Console */}
        {isSessionActive && !evaluating && (
          <motion.div
            key="console"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-4 max-w-6xl mx-auto"
            id="active-console"
          >
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm h-fit space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 font-mono">Live Interview</span>
                <h3 className="font-bold text-neutral-900 text-base">{candidateName}</h3>
                <p className="text-xs text-neutral-500">{jobTitle}</p>
              </div>

              <div className="space-y-2 border-t border-b border-neutral-100 py-4">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Session Length: {messages.length} messages</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  <span>Recommend: at least 3 turns</span>
                </div>
              </div>

              <button
                onClick={handleFinishAndEvaluate}
                disabled={messages.length < 2}
                className="w-full justify-center inline-flex items-center gap-2 rounded-xl bg-indigo-600 disabled:bg-neutral-200 disabled:text-neutral-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                id="finish-interview-btn"
              >
                <TrendingUp className="h-4 w-4" />
                Finish & Evaluate
              </button>
            </div>

            {/* Chat Dialog */}
            <div className="lg:col-span-3 rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col h-[520px]">
              {/* Top info bar */}
              <div className="border-b border-neutral-100 p-4 bg-neutral-50/50 rounded-t-2xl flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-neutral-500 font-mono">Interactive AI Interviewer (Connected)</span>
              </div>

              {/* Message scroll area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 max-w-[85%] ${
                      m.sender === "user" ? "ml-auto flex-row-reverse" : ""
                    }`}
                    id={`msg-${m.id}`}
                  >
                    <div className={`rounded-xl p-2.5 border ${
                      m.sender === "user"
                        ? "bg-neutral-50 border-neutral-200 text-neutral-800"
                        : "bg-indigo-50/40 border-indigo-100 text-neutral-900"
                    }`}>
                      <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1.5 block text-right">{m.timestamp}</span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl p-4 bg-indigo-50/20 border border-indigo-50 text-neutral-500 flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-xs font-mono">AI Interviewer is evaluating and formulation next query...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="border-t border-neutral-150 p-4 bg-white rounded-b-2xl flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your structured behavioral example / response here..."
                  className="flex-1 rounded-xl border border-neutral-200 p-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-neutral-50/20"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
                  id="send-msg-btn"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Evaluation loader */}
        {evaluating && (
          <motion.div
            key="eval-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto rounded-2xl border border-neutral-200 bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-4"
            id="eval-loading-card"
          >
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
              <TrendingUp className="h-6 w-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-lg">Synthesizing Session Evaluations</h3>
              <p className="text-sm text-neutral-400 font-mono mt-1">Measuring narrative consistency, depth, and STAR alignment metrics...</p>
            </div>
          </motion.div>
        )}

        {/* Evaluation Output Dashboard */}
        {evaluation && !isSessionActive && !evaluating && (
          <motion.div
            key="evaluation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
            id="evaluation-dashboard"
          >
            {/* Top Score Banner */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-600 font-mono">Session Evaluation Complete</span>
                <h2 className="text-xl font-bold text-neutral-900">Applicant: {candidateName}</h2>
                <p className="text-xs text-neutral-500 font-sans">Role: {jobTitle}</p>
              </div>

              {/* Reset Practice */}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50"
                id="reset-practice-btn"
              >
                <RefreshCw className="h-4 w-4" />
                New Practice Session
              </button>
            </div>

            {/* Score Breakdowns (recharts) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-indigo-600" />
                  Score Metrics
                </h3>

                <div className="h-48" id="evaluation-scores-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -15, right: 10, top: 10, bottom: 10 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={80} style={{ fontSize: "11px", fontWeight: 600, fill: "#525252" }} />
                      <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                      <Bar dataKey="score" radius={6} barSize={20}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between text-xs font-mono border-t border-neutral-100 pt-3">
                  <div>
                    <p className="text-neutral-400">Communication</p>
                    <p className="font-bold text-blue-600">{evaluation.communicationScore}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-400">Technical / Logic</p>
                    <p className="font-bold text-emerald-600">{evaluation.technicalScore}%</p>
                  </div>
                </div>
              </div>

              {/* Overall Recommendation Text */}
              <div className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-500 font-mono flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                    AI Executive Recommendation
                  </h3>
                  <p className="text-neutral-800 text-sm leading-relaxed font-sans">{evaluation.overallRecommendation}</p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-100 text-xs text-emerald-800 font-semibold mt-4">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  Evaluation saved to Candidate profile archives!
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Demonstrated Behavioral Strengths
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                  {evaluation.strengths?.map((str: string, i: number) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-1.5 text-amber-700">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Constructive Improvements / Gaps
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                  {evaluation.improvements?.map((imp: string, i: number) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
