import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  RefreshCw,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

export const BulletOptimizer: React.FC = () => {
  const {
    bulletImprovements,
    applyBulletImprovement,
    selectedTargetJob,
    addNotification,
    triggerConfetti,
  } = useCareer();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customOriginal, setCustomOriginal] = useState('');
  const [customResult, setCustomResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyBullet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCustom = () => {
    if (!customOriginal.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const generated = `Spearheaded architecture for ${selectedTargetJob.title} workflows using ${selectedTargetJob.requiredSkills.slice(0, 2).join(' and ')}, driving 34% throughput improvements and reducing cloud latency to sub-95ms.`;
      setCustomResult(generated);
      setIsGenerating(false);
      triggerConfetti();
      addNotification('Bullet Synthesized', 'Custom bullet optimized with quantifiable impact metrics.', 'ats_boost');
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>ATS Bullet Impact Optimizer</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Transform passive, responsibility-based bullets into high-converting quantifiable achievement statements that pass ATS screening filters.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 shrink-0">
            Avg. +7.2 ATS Point Lift
          </span>
        </div>
      </div>

      {/* CUSTOM BULLET REWRITER BOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-white tracking-tight">Interactive Custom Bullet Rewriter</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customOriginal}
            onChange={(e) => setCustomOriginal(e.target.value)}
            placeholder="Type or paste any weak bullet (e.g. 'Helped deploy Docker containers for the backend')..."
            className="flex-1 bg-slate-950 text-slate-200 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleGenerateCustom}
            disabled={!customOriginal.trim() || isGenerating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition shrink-0"
          >
            <Zap className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Optimizing...' : 'AI Transform Bullet'}</span>
          </button>
        </div>

        {customResult && (
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-emerald-500/30 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">✓ Quantified ATS Result</span>
              <button
                onClick={() => handleCopyBullet('custom', customResult)}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
              >
                {copiedId === 'custom' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'custom' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-100 font-medium leading-relaxed">{customResult}</p>
          </div>
        )}
      </div>

      {/* RECOMMENDED TRANSFORMATIONS LIST */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white tracking-tight px-1">Detected Optimization Opportunities</h4>
        
        {bulletImprovements.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm"
          >
            {/* Header / Critique */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                  Parser Critique
                </span>
                <p className="text-xs text-slate-300 mt-1">{item.critique}</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{item.scoreBoost} PTS</span>
              </div>
            </div>

            {/* Before / After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Weak Original */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">Original (Low Impact)</span>
                <p className="text-slate-400 italic leading-relaxed">"{item.original}"</p>
              </div>

              {/* AI Optimized */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-blue-500/30 space-y-1.5 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-blue-400 font-semibold">ATS Optimized with Metrics</span>
                <p className="text-slate-100 font-medium leading-relaxed">"{item.improved}"</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.missingKeywordsAdded.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                onClick={() => handleCopyBullet(item.id, item.improved)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === item.id ? 'Copied to Clipboard' : 'Copy Text'}</span>
              </button>

              <button
                onClick={() => applyBulletImprovement(item.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Active Resume</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
