import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { profile, atsBreakdown } = useCareer();
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'profile' | 'resume' | 'achievement'>('profile');

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText =
    shareType === 'profile'
      ? `Check out ${profile.name}'s professional profile on CareerForge AI: ${profile.headline}`
      : shareType === 'resume'
      ? `Verified ATS Score: ${atsBreakdown.totalScore}/100. View ${profile.name}'s optimized engineering resume.`
      : `Just achieved a ${atsBreakdown.totalScore}/100 ATS match score and completed AI Mock Interview prep on CareerForge!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      color: 'bg-[#0077b5] hover:bg-[#006396]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Twitter / X',
      color: 'bg-slate-800 hover:bg-slate-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#20b858]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-[#0088cc] hover:bg-[#0077b5]',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Reddit',
      color: 'bg-[#FF4500] hover:bg-[#e03d00]',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Share to Social Networks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Share Content Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">What would you like to share?</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setShareType('profile')}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition ${
                  shareType === 'profile'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                LinkedIn Profile
              </button>
              <button
                onClick={() => setShareType('resume')}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition ${
                  shareType === 'resume'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ATS Score ({atsBreakdown.totalScore}/100)
              </button>
              <button
                onClick={() => setShareType('achievement')}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition ${
                  shareType === 'achievement'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Interview Readiness
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Snippet Preview</span>
            <p className="leading-relaxed text-slate-200">{shareText}</p>
          </div>

          {/* Social Platforms Row */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Select Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {socialLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-xs font-medium transition shadow-md ${platform.color}`}
                >
                  <span>{platform.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Direct Link Copy */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Direct Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-950 text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-800 font-mono select-all focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
