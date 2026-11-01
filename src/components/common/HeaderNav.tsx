import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  FileCheck2,
  Sparkles,
  Trello,
  Search,
  Bell,
  Settings,
  Share2,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Activity,
  Zap,
  Globe2,
  Bookmark,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { AppMode } from '../../types/career';

interface HeaderNavProps {
  onOpenSettings: () => void;
  onOpenShare: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenSettings, onOpenShare }) => {
  const {
    currentMode,
    setCurrentMode,
    searchQuery,
    setSearchQuery,
    profile,
    atsBreakdown,
    applications,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    runFullSystemHealthCheck,
  } = useCareer();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [isRunningHealth, setIsRunningHealth] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { mode: AppMode; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { mode: 'linkedin_feed', label: 'Network Feed', icon: Users },
    { mode: 'linkedin_profile', label: 'Profile', icon: Briefcase },
    { mode: 'ats_checker', label: 'ATS Resume Lab', icon: FileCheck2, badge: `${atsBreakdown.totalScore}/100` },
    { mode: 'jobify_studio', label: 'Jobify AI Studio', icon: Sparkles },
    { mode: 'job_board', label: 'Jobs', icon: Globe2 },
    { mode: 'application_tracker', label: 'App Kanban', icon: Trello, badge: applications.length },
  ];

  const handleHealthCheckClick = async () => {
    setIsRunningHealth(true);
    await runFullSystemHealthCheck();
    setIsRunningHealth(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Super-Mode Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentMode('linkedin_feed')}
              className="flex items-center gap-2.5 text-left group transition focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  CareerForge
                  <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    AI Unified
                  </span>
                </span>
                <span className="text-[11px] text-slate-400">LinkedIn · ATS Scorer · Jobify AI</span>
              </div>
            </button>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, skills, network..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                ×
              </button>
            )}
          </div>

          {/* Navigation Tabs (Unified Command Bar) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => setCurrentMode(item.mode)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities: Health Check, Share, Notifications, Settings, Profile */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Button Diagnostics Runner */}
            <button
              onClick={handleHealthCheckClick}
              disabled={isRunningHealth}
              title="Audit and verify 100% button functionality across platform"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-lg transition disabled:opacity-50"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isRunningHealth ? 'animate-spin' : ''}`} />
              <span>{isRunningHealth ? 'Auditing...' : 'Audit Buttons'}</span>
            </button>

            {/* Social Share Button */}
            <button
              onClick={onOpenShare}
              title="Share Profile / Resume to Social Networks"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown((prev) => !prev)}
                title="Notifications"
                className="relative p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.targetMode) setCurrentMode(n.targetMode);
                            setShowNotificationsDropdown(false);
                          }}
                          className={`p-2.5 rounded-lg border cursor-pointer transition ${
                            n.read
                              ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                              : 'bg-slate-800/80 border-blue-500/30 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Platform Settings & Configurations"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Avatar quick switch */}
            <button
              onClick={() => setCurrentMode('linkedin_profile')}
              className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full transition group"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/50"
              />
              <span className="hidden sm:inline text-xs font-medium text-slate-200 group-hover:text-white">
                {profile.name.split(' ')[0]}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
