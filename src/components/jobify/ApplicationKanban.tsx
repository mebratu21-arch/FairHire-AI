import React, { useState } from 'react';
import {
  Trello,
  Plus,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  FileCheck2,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { ApplicationCard, ApplicationStage } from '../../types/career';

const STAGES: { id: ApplicationStage; label: string; color: string }[] = [
  { id: 'wishlist', label: 'Wishlist', color: 'border-slate-700 bg-slate-900/60' },
  { id: 'applied', label: 'Applied', color: 'border-blue-500/40 bg-blue-950/20' },
  { id: 'ats_passed', label: 'ATS Passed', color: 'border-cyan-500/40 bg-cyan-950/20' },
  { id: 'interviewing', label: 'Interviewing', color: 'border-indigo-500/40 bg-indigo-950/20' },
  { id: 'offer', label: 'Offer Received', color: 'border-emerald-500/50 bg-emerald-950/30' },
];

export const ApplicationKanban: React.FC = () => {
  const {
    applications,
    moveApplicationStage,
    updateApplicationNotes,
    setCurrentMode,
    addNotification,
  } = useCareer();

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSalary, setNewSalary] = useState('$220k - $270k');

  const handleStartEditNotes = (app: ApplicationCard) => {
    setEditingNotesId(app.id);
    setNotesDraft(app.notes);
  };

  const handleSaveNotes = (appId: string) => {
    updateApplicationNotes(appId, notesDraft);
    setEditingNotesId(null);
  };

  const getNextStage = (current: ApplicationStage): ApplicationStage | null => {
    const stageIds: ApplicationStage[] = ['wishlist', 'applied', 'ats_passed', 'interviewing', 'offer'];
    const idx = stageIds.indexOf(current);
    if (idx >= 0 && idx < stageIds.length - 1) return stageIds[idx + 1];
    return null;
  };

  const getPrevStage = (current: ApplicationStage): ApplicationStage | null => {
    const stageIds: ApplicationStage[] = ['wishlist', 'applied', 'ats_passed', 'interviewing', 'offer'];
    const idx = stageIds.indexOf(current);
    if (idx > 0) return stageIds[idx - 1];
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Trello className="w-5 h-5 text-blue-400" />
              <span>Jobify Application Tracker & Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Track candidate pipeline stages from initial bookmark through ATS resume screening, interview rounds, and accepted offers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMode('job_board')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              Browse Jobs Board
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colApps = applications.filter((a) => a.stage === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-3xl border p-4 flex flex-col min-h-[500px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white tracking-wide">{col.label}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                    {colApps.length}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colApps.map((app) => {
                  const nextStage = getNextStage(app.stage);
                  const prevStage = getPrevStage(app.stage);

                  return (
                    <div
                      key={app.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-2.5 hover:border-slate-700 transition text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h5 className="font-bold text-white text-xs leading-snug">{app.company}</h5>
                          <p className="text-[11px] text-blue-400 font-medium leading-tight">{app.title}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          {app.atsMatchScore}% ATS
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-500" />
                          <span>{app.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{app.location}</span>
                        </div>
                        {app.interviewDate && (
                          <div className="flex items-center gap-1 text-indigo-300 font-medium">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            <span>{app.interviewDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Notes Box */}
                      {editingNotesId === app.id ? (
                        <div className="space-y-1 pt-1">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-950 text-slate-200 text-[11px] p-2 rounded-lg border border-blue-500 focus:outline-none"
                          />
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => handleSaveNotes(app.id)}
                              className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEditNotes(app)}
                          className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 text-[10px] text-slate-300 cursor-pointer hover:border-slate-700 transition"
                          title="Click to edit application notes"
                        >
                          <p className="line-clamp-2 italic">{app.notes || 'Add notes...'}</p>
                        </div>
                      )}

                      {/* Move Stage Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        {prevStage ? (
                          <button
                            onClick={() => moveApplicationStage(app.id, prevStage)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition text-[10px] flex items-center gap-0.5"
                            title={`Move back to ${prevStage}`}
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span className="hidden sm:inline">Back</span>
                          </button>
                        ) : <div />}

                        {nextStage && (
                          <button
                            onClick={() => moveApplicationStage(app.id, nextStage)}
                            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                            title={`Advance to ${nextStage}`}
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}

                {colApps.length === 0 && (
                  <p className="text-[11px] text-slate-500 text-center py-8 italic">No applications in this stage</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
