import React, { useState } from 'react';
import {
  Download,
  Check,
  X,
  AlertTriangle,
  FileArchive,
  PackageCheck,
  Loader2,
  FileImage,
  MousePointer2,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { exportAsPng, exportAsCur, exportAsZip } from '../utils/exportCursor';

interface ExportDialogProps {
  project: CursorProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ project, isOpen, onClose }) => {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (type: 'png' | 'cur' | 'zip') => {
    setExportingType(type);
    setSuccessType(null);
    try {
      if (type === 'png') await exportAsPng(project);
      else if (type === 'cur') await exportAsCur(project);
      else if (type === 'zip') await exportAsZip(project);

      setSuccessType(type);
      setTimeout(() => setSuccessType(null), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="export-modal-dialog"
        className="w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 space-y-6 text-[var(--text)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Export Cursor Binary</h2>
              <p className="text-xs text-[var(--text-muted)]">Package composition for Windows, web, or games</p>
            </div>
          </div>

          <button
            id="close-export-dialog-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Snapshot Info */}
        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-between text-xs">
          <div>
            <span className="text-[var(--text-muted)]">Target Title: </span>
            <span className="font-semibold text-[var(--text)]">{project.title}</span>
          </div>
          <div className="font-mono text-[var(--accent)] font-medium">
            Hotspot: ({project.hotspot.x}, {project.hotspot.y})
          </div>
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Supported Formats
          </p>

          {/* Option 1: Windows CUR */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">Windows Static .CUR</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Binary cursor with embedded 32-bit BGRA XOR bitmap & hotspot ({project.hotspot.x}, {project.hotspot.y})
                </p>
              </div>
            </div>

            <button
              id="export-cur-btn"
              onClick={() => handleExport('cur')}
              disabled={exportingType !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] text-xs font-semibold border border-[var(--border)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {exportingType === 'cur' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : successType === 'cur' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>.CUR</span>
            </button>
          </div>

          {/* Option 2: 32x32 PNG */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">Native PNG (32×32)</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Transparent alpha sprite for custom web UIs or game HUDs
                </p>
              </div>
            </div>

            <button
              id="export-png-btn"
              onClick={() => handleExport('png')}
              disabled={exportingType !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] text-xs font-semibold border border-[var(--border)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {exportingType === 'png' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : successType === 'png' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>.PNG</span>
            </button>
          </div>

          {/* Option 3: Complete ZIP Bundle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--accent)]/40 bg-[var(--accent)]/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center">
                <FileArchive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[var(--text)]">Complete ZIP Bundle</p>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[var(--accent)] text-[var(--accent-contrast)]">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Includes .cur, .png, and Windows 10/11 installation instructions README.txt
                </p>
              </div>
            </div>

            <button
              id="export-zip-btn"
              onClick={() => handleExport('zip')}
              disabled={exportingType !== null}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold hover:brightness-110 shadow-md shadow-[var(--accent)]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {exportingType === 'zip' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : successType === 'zip' ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <PackageCheck className="w-3.5 h-3.5" />
              )}
              <span>Download ZIP</span>
            </button>
          </div>
        </div>

        {/* Unsupported Formats Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Format Notice</span>
          </div>
          <p className="text-[11px] text-amber-300/90 leading-relaxed">
            Multi-frame animated cursors (.ANI) and Roblox-specific engine models are currently not supported in this static release.
          </p>
        </div>
      </div>
    </div>
  );
};
