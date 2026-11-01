import React, { useState } from 'react';
import {
  FileCheck2,
  Zap,
  Target,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileText,
  Upload,
  ArrowRight,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface AtsScorecardProps {
  onOpenOptimizerTab: () => void;
  onOpenKeywordsTab: () => void;
}

export const AtsScorecard: React.FC<AtsScorecardProps> = ({
  onOpenOptimizerTab,
  onOpenKeywordsTab,
}) => {
  const {
    resumeText,
    setResumeText,
    selectedTargetJob,
    setSelectedTargetJob,
    jobs,
    atsBreakdown,
    auditChecks,
    recomputeAtsScore,
    setCurrentMode,
    tailorResumeForJob,
    addNotification,
  } = useCareer();

  const [isEditingResume, setIsEditingResume] = useState(false);
  const [tempResumeText, setTempResumeText] = useState(resumeText);

  const handleSaveResumeEdit = () => {
    setResumeText(tempResumeText);
    setIsEditingResume(false);
    recomputeAtsScore();
    addNotification('Resume Text Updated', 'ATS engine recalculated all sub-scores and keyword density.', 'ats_boost');
  };

  const handleDownloadAtsResume = () => {
    const element = document.createElement('a');
    const file = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `ATS_Optimized_Resume_${selectedTargetJob.company}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('ATS Resume Downloaded', 'Machine-readable, parse-safe text format saved.', 'ats_boost');
  };

  const scoreColor =
    atsBreakdown.totalScore >= 90
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : atsBreakdown.totalScore >= 75
      ? 'text-blue-400 border-blue-500/40 bg-blue-500/10'
      : 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  return (
    <div className="space-y-6">
      
      {/* TARGET JOB SELECTOR BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Target Role Benchmark</span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedTargetJob.id}
                onChange={(e) => {
                  const job = jobs.find((j) => j.id === e.target.value);
                  if (job) setSelectedTargetJob(job);
                }}
                className="bg-slate-950 text-white font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              tailorResumeForJob(selectedTargetJob);
              setCurrentMode('jobify_studio');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Tailor with Jobify</span>
          </button>

          <button
            onClick={handleDownloadAtsResume}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* OVERALL SCORECARD & SUB-SCORES BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BIG CIRCULAR GAUGE CARD */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-4">
            <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${scoreColor}`}>
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {atsBreakdown.totalScore}
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">/ 100 PTS</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            {atsBreakdown.totalScore >= 90
              ? 'Excellent ATS Match Ready'
              : atsBreakdown.totalScore >= 75
              ? 'Strong Contender — Fine Tuning Advised'
              : 'Keyword Gaps Detected'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
            Scored against Workday, Greenhouse & Taleo parse models for <strong className="text-slate-200">{selectedTargetJob.title}</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Matched Keywords</span>
              <p className="text-sm font-bold text-white font-mono mt-0.5">
                {atsBreakdown.totalKeywordsMatched} / {atsBreakdown.totalKeywordsRequired}
              </p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Measurable Metrics</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {atsBreakdown.quantifiableMetricsCount} Instances
              </p>
            </div>
          </div>
        </div>

        {/* 4 SUB-SCORE METRIC BARS */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Four-Pillar ATS Breakdown</h3>
            <span className="text-xs text-slate-400">Real-Time Algorithmic Analysis</span>
          </div>

          <div className="space-y-4">
            
            {/* 1. Keyword Relevance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">1. Keyword Relevance & Frequency</span>
                <span className="font-mono text-blue-400 font-bold">{atsBreakdown.keywordScore} / 35 pts</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(atsBreakdown.keywordScore / 35) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Evaluates exact & semantic matches against role requirements</span>
                <button onClick={onOpenKeywordsTab} className="text-blue-400 hover:underline">View Matrix →</button>
              </p>
            </div>

            {/* 2. Quantifiable Impact & Action Verbs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">2. Action Verbs & Quantified Results</span>
                <span className="font-mono text-emerald-400 font-bold">{atsBreakdown.impactScore} / 25 pts</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(atsBreakdown.impactScore / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{atsBreakdown.actionVerbsCount} strong action verbs, {atsBreakdown.quantifiableMetricsCount} quantified metrics</span>
                <button onClick={onOpenOptimizerTab} className="text-emerald-400 hover:underline">Optimize Bullets →</button>
              </p>
            </div>

            {/* 3. ATS Format & Parseability */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">3. ATS Formatting & Machine Parseability</span>
                <span className="font-mono text-cyan-400 font-bold">{atsBreakdown.formatScore} / 20 pts</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${(atsBreakdown.formatScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Clean font, standard bullet points, zero rasterized table blockers</p>
            </div>

            {/* 4. Section Structure & Contact */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">4. Structure, Headers & Contact Completeness</span>
                <span className="font-mono text-purple-400 font-bold">{atsBreakdown.structureScore} / 20 pts</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(atsBreakdown.structureScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Header contact verified, reverse-chronological sections intact</p>
            </div>

          </div>
        </div>

      </div>

      {/* LIVE AUDIT FINDINGS CHECKLIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">ATS Parser Audit Verification Checklist</h3>
          <span className="text-xs text-slate-400">{auditChecks.filter((c) => c.status === 'passed').length} / {auditChecks.length} Passed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {auditChecks.map((check) => (
            <div
              key={check.id}
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition ${
                check.status === 'passed'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                  : check.status === 'warning'
                  ? 'bg-amber-500/5 border-amber-500/20 text-slate-200'
                  : 'bg-rose-500/5 border-rose-500/20 text-slate-200'
              }`}
            >
              {check.status === 'passed' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold text-white">{check.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{check.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT / VIEW CURRENT RAW RESUME TEXT */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Active Resume Corpus for Parser</h3>
            <p className="text-xs text-slate-400">Edit directly or paste updates to recalculate ATS score immediately</p>
          </div>
          {isEditingResume ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveResumeEdit}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
              >
                Save & Recalculate
              </button>
              <button
                onClick={() => setIsEditingResume(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempResumeText(resumeText);
                setIsEditingResume(true);
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700"
            >
              Edit Text
            </button>
          )}
        </div>

        {isEditingResume ? (
          <textarea
            value={tempResumeText}
            onChange={(e) => setTempResumeText(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-4 rounded-2xl border border-blue-500/60 focus:outline-none leading-relaxed"
          />
        ) : (
          <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
            {resumeText}
          </pre>
        )}
      </div>

    </div>
  );
};
