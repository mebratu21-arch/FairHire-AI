import React, { useState } from 'react';
import {
  Edit3,
  Plus,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  ThumbsUp,
  Share2,
  Download,
  CheckCircle2,
  Zap,
  Globe,
  MapPin,
  Building,
  Check,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface ProfileBuilderProps {
  onOpenShare: () => void;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onOpenShare }) => {
  const {
    profile,
    updateProfile,
    endorseSkill,
    addSkill,
    setCurrentMode,
    addNotification,
    triggerConfetti,
  } = useCareer();

  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState(profile.headline);

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(profile.about);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'hard' | 'soft' | 'tool'>('hard');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  const handleSaveHeadline = () => {
    updateProfile({ headline: headlineDraft });
    setIsEditingHeadline(false);
  };

  const handleSaveAbout = () => {
    updateProfile({ about: aboutDraft });
    setIsEditingAbout(false);
  };

  const handleAiEnhanceAbout = () => {
    const enhanced = `Results-driven Principal Systems Architect with 10+ years architecting fault-tolerant distributed platforms, high-throughput microservices, and enterprise LLM inference infrastructure. Proven track record scaling real-time gateways to 18M+ daily requests, cutting p99 tail latency from 450ms to 92ms, and driving over $420,000 in annualized cloud savings. Passionate about empowering engineering organizations, modern consensus design, and production AI reliability.`;
    setAboutDraft(enhanced);
    updateProfile({ about: enhanced });
    setIsEditingAbout(false);
    triggerConfetti();
    addNotification('About Section AI-Enhanced', 'Transformed with executive impact and quantifiable metrics!', 'ats_boost');
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill(newSkillName, newSkillCategory);
    setNewSkillName('');
    setShowAddSkillInput(false);
    addNotification('Skill Added & Endorsed', `"${newSkillName}" is now active on your profile and ATS scan.`, 'ats_boost');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* PROFILE HEADER CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
          <img
            src={profile.bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onOpenShare}
              className="p-2 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition shadow-md"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative inline-block">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 sm:w-32 h-28 sm:h-32 rounded-full object-cover ring-4 ring-slate-900 shadow-2xl"
              />
              {profile.openToWork && (
                <span className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-md">
                  #OpenToWork
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => updateProfile({ openToWork: !profile.openToWork })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                  profile.openToWork
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {profile.openToWork ? '✓ Open to Work Active' : '+ Set Open to Work'}
              </button>

              <button
                onClick={() => setCurrentMode('ats_checker')}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Audit in ATS Scorer</span>
              </button>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
              <span title="Verified Profile">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              </span>
            </div>

            {/* Headline with in-place edit */}
            {isEditingHeadline ? (
              <div className="space-y-2 max-w-2xl">
                <textarea
                  value={headlineDraft}
                  onChange={(e) => setHeadlineDraft(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-blue-500/60 focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveHeadline}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingHeadline(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between group max-w-3xl">
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  {profile.headline}
                </p>
                <button
                  onClick={() => setIsEditingHeadline(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition ml-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Meta Row: Company, Location, Connections */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                {profile.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {profile.location}
              </span>
              <span className="text-blue-400 font-medium">
                {profile.connectionsCount}+ connections
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ABOUT / SUMMARY SECTION */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">About & Executive Summary</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiEnhanceAbout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Enhance with Metrics</span>
            </button>
            <button
              onClick={() => setIsEditingAbout(!isEditingAbout)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditingAbout ? (
          <div className="space-y-3">
            <textarea
              value={aboutDraft}
              onChange={(e) => setAboutDraft(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 text-slate-200 text-xs p-3.5 rounded-xl border border-blue-500/60 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveAbout}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                Save About
              </button>
              <button
                onClick={() => setIsEditingAbout(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {profile.about}
          </p>
        )}
      </section>

      {/* WORK EXPERIENCE */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Experience</h2>
          </div>
          <button
            onClick={() => setCurrentMode('ats_checker')}
            className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Optimize Bullets in ATS</span>
            <Zap className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-6 divide-y divide-slate-800/80">
          {profile.experiences.map((exp) => (
            <div key={exp.id} className="pt-6 first:pt-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                  <p className="text-xs text-blue-400 font-medium">{exp.company} · {exp.location}</p>
                </div>
                <span className="text-xs font-mono text-slate-400">{exp.period}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-outside pl-4">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS & ENDORSEMENTS */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Skills & Endorsements</h2>
          </div>
          <button
            onClick={() => setShowAddSkillInput(!showAddSkillInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddSkillInput && (
          <form onSubmit={handleAddSkillSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap gap-2.5 items-center">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Apache Cassandra, Terraform, vLLM..."
              className="flex-1 min-w-[200px] bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="bg-slate-900 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
            >
              <option value="hard">Hard Technical</option>
              <option value="tool">Tool & Platform</option>
              <option value="soft">Leadership & Soft</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
            >
              Add & Endorse
            </button>
          </form>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.skills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 group hover:border-slate-700 transition"
            >
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{skill.name}</h4>
                <span className="text-[10px] text-slate-400 capitalize">{skill.category} Skill</span>
              </div>
              <button
                onClick={() => endorseSkill(skill.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition ${
                  skill.endorsedByMe
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Endorse this skill"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{skill.endorsements}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">Recommendations</h2>
          <span className="text-xs text-slate-400">2 Verified Endorsements</span>
        </div>

        <div className="space-y-4">
          {profile.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={rec.authorAvatar}
                  alt={rec.author}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{rec.author}</h4>
                  <p className="text-[11px] text-slate-400">{rec.authorRole}</p>
                  <p className="text-[10px] text-slate-500">{rec.relationship} · {rec.date}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{rec.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
