import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe2,
  Building,
  Bookmark,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { JobRequisition } from '../../types/career';

interface JobDiscoveryBoardProps {
  onOpenShare: () => void;
}

export const JobDiscoveryBoard: React.FC<JobDiscoveryBoardProps> = ({ onOpenShare }) => {
  const {
    jobs,
    setSelectedTargetJob,
    tailorResumeForJob,
    addApplicationFromJob,
    setCurrentMode,
    addNotification,
  } = useCareer();

  const [search, setSearch] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState<'all' | 'remote' | 'hybrid' | 'onsite'>('all');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobRequisition>(jobs[0]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const filteredJobs = jobs.filter((job) => {
    if (workplaceFilter !== 'all' && job.workplaceType !== workplaceFilter) return false;
    if (
      search &&
      !job.title.toLowerCase().includes(search.toLowerCase()) &&
      !job.company.toLowerCase().includes(search.toLowerCase()) &&
      !job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    addNotification('Job Saved', 'Job bookmark saved to your wishlist.', 'job_match', 'application_tracker');
  };

  const handleTailorAndOpen = (job: JobRequisition) => {
    setSelectedTargetJob(job);
    tailorResumeForJob(job);
    setCurrentMode('jobify_studio');
  };

  const handleAuditInAts = (job: JobRequisition) => {
    setSelectedTargetJob(job);
    setCurrentMode('ats_checker');
  };

  const handleEasyApply = (job: JobRequisition) => {
    addApplicationFromJob(job, 'applied');
    setCurrentMode('application_tracker');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* SEARCH & FILTERS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or tech stack (e.g. Kubernetes, LLMs)..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'remote', 'hybrid', 'onsite'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setWorkplaceFilter(type)}
                className={`px-3 py-2 text-xs rounded-xl border font-medium capitalize transition ${
                  workplaceFilter === type
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* JOBS SPLIT VIEW: Listings on Left, Selected Job Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Job Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredJobs.map((job) => {
            const isSelected = selectedJobDetail.id === job.id;
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobDetail(job)}
                className={`bg-slate-900 border rounded-2xl p-4.5 cursor-pointer transition shadow-sm space-y-3 ${
                  isSelected
                    ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{job.title}</h4>
                      <p className="text-xs text-blue-400 font-medium">{job.company}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{job.location} · {job.postedAgo}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="font-semibold text-white">{job.salaryRange}</span>
                  <span className="capitalize text-[11px] text-slate-500">{job.workplaceType}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Full Job Details Preview & Instant Actions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-20 self-start">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex gap-4">
              <img
                src={selectedJobDetail.companyLogo}
                alt={selectedJobDetail.company}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-800 shrink-0"
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{selectedJobDetail.title}</h3>
                <p className="text-sm text-blue-400 font-medium">{selectedJobDetail.company} · {selectedJobDetail.department}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedJobDetail.location}</span>
                  <span>·</span>
                  <span className="capitalize">{selectedJobDetail.workplaceType}</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">{selectedJobDetail.salaryRange}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSaveJob(selectedJobDetail.id)}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 self-start"
              title="Bookmark Job"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row: Easy Apply, Tailor with Jobify, Audit in ATS */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleEasyApply(selectedJobDetail)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Easy Apply & Track</span>
            </button>

            <button
              onClick={() => handleTailorAndOpen(selectedJobDetail)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tailor Resume with Jobify</span>
            </button>

            <button
              onClick={() => handleAuditInAts(selectedJobDetail)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Audit ATS Match ({selectedJobDetail.matchScore}%)</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div>
              <h4 className="text-xs uppercase font-mono text-slate-400 font-bold mb-1.5">Overview</h4>
              <p>{selectedJobDetail.description}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-mono text-slate-400 font-bold mb-1.5">Key Responsibilities</h4>
              <ul className="list-disc pl-4 space-y-1">
                {selectedJobDetail.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-mono text-slate-400 font-bold mb-1.5">Required Skills & Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJobDetail.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-blue-300 border border-slate-800 text-[11px] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
