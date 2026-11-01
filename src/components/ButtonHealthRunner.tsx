import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';

export interface ButtonTestItem {
  id: string;
  category: 'candidate' | 'recruiter' | 'ai' | 'settings_share' | 'navigation';
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  latencyMs?: number;
  lastRunMessage?: string;
  action: () => Promise<string> | string;
}

interface ButtonHealthRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  tests: ButtonTestItem[];
  onRunTest: (testId: string) => Promise<void>;
  onRunAll: () => Promise<void>;
  isRunningAll: boolean;
  onResetAll: () => void;
}

export const ButtonHealthRunner: React.FC<ButtonHealthRunnerProps> = ({
  isOpen,
  onClose,
  tests,
  onRunTest,
  onRunAll,
  isRunningAll,
  onResetAll,
}) => {
  const [filterCat, setFilterCat] = useState<'all' | ButtonTestItem['category']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTests = tests.filter((t) => {
    const matchCat = filterCat === 'all' || t.category === filterCat;
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const idleCount = tests.filter((t) => t.status === 'idle').length;
  const runningCount = tests.filter((t) => t.status === 'running').length;
  const totalCount = tests.length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const avgLatency =
    passedCount > 0
      ? Math.round(
          tests
            .filter((t) => t.status === 'passed' && typeof t.latencyMs === 'number')
            .reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / Math.max(passedCount, 1)
        )
      : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Button Health & Interactive Test Runner
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Live Audit Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated synthetic audit verifying 100% of candidate, recruiter, AI, and admin buttons.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px] font-medium">Passed Workflows</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 flex items-center gap-1.5">
              <span>{passedCount}</span>
              <span className="text-xs text-slate-500 font-normal">/ {totalCount}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">{passRate}% Pass Rate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px] font-medium">Execution Status</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
              {isRunningAll ? (
                <span className="text-amber-400 flex items-center gap-1.5 text-base sm:text-lg">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running...
                </span>
              ) : failedCount > 0 ? (
                <span className="text-rose-400">{failedCount} Failed</span>
              ) : passedCount === totalCount ? (
                <span className="text-emerald-400">All Passed</span>
              ) : (
                <span className="text-slate-300">{idleCount} Ready</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{runningCount} Active Jobs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px] font-medium">Average Latency</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {avgLatency} <span className="text-xs font-normal">ms</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Immediate React Mutation</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px] font-medium">Feedback Type</div>
            <div className="text-base sm:text-lg font-bold text-teal-400 truncate">
              Toasts + Mutate
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Zero Silent Failures</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Overall Verification Progress</span>
            <span>
              {passedCount} / {totalCount} ({passRate}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${passRate}%` }}
            />
          </div>
        </div>

        {/* Controls: Run All, Reset, Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRunAll}
              disabled={isRunningAll}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {isRunningAll ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Testing All Buttons...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run All Button Tests ({totalCount})
                </>
              )}
            </button>

            <button
              onClick={onResetAll}
              disabled={isRunningAll}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 active:scale-95 transition disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset State
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'candidate', label: 'Candidate' },
                { id: 'recruiter', label: 'Recruiter' },
                { id: 'ai', label: 'AI Copilot' },
                { id: 'settings_share', label: 'Settings & Share' },
                { id: 'navigation', label: 'Nav & Lang' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition font-medium ${
                  filterCat === cat.id
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tests List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[260px] max-h-[380px]">
          {filteredTests.map((test) => {
            const isRunning = test.status === 'running';
            const isPassed = test.status === 'passed';
            const isFailed = test.status === 'failed';

            return (
              <div
                key={test.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isPassed
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : isFailed
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : isRunning
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">{test.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                      {test.category}
                    </span>
                    {isPassed && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" />
                        PASSED
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        FAILED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{test.description}</p>
                  {test.lastRunMessage && (
                    <div className="text-[10px] text-emerald-300/90 font-mono mt-0.5">
                      ✓ {test.lastRunMessage}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {typeof test.latencyMs === 'number' && (
                    <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                      {test.latencyMs}ms
                    </span>
                  )}
                  <button
                    onClick={() => onRunTest(test.id)}
                    disabled={isRunning || isRunningAll}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition ${
                      isPassed
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    } disabled:opacity-50`}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Running
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
          <div>
            Showing {filteredTests.length} of {totalCount} verified button actions
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold active:scale-95 transition"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
