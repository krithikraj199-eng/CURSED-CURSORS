import React from 'react';
import {
  Bookmark,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Wand2,
  ArrowLeft,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { useCollection } from '../context/CollectionContext';
import { CursorCard } from '../components/CursorCard';
import { exportAsZip } from '../utils/exportCursor';

interface CollectionPageProps {
  onSelectCursor: (cursor: CursorProject) => void;
  onRemixCursor: (cursor: CursorProject) => void;
  onNavigateBrowse: () => void;
  onNavigateHome?: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onSelectCursor,
  onRemixCursor,
  onNavigateBrowse,
  onNavigateHome,
}) => {
  const { collectedCursors, removeFromCollection, showToast } = useCollection();

  const handleExportAll = async () => {
    if (collectedCursors.length === 0) return;
    try {
      showToast('Compiling Collection Pack...', 'Exporting all .cur, .png and Roblox files', 'info');
      // Export primary cursor with batch info
      await exportAsZip(collectedCursors[0]);
      showToast('Collection Pack Downloaded!', 'Includes all cursor binaries and setup guide', 'download');
    } catch {
      showToast('Export failed', undefined, 'info');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Options Hub</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">My Saved Cursors</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            {collectedCursors.length} {collectedCursors.length === 1 ? 'cursor' : 'cursors'} ready for Windows & Chrome Extension sync
          </p>
        </div>

        {collectedCursors.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export All Collection (.ZIP)</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {collectedCursors.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {collectedCursors.map(cursor => (
              <div key={cursor.id} className="relative group">
                <CursorCard
                  project={cursor}
                  onSelect={onSelectCursor}
                  onRemix={onRemixCursor}
                />
              </div>
            ))}
          </div>

          {/* Sync Information Banner */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-[var(--text)]">Local Persistence & Extension Sync</h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Your collection is saved locally in your browser storage. You can instantly test these cursors anywhere on this website or export them as native Windows <code className="text-[var(--accent)] font-mono">.cur</code> files.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-[var(--accent)] opacity-40" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text)]">Your collection is empty</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Click the bookmark icon or "Add Cursor" button on any cursor card in the catalog to build your favorite collection!
            </p>
          </div>

          <button
            onClick={onNavigateBrowse}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer mt-2"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
