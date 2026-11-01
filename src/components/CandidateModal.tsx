import React, { useState } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  MessageSquare,
  ShieldCheck,
  Check,
  ChevronRight,
  UserCheck,
  UserX,
} from 'lucide-react';

export interface Application {
  id: string;
  tenantId: string;
  jobId: string;
  jobTitle: string;
  category: string;
  candidateToken: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  overallScore: number;
  verifiedQuotesValid: boolean;
  verifiedQuotes: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  redactedCv: string;
  candidateLanguage: string;
  notes: string[];
  createdAt: string;
}

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Application | null;
  onUpdateStage: (appId: string, stage: Application['stage']) => void;
  onAddNote: (appId: string, note: string) => void;
  onDispatchInvite: (candidate: Application) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onUpdateStage,
  onAddNote,
  onDispatchInvite,
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !candidate) return null;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(candidate.id, newNote.trim());
    setNewNote('');
  };

  const stages: Array<{ id: Application['stage']; label: string; color: string }> = [
    { id: 'applied', label: '1. Applied', color: 'hover:border-slate-500' },
    { id: 'screening', label: '2. Screening', color: 'hover:border-cyan-500' },
    { id: 'interview', label: '3. Interview', color: 'hover:border-amber-500' },
    { id: 'offer', label: '4. Offer Extended', color: 'hover:border-emerald-500' },
    { id: 'rejected', label: 'Rejected', color: 'hover:border-rose-500' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm border border-emerald-500/30">
              {candidate.candidateToken.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  {candidate.candidateToken}
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {candidate.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                  Stage: {candidate.stage}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Applied for <span className="text-emerald-400 font-semibold">{candidate.jobTitle}</span> on {candidate.createdAt}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verified Score Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400">Objective Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                {candidate.overallScore}
              </span>
              <span className="text-slate-500 font-mono text-xs font-semibold">/ 100</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Zero Demographic Bias · Verified Substring Evidence
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDispatchInvite(candidate)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition shadow-lg shadow-cyan-500/20"
            >
              <Mail className="w-4 h-4" />
              Dispatch Interview Invite
            </button>
          </div>
        </div>

        {/* Pipeline Stage Transitions Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Fast Pipeline Stage Transition:</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {stages.map((st) => {
              const isCurrent = candidate.stage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onUpdateStage(candidate.id, st.id)}
                  className={`p-2.5 rounded-xl border text-center transition font-semibold flex items-center justify-center gap-1 active:scale-95 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                      : `bg-slate-950 border-slate-800 text-slate-300 ${st.color}`
                  }`}
                >
                  {isCurrent && <Check className="w-3.5 h-3.5" />}
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyword Evidence & Exact Citations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Matched & Missing Keywords */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Matched Keywords ({candidate.matchedKeywords.length}):
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {candidate.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>

            {candidate.missingKeywords.length > 0 && (
              <>
                <div className="font-semibold text-slate-400 text-[11px] pt-1">
                  Missing Competencies:
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {candidate.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 text-[11px] line-through"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Substring Citations */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-400" />
              Verified Substring Quotes ({candidate.verifiedQuotes.length}):
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {candidate.verifiedQuotes.map((q, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic leading-snug"
                >
                  "{q}"
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Screening Notes & Collaborative Feedback */}
        <div className="space-y-3 border-t border-slate-800 pt-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Recruiter Screening Notes ({candidate.notes.length})
            </span>
          </div>

          {candidate.notes.length > 0 && (
            <div className="space-y-2">
              {candidate.notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-sans"
                >
                  {note}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add interview assessment note or next steps..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold active:scale-95 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Add Note
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold active:scale-95 transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
