import React, { useState } from 'react';
import { X, Plus, Trash2, Briefcase, Check, Sparkles } from 'lucide-react';

export type JobCategory =
  | 'all'
  | 'software_cloud'
  | 'ai_data'
  | 'product_design'
  | 'security_devops'
  | 'finance_ops';

export interface ScreeningCriterion {
  id: string;
  name: string;
  weight: number;
  targetKeywords: string[];
}

export interface JobPosting {
  id: string;
  tenantId: string;
  category: JobCategory;
  title: string;
  department: string;
  location: string;
  workplaceType: 'remote' | 'hybrid' | 'onsite';
  language: 'en' | 'he' | 'am';
  status: 'published' | 'draft' | 'archived';
  description: string;
  screeningCriteria: ScreeningCriterion[];
  applicantCount: number;
  createdAt: string;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
  tenantId: string;
  onSave: (job: JobPosting) => void;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  job,
  tenantId,
  onSave,
}) => {
  const [title, setTitle] = useState(job ? job.title : '');
  const [department, setDepartment] = useState(job ? job.department : 'Engineering');
  const [location, setLocation] = useState(job ? job.location : 'Tel Aviv / Remote');
  const [workplaceType, setWorkplaceType] = useState<'remote' | 'hybrid' | 'onsite'>(
    job ? job.workplaceType : 'hybrid'
  );
  const [category, setCategory] = useState<JobCategory>(job ? job.category : 'software_cloud');
  const [language, setLanguage] = useState<'en' | 'he' | 'am'>(job ? job.language : 'en');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    job ? job.status : 'published'
  );
  const [description, setDescription] = useState(
    job
      ? job.description
      : 'Architect low-latency cloud backend systems, strict multi-tenant database isolation, and automated CI/CD pipelines.'
  );

  const [criteria, setCriteria] = useState<ScreeningCriterion[]>(
    job
      ? job.screeningCriteria
      : [
          {
            id: 'c1',
            name: 'Distributed Systems & Cloud Architecture',
            weight: 0.5,
            targetKeywords: ['kubernetes', 'cloud', 'architecture', 'go', 'kafka'],
          },
          {
            id: 'c2',
            name: 'Security & Row-Level Data Isolation',
            weight: 0.5,
            targetKeywords: ['postgresql', 'security', 'isolation', 'rls'],
          },
        ]
  );

  const [newKeywordInput, setNewKeywordInput] = useState<{ [critId: string]: string }>({});

  if (!isOpen) return null;

  const handleAddCriterion = () => {
    const newId = `crit_${Date.now()}`;
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: 'New Objective Competency',
        weight: 0.25,
        targetKeywords: ['leadership', 'optimization'],
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) return;
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddKeyword = (critId: string) => {
    const kw = (newKeywordInput[critId] || '').trim();
    if (!kw) return;
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === critId && !c.targetKeywords.includes(kw)
          ? { ...c, targetKeywords: [...c.targetKeywords, kw] }
          : c
      )
    );
    setNewKeywordInput((prev) => ({ ...prev, [critId]: '' }));
  };

  const handleRemoveKeyword = (critId: string, kwToRemove: string) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === critId
          ? { ...c, targetKeywords: c.targetKeywords.filter((k) => k !== kwToRemove) }
          : c
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedJob: JobPosting = {
      id: job ? job.id : `job_${Date.now()}`,
      tenantId: job ? job.tenantId : tenantId,
      category: category === 'all' ? 'software_cloud' : category,
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      workplaceType,
      language,
      status,
      description: description.trim(),
      screeningCriteria: criteria,
      applicantCount: job ? job.applicantCount : 0,
      createdAt: job ? job.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(savedJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {job ? 'Edit Job Requisition' : 'Create New Requisition'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Tenant: <span className="text-emerald-400 font-mono">{tenantId}</span>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Workplace Model</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as 'remote' | 'hybrid' | 'onsite')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="software_cloud">Software & Cloud</option>
                <option value="ai_data">AI & Data Science</option>
                <option value="product_design">Product & UI/UX</option>
                <option value="security_devops">Security & DevOps</option>
                <option value="finance_ops">Finance & Ops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'he' | 'am')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="en">English (en)</option>
                <option value="he">עברית / Hebrew (he)</option>
                <option value="am">አማርኛ / Amharic (am)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft' | 'archived')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="published">Published (Live for Candidates)</option>
                <option value="draft">Draft (Private)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Screening Criteria & Weights */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Blind Screening Criteria & Keywords (Sum = 100%)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Keywords strictly matched against candidate resume citations.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddCriterion}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Criterion
              </button>
            </div>

            <div className="space-y-3">
              {criteria.map((crit, idx) => (
                <div
                  key={crit.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={crit.name}
                      onChange={(e) =>
                        setCriteria((prev) =>
                          prev.map((c) => (c.id === crit.id ? { ...c, name: e.target.value } : c))
                        )
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100 font-semibold text-xs"
                      placeholder="Criterion Name"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-slate-400 text-[11px]">Weight:</span>
                      <input
                        type="number"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={crit.weight}
                        onChange={(e) =>
                          setCriteria((prev) =>
                            prev.map((c) =>
                              c.id === crit.id
                                ? { ...c, weight: parseFloat(e.target.value) || 0.1 }
                                : c
                            )
                          )
                        }
                        className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-emerald-400 font-mono text-xs text-center"
                      />
                    </div>
                    {criteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(crit.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Remove criterion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Keywords pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {crit.targetKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(crit.id, kw)}
                          className="hover:text-red-400 ml-0.5"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ keyword"
                        value={newKeywordInput[crit.id] || ''}
                        onChange={(e) =>
                          setNewKeywordInput((prev) => ({ ...prev, [crit.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword(crit.id);
                          }
                        }}
                        className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddKeyword(crit.id)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold active:scale-95 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
