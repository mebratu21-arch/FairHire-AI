import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Check,
  Building,
  User,
  Sliders,
  Send,
  RefreshCw,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

export const CoverLetterGenerator: React.FC = () => {
  const {
    jobs,
    selectedTargetJob,
    generateCoverLetter,
    coverLetters,
    addNotification,
    triggerConfetti,
  } = useCareer();

  const [company, setCompany] = useState(selectedTargetJob.company);
  const [jobTitle, setJobTitle] = useState(selectedTargetJob.title);
  const [hiringManager, setHiringManager] = useState('Engineering Leadership');
  const [tone, setTone] = useState<'executive' | 'confident' | 'modern' | 'technical'>('executive');
  const [customNotes, setCustomNotes] = useState('');

  const [activeLetterContent, setActiveLetterContent] = useState<string>(
    coverLetters.length > 0
      ? coverLetters[0].content
      : ''
  );
  const [copied, setCopied] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleGenerate = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const record = generateCoverLetter(jobTitle, company, hiringManager, tone, customNotes);
      setActiveLetterContent(record.content);
      setIsSynthesizing(false);
      triggerConfetti();
    }, 400);
  };

  const handleCopy = () => {
    if (!activeLetterContent) return;
    navigator.clipboard.writeText(activeLetterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeLetterContent) return;
    const element = document.createElement('a');
    const file = new Blob([activeLetterContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${company.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('Cover Letter Downloaded', 'Saved as text document.', 'job_match');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Dynamic Cover Letter Synthesizer</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Craft targeted, high-converting cover letters that match recruiter psychology and align with your ATS verified credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Generation Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm text-xs">
          <h4 className="text-sm font-bold text-white">Target Requisition & Tone</h4>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target Role / Position</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Hiring Manager or Team Name</label>
              <input
                type="text"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="e.g. Dr. Aris Thorne or VP of Engineering"
                className="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5">Writing Tone Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'executive', name: 'Executive & Authoritative' },
                  { id: 'technical', name: 'Technical Deep-Dive' },
                  { id: 'confident', name: 'Confident & High-Energy' },
                  { id: 'modern', name: 'Modern & Collaborative' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as any)}
                    className={`p-2 rounded-xl border text-left transition ${
                      tone === t.id
                        ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] block">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Specific Accomplishments or Alignment (Optional)</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Excited about your recent multi-region expansion; experienced with Kubernetes v1.30..."
                className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isSynthesizing || !company || !jobTitle}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Generate High-Converting Letter'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Cover Letter Output */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Synthesized Letter</h4>
              <span className="text-[11px] text-slate-400 capitalize">{tone} Style · Formatted for Recruiter Screen</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!activeLetterContent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!activeLetterContent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {activeLetterContent ? (
            <textarea
              value={activeLetterContent}
              onChange={(e) => setActiveLetterContent(e.target.value)}
              rows={16}
              className="w-full flex-1 bg-slate-950 font-sans text-xs text-slate-200 p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500/50 leading-relaxed resize-none"
            />
          ) : (
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <FileText className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400">Select parameters on the left and click Generate to synthesize your cover letter.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
