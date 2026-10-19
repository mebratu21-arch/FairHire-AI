'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Shield,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Lock,
  ArrowRight,
  UserCheck,
  XCircle,
  Clock,
  ExternalLink,
  Quote,
  FileCheck2,
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations();
  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isUnmasked, setIsUnmasked] = useState(false);
  const [unmaskReason, setUnmaskReason] = useState('');
  const [showUnmaskModal, setShowUnmaskModal] = useState(false);

  const handleDecision = (type: string) => {
    if (!reason.trim()) {
      alert(t('candidates.reasonRequired'));
      return;
    }
    setDecision(type);
  };

  const handleUnmaskConfirm = () => {
    if (!unmaskReason.trim()) {
      alert(t('candidates.reasonRequired'));
      return;
    }
    setIsUnmasked(true);
    setShowUnmaskModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Architecture & Trust Guard */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-indigo-950/70 p-6 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DECISION SUPPORT • HUMAN IN THE LOOP</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              FairHire AI Workspace
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Evaluating CVs strictly against recruiter-defined criteria with cited evidence quotes.
              Protected attributes (gender, age cues, origin, military units) are redacted before AI scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-xs text-slate-400">Open Jobs</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400">12</div>
              <div className="text-xs text-slate-400">Awaiting Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Screening Protocol</span>
            <EyeOff className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">Blind Review</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Redaction Active (Israeli Law)</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Evidence Grounding</span>
            <Quote className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">100% Verified</div>
          <div className="text-xs text-slate-400 mt-1">Quotes verified against source text</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Audit Integrity</span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white">Hash Chained</div>
          <div className="text-xs text-indigo-400 mt-1">Append-only SHA-256 ledger</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Security & Multi-Tenant</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">Postgres RLS</div>
          <div className="text-xs text-cyan-400 mt-1">Zero cross-tenant leakage</div>
        </div>
      </div>

      {/* Main Feature Demo: Candidate Blind Review & Evidence Screen */}
      <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold">
              #42
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {isUnmasked ? 'Yael Cohen (Unmasked)' : 'Candidate CV-00042 (Pseudonymous)'}
                </h2>
                {!isUnmasked ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    BLIND MODE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/80 text-amber-400 border border-amber-800/50">
                    AUDITED UNMASK
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Applied for: <span className="text-slate-200 font-medium">Senior Backend Engineer (Tel Aviv)</span> • Uploaded 2 hours ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isUnmasked && (
              <button
                type="button"
                onClick={() => setShowUnmaskModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('candidates.unmask')}</span>
              </button>
            )}

            <div className="text-end ps-3 border-s border-slate-800">
              <div className="text-2xl font-black text-blue-400">88<span className="text-sm text-slate-400 font-normal">/100</span></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Deterministic Score</div>
            </div>
          </div>
        </div>

        {/* Unmask Reason Modal */}
        {showUnmaskModal && (
          <div className="p-6 bg-amber-950/30 border-b border-amber-800/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-amber-200">{t('candidates.unmaskWarning')}</h3>
                  <p className="text-xs text-amber-300/80">
                    Equal employment compliance requires documenting why candidate identity was revealed prior to final interview kit.
                  </p>
                </div>
                <input
                  type="text"
                  value={unmaskReason}
                  onChange={(e) => setUnmaskReason(e.target.value)}
                  placeholder={t('candidates.unmaskReason')}
                  className="w-full bg-slate-900 border border-amber-700/60 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUnmaskConfirm}
                    className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                  >
                    Confirm & Record in Audit Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUnmaskModal(false)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Criterion-by-Criterion Evaluation with Cited Evidence */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-400" />
                <span>Screening Rubric & Cited Quotes</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Model: gemini-2.0-flash-001 • Temp: 0.0</span>
            </div>

            {/* Criterion 1 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                    MUST HAVE • Weight 10
                  </span>
                  <span className="text-sm font-semibold text-slate-200">5+ years backend TypeScript & Node.js</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Rating: 3 / 3 (Strong)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  &ldquo;Developed high-scale distributed backend services with PostgreSQL and Redis over 7 years.&rdquo;
                </span>
                <span className="ms-auto text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            {/* Criterion 2 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                    MUST HAVE • Weight 8
                  </span>
                  <span className="text-sm font-semibold text-slate-200">PostgreSQL architecture and performance</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Rating: 2 / 3 (Clear)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  &ldquo;Designed database schemas and indexing strategies for multi-tenant applications in PostgreSQL.&rdquo;
                </span>
                <span className="ms-auto text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            {/* Criterion 3 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    NICE TO HAVE • Weight 5
                  </span>
                  <span className="text-sm font-semibold text-slate-200">Bilingual RTL / Hebrew UI localization</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Rating: 3 / 3 (Strong)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  &ldquo;Built accessible user interfaces with RTL support and internationalization for Hebrew and English users.&rdquo;
                </span>
                <span className="ms-auto text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            {/* Bias Risk Notes Box (Section 8) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bias Risk Notes (Awareness Only)</span>
                </span>
                <span className="text-[11px] text-slate-400">Never modifies the score</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div className="text-slate-400">
                  • <strong className="text-slate-200">[MILITARY_SERVICE]</strong> Redacted before scoring model. Original CV referenced service in intelligence; eliminated as potential bias vector.
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Human Decision Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Human Recruiter Decision</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                FairHire never auto-advances or auto-rejects. Record your decision and required rationale below.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  {t('candidates.reasonRequired')} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('candidates.reasonPlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {decision ? (
                <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>
                    Decision Recorded: <strong className="uppercase">{decision}</strong>
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision('shortlist')}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('candidates.shortlist')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('hold')}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('candidates.hold')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('reject')}
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('candidates.reject')}</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                Candidate ID: cand_cm20918 <br />
                Audit event will be cryptographically chained.
              </div>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Extraction Metadata
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Language Mix:</span>
                <span className="font-mono text-blue-400">HE: 80% • EN: 20%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Parse Confidence:</span>
                <span className="font-mono text-emerald-400">98% (High)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hidden Text / Injection:</span>
                <span className="font-mono text-emerald-400">Clean (0 signals)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
