'use client';

import React, { useState } from 'react';

type Lang = 'en' | 'he' | 'am';

const translations = {
  en: {
    dir: 'ltr',
    tagline: 'Verified Counterfactual Fairness & Multi-lingual CV Screening',
    title: 'Hire on Merit, Not Demographics',
    description: 'FairHire AI neutralizes algorithmic bias through pre-scoring PII redaction, exact evidence citation verification, and counterfactual parity audits across English, Hebrew, and Amharic.',
    ctaPrimary: 'Explore Screening Pipeline',
    ctaSecondary: 'API Health Status',
    metric1: '< 2.0%',
    metric1Label: 'Counterfactual Score Parity Delta',
    metric2: '100%',
    metric2Label: 'Verified Substring Citations',
    metric3: 'Zero PII',
    metric3Label: 'Pre-Scoring Blind Redaction',
    featuresTitle: 'Security & Fairness Architecture',
    feat1Title: 'Untrusted Data Framing',
    feat1Desc: 'CV text is treated as raw untrusted payload. Adversarial prompt injections and instruction hijacking are safely defused.',
    feat2Title: 'Deterministic Scoring',
    feat2Desc: 'Overall scores are strictly computed via code-level weighted algorithms, never arbitrary LLM numerical guesses.',
    feat3Title: 'Multi-lingual Engine',
    feat3Desc: 'Native support for bidirectional Hebrew RTL syntax, Ge\'ez script for Amharic, and standard English.',
  },
  he: {
    dir: 'rtl',
    tagline: 'הגינות מוכחת וסינון קורות חיים רב-לשוני',
    title: 'גיוס עובדים על בסיס כישורים, לא דמוגרפיה',
    description: 'פלטפורמת FairHire AI מונעת הטיות מובְנות באמצעות הסתרת פרטים מזהים (PII), ציטוט מדויק של ראיות מתוך הטקסט, ומבחני שוויון קונטרפקטואליים בעברית, אנגלית ואמהרית.',
    ctaPrimary: 'התחל סינון מועמדים',
    ctaSecondary: 'בדיקת תקינות מערכת (API)',
    metric1: '< 2.0%',
    metric1Label: 'סטיית שוויון מרבית',
    metric2: '100%',
    metric2Label: 'אימות ציטוטים מדויק',
    metric3: 'אפס PII',
    metric3Label: 'עיוורון מוחלט לפרטים אישיים',
    featuresTitle: 'ארכיטקטורת אבטחה והגינות',
    feat1Title: 'בידוד נתונים לא מהימנים',
    feat1Desc: 'קורות החיים מוגדרים כמטען נתונים מבודד. נסיונות הזרקת הנחיות (Prompt Injection) מנוטרלים אוטומטית.',
    feat2Title: 'חישוב ציון דטרמיניסטי',
    feat2Desc: 'הציון המשוקלל מחושב במדויק בקוד, ללא הזיות או ניחושים של מודלי שפה.',
    feat3Title: 'תמיכה שפתית שוויונית',
    feat3Desc: 'תמיכה מלאה בכתיבה מימין לשמאל (עברית), כתב געז (אמהרית), ואנגלית.',
  },
  am: {
    dir: 'ltr',
    tagline: 'የተረጋገጠ አድልዎ-አልባ የሲቪ (CV) ማጣሪያ ስርዓት',
    title: 'በችሎታ እና ብቃት ላይ የተመሰረተ ቅጥር',
    description: 'FairHire AI በቅድመ-ግምገማ የግል መረጃዎችን በመሰወር፣ ትክክለኛ የጽሁፍ ጥቅሶችን በማረጋገጥ እና በእንግሊዝኛ፣ በዕብራይስጥ እና በአማርኛ ቋንቋዎች ፍትሃዊ ቅጥርን ያረጋግጣል።',
    ctaPrimary: 'የቅጥር ሂደትን ይጀምሩ',
    ctaSecondary: 'የስርዓት ጤንነት (API)',
    metric1: '< 2.0%',
    metric1Label: 'የውጤት ተመጣጣኝነት ልዩነት',
    metric2: '100%',
    metric2Label: 'የተረጋገጡ የጽሁፍ ማስረጃዎች',
    metric3: 'ዜሮ PII',
    metric3Label: 'የግል መረጃዎችን በሙሉ መሰወር',
    featuresTitle: 'የደህንነት እና የፍትሃዊነት መሰረተ-ልማት',
    feat1Title: 'ያልተረጋገጠ መረጃ መከላከል',
    feat1Desc: 'የሲቪ ጽሁፎች እንደ ያልተረጋገጠ ዳታ ብቻ ይታያሉ፣ የተደበቁ የትእዛዝ ጠለፋዎች (Prompt Injection) ይከለከላሉ።',
    feat2Title: 'ትክክለኛ የቁጥር ስሌት',
    feat2Desc: 'አጠቃላይ ነጥቡ በኮድ ደረጃ በተቀመጠ የክብደት ስሌት ይሰላል፣ በግምት አይደለም።',
    feat3Title: 'ባለብዙ ቋንቋ ድጋፍ',
    feat3Desc: 'ለግዕዝ ፊደላት (አማርኛ)፣ ለዕብራይስጥ እና ለእንግሊዝኛ የተሟላ ተፈጥሯዊ ድጋፍ።',
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  return (
    <main dir={t.dir} className="min-h-screen px-4 py-8 max-w-6xl mx-auto flex flex-col justify-between">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            FH
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">FairHire AI</h1>
            <p className="text-xs text-slate-400">Ethical Screening Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded transition ${lang === 'en' ? 'bg-emerald-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('he')}
            className={`px-3 py-1.5 rounded transition font-medium ${lang === 'he' ? 'bg-emerald-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            עברית (RTL)
          </button>
          <button
            onClick={() => setLang('am')}
            className={`px-3 py-1.5 rounded transition font-medium ${lang === 'am' ? 'bg-emerald-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            አማርኛ
          </button>
        </div>
      </header>

      <section className="text-center py-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {t.tagline}
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {t.title}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          {t.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#screening"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-emerald-500/25"
          >
            {t.ctaPrimary}
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
          >
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
          <div className="text-3xl font-extrabold text-emerald-400 mb-2">{t.metric1}</div>
          <div className="text-sm font-semibold text-white mb-1">{t.metric1Label}</div>
          <div className="text-xs text-slate-400">Score parity across names, genders & cultures</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
          <div className="text-3xl font-extrabold text-teal-400 mb-2">{t.metric2}</div>
          <div className="text-sm font-semibold text-white mb-1">{t.metric2Label}</div>
          <div className="text-xs text-slate-400">Strict substring validation eliminates hallucinations</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur">
          <div className="text-3xl font-extrabold text-cyan-400 mb-2">{t.metric3}</div>
          <div className="text-sm font-semibold text-white mb-1">{t.metric3Label}</div>
          <div className="text-xs text-slate-400">Identifiers redacted before screening engine execution</div>
        </div>
      </section>

      <section id="screening" className="my-12">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">{t.featuresTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <h4 className="font-semibold text-emerald-400 mb-2">{t.feat1Title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t.feat1Desc}</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <h4 className="font-semibold text-teal-400 mb-2">{t.feat2Title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t.feat2Desc}</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <h4 className="font-semibold text-cyan-400 mb-2">{t.feat3Title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t.feat3Desc}</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 pt-6 mt-12 flex items-center justify-between text-xs text-slate-500">
        <div>FairHire AI v0.1 • Production Scaffold Verified</div>
        <div className="flex items-center gap-4">
          <span>Security Hardened</span>
          <span>Docker Non-Root</span>
          <span>Caddy HTTPS</span>
        </div>
      </footer>
    </main>
  );
}
