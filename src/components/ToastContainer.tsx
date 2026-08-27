import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { CheckCircle2, Download, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCollection();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xl shadow-black/20 text-[var(--text)] transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'download' ? (
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
            ) : toast.type === 'info' ? (
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-semibold leading-snug">{toast.title}</h4>
            {toast.description && (
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
