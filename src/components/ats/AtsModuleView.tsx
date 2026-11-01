import React, { useState } from 'react';
import {
  FileCheck2,
  Table,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AtsScorecard } from './AtsScorecard';
import { KeywordGapMatrix } from './KeywordGapMatrix';
import { BulletOptimizer } from './BulletOptimizer';
import { useCareer } from '../../context/CareerContext';

export const AtsModuleView: React.FC = () => {
  const { atsBreakdown } = useCareer();
  const [activeTab, setActiveTab] = useState<'scorecard' | 'matrix' | 'optimizer'>('scorecard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* ATS SUB-NAVIGATION STRIP */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'scorecard'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>0–100 Scorecard & Audit</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
              {atsBreakdown.totalScore}/100
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'matrix'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Keyword Gap Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeTab === 'optimizer'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bullet Impact Optimizer</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'scorecard' && (
        <AtsScorecard
          onOpenKeywordsTab={() => setActiveTab('matrix')}
          onOpenOptimizerTab={() => setActiveTab('optimizer')}
        />
      )}

      {activeTab === 'matrix' && <KeywordGapMatrix />}

      {activeTab === 'optimizer' && <BulletOptimizer />}

    </div>
  );
};
