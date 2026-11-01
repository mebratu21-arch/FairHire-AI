import React, { useState } from 'react';
import {
  X,
  Sliders,
  Shield,
  Cpu,
  Bot,
  RefreshCw,
  CheckCircle,
  Database,
  SlidersHorizontal,
  Bell,
  EyeOff,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface PlatformSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunHealthCheck: () => void;
}

export const PlatformSettingsModal: React.FC<PlatformSettingsModalProps> = ({
  isOpen,
  onClose,
  onRunHealthCheck,
}) => {
  const { settings, updateSettings, addNotification } = useCareer();
  const [activeTab, setActiveTab] = useState<'ai' | 'ats' | 'privacy' | 'admin'>('ai');
  const [logs, setLogs] = useState<string[]>([
    'System initialization: All modules loaded.',
    'ATS parser engine: v2.4 initialized with 100-keyword semantic dictionary.',
    'Jobify Studio: STAR interview agent ready.',
    'LinkedIn connector: Graph and endorsement sync operational.',
  ]);

  if (!isOpen) return null;

  const handleTestAudit = () => {
    onClose();
    onRunHealthCheck();
  };

  const handleResetData = () => {
    addNotification('Demo Data Reset', 'Platform state reloaded to clean factory demo benchmark.', 'ats_boost');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-semibold text-white">Platform Settings & Admin Console</h2>
              <p className="text-xs text-slate-400">Configure AI models, ATS parsing rules, and run system health checks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI & Jobify Tuning
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ats'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            ATS Engine Rules
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Privacy & Blind Hiring
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin & Button Health
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-300 text-xs">
          
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <div>
                <label className="font-semibold text-white block mb-1.5">AI Synthesis & Tone Creativity</label>
                <p className="text-slate-400 text-[11px] mb-3">Controls the LLM temperature and lexical variety in tailored resumes and cover letters.</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['precise', 'balanced', 'expressive'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateSettings({ aiCreativity: tone })}
                      className={`p-3 rounded-xl border text-left transition ${
                        settings.aiCreativity === tone
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold capitalize text-xs text-white">{tone}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {tone === 'precise' && 'Strict factual adherence to provided bullet history.'}
                        {tone === 'balanced' && 'Optimal blend of keyword injection and natural flow.'}
                        {tone === 'expressive' && 'High persuasion and impactful executive phrasing.'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Auto-Tailor on Job Application</div>
                  <p className="text-slate-400 text-[11px]">When applying to a job, automatically generate a specialized resume variant.</p>
                </div>
                <button
                  onClick={() => updateSettings({ autoTailorOnApply: !settings.autoTailorOnApply })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.autoTailorOnApply ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                      settings.autoTailorOnApply ? 'translate-x-6' : 'translate-x-1'
                    } top-1 absolute`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ats' && (
            <div className="space-y-5">
              <div>
                <label className="font-semibold text-white block mb-1.5">ATS Filter Strictness Level</label>
                <p className="text-slate-400 text-[11px] mb-3">Defines parsing stringency against Workday, Greenhouse, Taleo, and Lever systems.</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'startup', title: 'Startup / Relaxed', desc: 'Accepts flexible layouts, standard headings, and 50% keyword coverage.' },
                    { id: 'standard', title: 'Enterprise Standard', desc: 'Enforces strict action verbs, 70% keyword match, and contact formats.' },
                    { id: 'strict_faang', title: 'Strict Tier-1 FAANG', desc: 'Demands metrics in 100% of bullets, zero formatting traps, sub-second parsing.' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => updateSettings({ atsStrictness: lvl.id as any })}
                      className={`p-3 rounded-xl border text-left transition ${
                        settings.atsStrictness === lvl.id
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{lvl.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono text-blue-400">ATS Engine Diagnostics</span>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Active Keyword Corpus:</span>
                  <span className="font-mono text-white">450+ Normalized Tech Tokens</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Action Verb Weighting:</span>
                  <span className="font-mono text-emerald-400">1.4x Multiplier Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Blind Hiring / Counterfactual PII Anonymization</div>
                  <p className="text-slate-400 text-[11px]">Redacts candidate name, photos, demographic markers during recruiter screening.</p>
                </div>
                <button
                  onClick={() => updateSettings({ anonymizeProfile: !settings.anonymizeProfile })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.anonymizeProfile ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                      settings.anonymizeProfile ? 'translate-x-6' : 'translate-x-1'
                    } top-1 absolute`}
                  />
                </button>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <p>When enabled, all profile views and ATS evaluations automatically swap names to anonymous candidate IDs (e.g. Candidate #8491) to guarantee unbiased evaluations.</p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-5">
              <div>
                <div className="font-semibold text-white mb-1">Button Reliability & System Diagnostics</div>
                <p className="text-slate-400 text-[11px] mb-3">Execute comprehensive button health audit across LinkedIn, ATS, and Jobify modules.</p>
                <button
                  onClick={handleTestAudit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Run 100% Button Health Audit Now</span>
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] space-y-1">
                <div className="text-slate-500 mb-1 flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  <span>PLATFORM EVENT LOGS</span>
                </div>
                {logs.map((log, idx) => (
                  <div key={idx} className="text-slate-400">
                    <span className="text-emerald-400">&gt;</span> {log}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-rose-400">Factory Reset Demo State</div>
                  <p className="text-slate-500 text-[10px]">Restores all initial jobs, applications, and profile information.</p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs transition"
                >
                  Reset Platform State
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
