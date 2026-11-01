import React, { useState } from 'react';
import {
  Check,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Sparkles,
  Zap,
  Tag,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { KeywordMetric } from '../../types/career';

export const KeywordGapMatrix: React.FC = () => {
  const {
    keywordMetrics,
    selectedTargetJob,
    addKeywordToResume,
    atsBreakdown,
  } = useCareer();

  const [activeFilter, setActiveFilter] = useState<'all' | 'found' | 'missing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMetrics = keywordMetrics.filter((item) => {
    if (activeFilter === 'found' && !item.foundInResume) return false;
    if (activeFilter === 'missing' && item.foundInResume) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchTerm && !item.term.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const foundCount = keywordMetrics.filter((k) => k.foundInResume).length;
  const missingCount = keywordMetrics.filter((k) => !k.foundInResume).length;

  return (
    <div className="space-y-6">
      
      {/* Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Keyword Match Matrix & Gap Analysis</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Target: {selectedTargetJob.title}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Workday and Taleo applicant tracking engines filter candidates who fall below 70% threshold.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              ✓ {foundCount} Found in Resume
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              ⚠ {missingCount} Missing Critical
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                activeFilter === 'all'
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Keywords ({keywordMetrics.length})
            </button>
            <button
              onClick={() => setActiveFilter('missing')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                activeFilter === 'missing'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Missing Critical ({missingCount})
            </button>
            <button
              onClick={() => setActiveFilter('found')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                activeFilter === 'found'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Found ({foundCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical Architecture</option>
              <option value="tool">Tools & Infrastructure</option>
              <option value="methodology">Methodologies</option>
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter keyword..."
              className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 w-36"
            />
          </div>
        </div>
      </div>

      {/* KEYWORD MATRIX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredMetrics.map((kw) => (
          <div
            key={kw.term}
            className={`p-4 rounded-2xl border transition shadow-sm space-y-2.5 ${
              kw.foundInResume
                ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                : 'bg-slate-900/90 border-rose-500/30 shadow-rose-950/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 capitalize">
                  {kw.category.replace('_', ' ')} · {kw.importance}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{kw.term}</h4>
              </div>

              {kw.foundInResume ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  <span>Found ({kw.frequencyInResume}x)</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  <AlertCircle className="w-3 h-3" />
                  <span>Missing</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Required in Job Spec: {kw.frequencyInJob} mentions</span>
              
              {!kw.foundInResume && (
                <button
                  onClick={() => addKeywordToResume(kw.term)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-500/30 transition"
                  title="Inject keyword into resume"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Resume</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
