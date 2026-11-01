import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  timestamp: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-300',
          info: 'border-cyan-500/40 bg-slate-900/95 text-cyan-300',
          warning: 'border-amber-500/40 bg-slate-900/95 text-amber-300',
          error: 'border-rose-500/40 bg-slate-900/95 text-rose-300',
        };

        const IconComponent = {
          success: CheckCircle2,
          info: Info,
          warning: AlertTriangle,
          error: AlertCircle,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${borderColors[toast.type]}`}
            role="status"
          >
            <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-white flex items-center justify-between">
                <span>{toast.title}</span>
                <span className="text-[10px] text-slate-400 font-mono ml-2 font-normal">
                  {toast.timestamp}
                </span>
              </div>
              {toast.message && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
