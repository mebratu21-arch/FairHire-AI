import React, { useState } from 'react';
import {
  MessageSquare,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Send,
  Zap,
  Mic,
  Lightbulb,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { MockInterviewQuestion, StarEvaluation } from '../../types/career';

export const MockInterviewSimulator: React.FC = () => {
  const {
    interviewQuestions,
    submitInterviewAnswer,
    selectedTargetJob,
    interviewSessions,
  } = useCareer();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [activeEvaluation, setActiveEvaluation] = useState<StarEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);

  const currentQ = interviewQuestions[activeQuestionIndex] || interviewQuestions[0];

  const handleSimulateAnswer = () => {
    setIsSimulatingSpeech(true);
    const sample = `At CloudMatrix, our distributed LLM gateway began hitting high-tail p99 latency spikes of 450ms during peak 18M daily query bursts. My task was to diagnose the root bottleneck and bring response times under 100ms without tripling GPU compute costs. I conducted distributed tracing, removed synchronous Python thread spawning, and rewrote the routing proxy in Go with Redis Cluster semantic caching. As a result, p99 latency dropped by 78% to 92ms, throughput tripled, and annualized cloud costs dropped by $420,000.`;
    setCandidateResponse(sample);
    setTimeout(() => setIsSimulatingSpeech(false), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateResponse.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      const evaluation = submitInterviewAnswer(currentQ.id, candidateResponse);
      setActiveEvaluation(evaluation);
      setIsEvaluating(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <span>Jobify AI Mock Interview Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Practice real-time technical and behavioral interview questions evaluated with the industry-standard STAR methodology (Situation, Task, Action, Result).
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 shrink-0">
            Target: {selectedTargetJob.title}
          </span>
        </div>

        {/* Question Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
          {interviewQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuestionIndex(idx);
                setActiveEvaluation(null);
                setCandidateResponse('');
              }}
              className={`px-3 py-1.5 rounded-xl border font-medium transition ${
                activeQuestionIndex === idx
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Q{idx + 1}: {q.category.toUpperCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* QUESTION CARD & RESPONSE INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INTERVIEWER PROMPT & INPUT */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {currentQ.category.replace('_', ' ')} Question
              </span>
              <span className="text-xs text-slate-400">{currentQ.roleTarget}</span>
            </div>

            <h4 className="text-sm font-semibold text-white leading-relaxed">
              "{currentQ.question}"
            </h4>

            {/* Hints Box */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Interviewer Evaluation Hints</span>
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
                {currentQ.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Response Composer */}
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">Your Candidate Response</label>
              <button
                type="button"
                onClick={handleSimulateAnswer}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                title="Paste a strong example answer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Insert Exemplary Answer</span>
              </button>
            </div>

            <textarea
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="State the Situation, your specific Task, the technical Actions you executed, and quantifiable Results achieved..."
              rows={8}
              className="w-full bg-slate-950 text-slate-200 text-xs p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500/60 leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-slate-500">
                {candidateResponse.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                type="submit"
                disabled={!candidateResponse.trim() || isEvaluating}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <Send className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>{isEvaluating ? 'Grading STAR...' : 'Evaluate Response'}</span>
              </button>
            </div>
          </form>

        </div>

        {/* STAR EVALUATION FEEDBACK */}
        <div className="lg:col-span-6 space-y-4">
          {activeEvaluation ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm animate-in fade-in duration-200">
              
              {/* Overall STAR Score */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">STAR Readiness Score</span>
                  <div className="text-3xl font-extrabold font-mono text-white mt-0.5">
                    {activeEvaluation.totalScore}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    activeEvaluation.totalScore >= 85
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {activeEvaluation.totalScore >= 85 ? 'Strong Hire' : 'Competitive Candidate'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">STAR criteria analyzed</p>
                </div>
              </div>

              {/* 4 STAR Components Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Situation</span>
                    <span className="font-mono text-blue-400">{activeEvaluation.situationScore}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{activeEvaluation.feedback.situation}</p>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Task</span>
                    <span className="font-mono text-cyan-400">{activeEvaluation.taskScore}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{activeEvaluation.feedback.task}</p>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Action</span>
                    <span className="font-mono text-indigo-400">{activeEvaluation.actionScore}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{activeEvaluation.feedback.action}</p>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Result</span>
                    <span className="font-mono text-emerald-400">{activeEvaluation.resultScore}/25</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{activeEvaluation.feedback.result}</p>
                </div>
              </div>

              {/* Key Strengths & Improvements */}
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <h5 className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Demonstrated Strengths</span>
                  </h5>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                    {activeEvaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Actionable Improvements for Round 2</span>
                  </h5>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                    {activeEvaluation.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Ideal Answer */}
              <div className="p-3.5 bg-blue-950/20 border border-blue-500/30 rounded-2xl text-xs space-y-1">
                <span className="text-[10px] uppercase font-mono text-blue-400 font-bold block">
                  Model Ideal Answer Reference
                </span>
                <p className="text-slate-300 leading-relaxed italic text-[11px]">
                  "{activeEvaluation.modelAnswer}"
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[350px]">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Awaiting Candidate Answer</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Submit your response or click "Insert Exemplary Answer" on the left to receive an instant STAR-method grade and critique.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
