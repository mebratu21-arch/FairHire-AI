import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Download,
  Copy,
  Check,
  Briefcase,
  FileText,
  Zap,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { JobRequisition, TailoredResume } from '../../types/career';

export const ResumeTailorer: React.FC = () => {
  const {
    jobs,
    selectedTargetJob,
    setSelectedTargetJob,
    tailorResumeForJob,
    tailoredResumes,
    atsBreakdown,
    addApplicationFromJob,
    setCurrentMode,
    addNotification,
  } = useCareer();

  const [activeJobId, setActiveJobId] = useState(selectedTargetJob.id);
  const [activeTailored, setActiveTailored] = useState<TailoredResume | null>(
    tailoredResumes.length > 0 ? tailoredResumes[0] : null
  );
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentJob = jobs.find((j) => j.id === activeJobId) || selectedTargetJob;

  const handleGenerateTailored = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = tailorResumeForJob(currentJob);
      setActiveTailored(result);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopyTailored = () => {
    if (!activeTailored) return;
    const fullText = `TAILORED RESUME — ${activeTailored.targetJobTitle} at ${activeTailored.targetCompany}
ATS SCORE: ${activeTailored.scoreAfter}/100

HEADLINE:
${activeTailored.tailoredHeadline}

EXECUTIVE SUMMARY:
${activeTailored.tailoredSummary}

TARGETED BULLET POINTS:
${activeTailored.optimizedBullets.map((b) => `• ${b}`).join('\n')}

MATCHED KEYWORDS:
${activeTailored.matchedKeywords.join(', ')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyWithTailored = () => {
    addApplicationFromJob(currentJob, 'applied');
    setCurrentMode('application_tracker');
    addNotification('Applied with Tailored Resume', `Application for ${currentJob.company} registered in Kanban Pipeline!`, 'job_match', 'application_tracker');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>1-Click AI Resume Tailorer</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Jobify AI maps your historical achievements directly against requisition requirements, optimizing keyword density and scoring 95+ in ATS filters.
            </p>
          </div>
          <button
            onClick={handleGenerateTailored}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition shrink-0"
          >
            <Zap className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Tailor Resume Now'}</span>
          </button>
        </div>

        {/* Target Job Selector Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Requisition:</span>
            <select
              value={activeJobId}
              onChange={(e) => {
                setActiveJobId(e.target.value);
                const j = jobs.find((x) => x.id === e.target.value);
                if (j) setSelectedTargetJob(j);
              }}
              className="bg-slate-950 text-white font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company} ({job.salaryRange})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Current ATS Match:</span>
            <span className="font-mono font-bold text-blue-400">{currentJob.matchScore}%</span>
          </div>
        </div>
      </div>

      {/* TAILORED RESULT VIEW */}
      {activeTailored ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Top Score Lift Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                AI Optimization Complete
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                {activeTailored.targetJobTitle} — {activeTailored.targetCompany}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Score Jump:</span>
                <span className="font-mono text-slate-400 line-through">{activeTailored.scoreBefore}</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {activeTailored.scoreAfter}/100
                </span>
              </div>

              <button
                onClick={handleCopyTailored}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleApplyWithTailored}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Apply & Track in Kanban</span>
              </button>
            </div>
          </div>

          {/* Tailored Content Sections */}
          <div className="space-y-5 text-xs">
            
            {/* Headline */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Tailored Executive Headline</span>
              <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 font-medium">
                {activeTailored.tailoredHeadline}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Targeted Professional Summary</span>
              <p className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                {activeTailored.tailoredSummary}
              </p>
            </div>

            {/* Optimized Bullets */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Job-Aligned High Impact Bullets</span>
              <div className="space-y-2">
                {activeTailored.optimizedBullets.map((bullet, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-200 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">•</span>
                    <p className="leading-relaxed">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Keywords */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block mb-2">Matched Requisition Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {activeTailored.matchedKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-blue-400 mx-auto" />
          <h4 className="text-base font-bold text-white">Generate Your First Tailored Resume</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Tailor Resume Now" above to dynamically adapt your accomplishments for {currentJob.title} at {currentJob.company}.
          </p>
        </div>
      )}

    </div>
  );
};
