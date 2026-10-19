'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShieldCheck, EyeOff, FileText, BarChart3, Briefcase, Users, CheckCircle2 } from 'lucide-react';

export function Navbar({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Replace locale prefix in path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  const navItems = [
    { href: `/${currentLocale}/dashboard`, label: t('dashboard'), icon: BarChart3 },
    { href: `/${currentLocale}/jobs`, label: t('jobs'), icon: Briefcase },
    { href: `/${currentLocale}/candidates`, label: t('candidates'), icon: Users },
    { href: `/${currentLocale}/audit`, label: t('audit'), icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href={`/${currentLocale}`} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FairHire<span className="text-blue-400">.ai</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1">
                  EQUAL TECH RECRUITMENT
                </span>
              </div>
            </Link>

            {/* Blind Mode Indicator Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 ms-4">
              <EyeOff className="w-3.5 h-3.5" />
              <span>BLIND SCREENING ACTIVE</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right section: Audit Status & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* Hash Chain Integrity pill */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px]">Audit Chain: Valid</span>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentLocale === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('he')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentLocale === 'he'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                עב
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('am')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentLocale === 'am'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                አማ
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
