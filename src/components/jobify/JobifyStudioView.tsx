import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Bot,
  Trello,
} from 'lucide-react';
import { ResumeTailorer } from './ResumeTailorer';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { MockInterviewSimulator } from './MockInterviewSimulator';
import { ApplicationKanban } from './ApplicationKanban';

export const JobifyStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tailorer' | 'cover_letter' | 'interview' | 'kanban'>('tailorer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* JOBIFY SUB-NAVIGATION STRIP */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('tailorer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'tailorer'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Resume Tailorer</span>
          </button>

          <button
            onClick={() => setActiveTab('cover_letter')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'cover_letter'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dynamic Cover Letter</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'interview'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Mock Interview (STAR)</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'kanban'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <Trello className="w-3.5 h-3.5" />
            <span>Application Kanban</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'tailorer' && <ResumeTailorer />}
      {activeTab === 'cover_letter' && <CoverLetterGenerator />}
      {activeTab === 'interview' && <MockInterviewSimulator />}
      {activeTab === 'kanban' && <ApplicationKanban />}

    </div>
  );
};
