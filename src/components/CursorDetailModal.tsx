import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  Bookmark,
  Check,
  Wand2,
  Share2,
  Layers,
  Crosshair,
  ExternalLink,
  ChevronDown,
  Maximize2,
  Gamepad2,
  FileCode,
  Tag,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { renderCursorToCanvas, getCursorCssUrl } from '../utils/cursorRenderer';
import { exportAsPng, exportAsCur, exportAsRoblox, exportAsZip } from '../utils/exportCursor';
import { useCollection } from '../context/CollectionContext';

interface CursorDetailModalProps {
  cursor: CursorProject | null;
  onClose: () => void;
  onRemix: (cursor: CursorProject) => void;
}

export const CursorDetailModal: React.FC<CursorDetailModalProps> = ({ cursor, onClose, onRemix }) => {
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'hotspots' | 'info'>('sandbox');
  const [testInputValue, setTestInputValue] = useState('');
  const [testToggle, setTestToggle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { isCollected, toggleCollection, showToast } = useCollection();

  // Render both primary and pointer canvases
  useEffect(() => {
    if (!cursor) return;

    // 1. Primary cursor
    if (cursorCanvasRef.current) {
      const ctx = cursorCanvasRef.current.getContext('2d');
      if (ctx) {
        renderCursorToCanvas(ctx, cursor.layers, 128, 128);
      }
    }

    // 2. Secondary pointer
    if (pointerCanvasRef.current) {
      const ctx = pointerCanvasRef.current.getContext('2d');
      if (ctx) {
        const ptrLayers =
          cursor.pointerLayers && cursor.pointerLayers.length > 0 ? cursor.pointerLayers : cursor.layers;
        renderCursorToCanvas(ctx, ptrLayers, 128, 128);
      }
    }
  }, [cursor]);

  if (!cursor) return null;

  const inCollection = isCollected(cursor.id);
  const pointerLayers =
    cursor.pointerLayers && cursor.pointerLayers.length > 0 ? cursor.pointerLayers : cursor.layers;
  const pointerHotspot = cursor.pointerHotspot || { x: 4, y: 2 };

  // Compute CSS cursor values for interactive playground
  const cursorStyle = getCursorCssUrl(cursor.layers, cursor.hotspot, 32);
  const pointerStyle = getCursorCssUrl(pointerLayers, pointerHotspot, 32);

  const handleDownload = async (type: 'cur' | 'png' | 'roblox' | 'zip') => {
    setIsExporting(true);
    setDownloadDropdown(false);
    try {
      if (type === 'cur') {
        await exportAsCur(cursor, 'cursor');
        showToast('Downloaded .CUR', 'Windows cursor binary with embedded hotspot', 'download');
      } else if (type === 'png') {
        await exportAsPng(cursor, 'cursor');
        showToast('Downloaded PNG', '32x32 transparent PNG asset', 'download');
      } else if (type === 'roblox') {
        await exportAsRoblox(cursor);
        showToast('Downloaded Roblox Pack', 'Includes ArrowFarCursor.png & instructions', 'download');
      } else if (type === 'zip') {
        await exportAsZip(cursor);
        showToast('Downloaded Complete ZIP', 'All formats (.cur, .png, roblox) + README', 'download');
      }
    } catch (err) {
      console.error(err);
      showToast('Export failed', 'An error occurred during packaging', 'info');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Link copied to clipboard!', undefined, 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--text)]">{cursor.title}</h2>
                {cursor.category && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    {cursor.category}
                  </span>
                )}
                {cursor.isAnimated && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    ANIMATED
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">By {cursor.author || 'Cursed Community'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              title="Share Cursor"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          {/* Left Column: Side-by-side Dual Previews & Hotspot Info */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[var(--bg)]/40">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Dual Pair Preview
              </h3>

              {/* Side-by-Side Dual Display */}
              <div className="grid grid-cols-2 gap-3">
                {/* Normal Arrow Display */}
                <div className="relative rounded-2xl bg-gradient-to-b from-white via-[#f8fafc] to-[#eef2f6] border-2 border-slate-200 border-b-4 border-b-[var(--accent)] p-4 flex flex-col items-center justify-center shadow-[0_6px_0_rgba(99,102,241,0.15),0_10px_20px_rgba(0,0,0,0.06)] overflow-hidden group">
                  <div className="text-[10px] uppercase font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs mb-2">
                    Primary Cursor
                  </div>
                  <div className="relative my-2 p-3 rounded-2xl bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200/90 border-b-[4px] border-b-slate-400/80 shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-transform group-hover:scale-110 group-hover:border-b-[var(--accent)] group-hover:border-b-[5px] duration-200">
                    <canvas
                      ref={cursorCanvasRef}
                      width={128}
                      height={128}
                      className="w-20 h-20 pixelated-render drop-shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-slate-700 font-bold flex items-center gap-1 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs">
                    <Crosshair className="w-3 h-3 text-[var(--accent)]" /> Hotspot: ({cursor.hotspot.x}, {cursor.hotspot.y})
                  </div>
                </div>

                {/* Pointer / Hand Display */}
                <div className="relative rounded-2xl bg-gradient-to-b from-white via-[#f8fafc] to-[#eef2f6] border-2 border-slate-200 border-b-4 border-b-[var(--accent)] p-4 flex flex-col items-center justify-center shadow-[0_6px_0_rgba(99,102,241,0.15),0_10px_20px_rgba(0,0,0,0.06)] overflow-hidden group">
                  <div className="text-[10px] uppercase font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs mb-2">
                    Hover Pointer
                  </div>
                  <div className="relative my-2 p-3 rounded-2xl bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200/90 border-b-[4px] border-b-slate-400/80 shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-transform group-hover:scale-110 group-hover:border-b-[var(--accent)] group-hover:border-b-[5px] duration-200">
                    <canvas
                      ref={pointerCanvasRef}
                      width={128}
                      height={128}
                      className="w-20 h-20 pixelated-render drop-shadow-md"
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-slate-700 font-bold flex items-center gap-1 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs">
                    <Crosshair className="w-3 h-3 text-[var(--accent)]" /> Hotspot: ({pointerHotspot.x}, {pointerHotspot.y})
                  </div>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="mt-5 space-y-3">
                <p className="text-xs text-[var(--text)] leading-relaxed">{cursor.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cursor.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-around text-center text-xs">
              <div>
                <div className="font-bold text-[var(--text)]">{cursor.downloadsCount?.toLocaleString() || '12.4k'}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Downloads</div>
              </div>
              <div className="h-6 w-px bg-[var(--border)]" />
              <div>
                <div className="font-bold text-[var(--text)]">{cursor.likesCount?.toLocaleString() || '3.2k'}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Likes</div>
              </div>
              <div className="h-6 w-px bg-[var(--border)]" />
              <div>
                <div className="font-bold text-[var(--text)]">{cursor.layers.length} Layers</div>
                <div className="text-[10px] text-[var(--text-muted)]">Vector Precision</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Testing Arena & Download Actions */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3 mb-4">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'sandbox'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  Live Testing Arena
                </button>
                <button
                  onClick={() => setActiveTab('hotspots')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'hotspots'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  Hotspot Coordinate Grid
                </button>
              </div>

              {/* Tab 1: Live Interactive Sandbox */}
              {activeTab === 'sandbox' && (
                <div
                  className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-5"
                  style={{ cursor: cursorStyle }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                        Interactive Physics Sandbox
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Move your mouse across elements below to experience normal & hover pointer states!
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      LIVE ACTIVE
                    </span>
                  </div>

                  {/* Interactive UI Elements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Interactive Button */}
                    <button
                      style={{ cursor: pointerStyle }}
                      className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-xs transition-all hover:brightness-110 hover:shadow-lg shadow-[var(--accent-glow)] flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Hover Pointer Target
                    </button>

                    {/* Interactive Outline Button */}
                    <button
                      style={{ cursor: pointerStyle }}
                      className="px-4 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" /> Clickable Link Button
                    </button>

                    {/* Interactive Input Field */}
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={testInputValue}
                        onChange={e => setTestInputValue(e.target.value)}
                        placeholder="Type here to test text cursor area..."
                        style={{ cursor: pointerStyle }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    {/* Toggle Switch */}
                    <div
                      onClick={() => setTestToggle(!testToggle)}
                      style={{ cursor: pointerStyle }}
                      className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] transition-colors hover:border-[var(--accent)]/50"
                    >
                      <span className="text-xs font-medium text-[var(--text)]">
                        Toggle state: {testToggle ? 'Active ⚡' : 'Inactive'}
                      </span>
                      <div
                        className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                          testToggle ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            testToggle ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Hotspot Coordinate Grid */}
              {activeTab === 'hotspots' && (
                <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                    Coordinate Grid & Click Precision
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    The Hotspot determines the exact (X, Y) pixel point where operating systems register mouse clicks.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                      <div className="text-xs font-bold text-[var(--accent)]">Normal Cursor Hotspot</div>
                      <div className="text-xl font-black font-mono">
                        X: {cursor.hotspot.x} / Y: {cursor.hotspot.y}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">Offset from top-left (0-31px)</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                      <div className="text-xs font-bold text-[var(--accent)]">Pointer Hand Hotspot</div>
                      <div className="text-xl font-black font-mono">
                        X: {pointerHotspot.x} / Y: {pointerHotspot.y}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">Offset for finger link clicks</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <div className="flex flex-wrap items-center gap-3">
                {/* Add to Collection Button */}
                <button
                  onClick={() => toggleCollection(cursor)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    inCollection
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {inCollection ? 'In Collection ✓' : 'Add to Collection'}
                </button>

                {/* Remix in Constructor */}
                <button
                  onClick={() => {
                    onRemix(cursor);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-[var(--accent)]" /> Remix in Constructor
                </button>

                {/* Download Dropdown Popover */}
                <div className="relative">
                  <button
                    onClick={() => setDownloadDropdown(!downloadDropdown)}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                  </button>

                  {downloadDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => handleDownload('cur')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <FileCode className="w-4 h-4 text-[var(--accent)]" />
                        <div>
                          <div className="font-semibold">Windows (.CUR)</div>
                          <div className="text-[10px] text-[var(--text-muted)]">Native OS mouse binary</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDownload('roblox')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <Gamepad2 className="w-4 h-4 text-rose-400" />
                        <div>
                          <div className="font-semibold">Roblox Asset Pack</div>
                          <div className="text-[10px] text-[var(--text-muted)]">ArrowFarCursor.png + guide</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDownload('png')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-sky-400" />
                        <div>
                          <div className="font-semibold">Raw PNG (32×32)</div>
                          <div className="text-[10px] text-[var(--text-muted)]">Transparent web graphic</div>
                        </div>
                      </button>

                      <div className="border-t border-[var(--border)] my-1" />

                      <button
                        onClick={() => handleDownload('zip')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold">Complete ZIP Bundle</div>
                          <div className="text-[10px] text-[var(--text-muted)]">All formats + Windows README</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
