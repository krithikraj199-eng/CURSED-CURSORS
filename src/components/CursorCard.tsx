import React, { useRef, useEffect, useState } from 'react';
import {
  Sparkles,
  Download,
  Bookmark,
  Check,
  Wand2,
  Layers,
  ChevronDown,
  FileCode,
  Gamepad2,
  Flame,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { renderCursorToCanvas, getCursorCssUrl } from '../utils/cursorRenderer';
import { exportAsPng, exportAsCur, exportAsRoblox, exportAsZip } from '../utils/exportCursor';
import { useCollection } from '../context/CollectionContext';

interface CursorCardProps {
  project: CursorProject;
  onRemix: (project: CursorProject) => void;
  onSelect?: (project: CursorProject) => void;
}

export const CursorCard: React.FC<CursorCardProps> = ({ project, onRemix, onSelect }) => {
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { isCollected, toggleCollection, showToast } = useCollection();
  const inCollection = isCollected(project.id);

  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; char: string; tx: number; ty: number }>>([]);

  const pointerLayers =
    project.pointerLayers && project.pointerLayers.length > 0 ? project.pointerLayers : project.layers;
  const pointerHotspot = project.pointerHotspot || { x: 4, y: 2 };

  // Render both primary and pointer canvases at high-DPI (128x128) for crisp emoji & vector rendering
  useEffect(() => {
    if (cursorCanvasRef.current) {
      const ctx = cursorCanvasRef.current.getContext('2d');
      if (ctx) {
        renderCursorToCanvas(ctx, project.layers, 128, 128);
      }
    }
    if (pointerCanvasRef.current) {
      const ctx = pointerCanvasRef.current.getContext('2d');
      if (ctx) {
        renderCursorToCanvas(ctx, pointerLayers, 128, 128);
      }
    }
  }, [project.layers, pointerLayers]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const chars = ['✨', '💖', '⭐', '🌸', '💫', '🎉', '🌟'];
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
      char: chars[Math.floor(Math.random() * chars.length)],
      tx: (Math.random() - 0.5) * 70,
      ty: (Math.random() - 0.5) * 70 - 15,
    }));

    setSparkles(prev => [...prev.slice(-12), ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.some(ns => ns.id === s.id)));
    }, 800);
  };

  const animClass = project.animationType
    ? project.animationType === 'bounce'
      ? 'anim-sweezy-bounce'
      : project.animationType === 'sparkle'
      ? 'anim-sweezy-sparkle'
      : project.animationType === 'pulse' || project.animationType === 'heartbeat'
      ? 'anim-sweezy-pulse'
      : project.animationType === 'wiggle'
      ? 'anim-sweezy-wiggle'
      : project.animationType === 'spin'
      ? 'anim-sweezy-spin'
      : project.animationType === 'wave'
      ? 'anim-sweezy-wave'
      : project.animationType === 'rainbow'
      ? 'anim-sweezy-rainbow'
      : 'anim-sweezy-float'
    : 'anim-sweezy-float';

  const handleExport = async (e: React.MouseEvent, type: 'png' | 'cur' | 'roblox' | 'zip') => {
    e.stopPropagation();
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      if (type === 'cur') {
        await exportAsCur(project, 'cursor');
        showToast('Downloaded .CUR', 'Windows cursor binary with embedded hotspot', 'download');
      } else if (type === 'png') {
        await exportAsPng(project, 'cursor');
        showToast('Downloaded PNG', '32x32 transparent PNG asset', 'download');
      } else if (type === 'roblox') {
        await exportAsRoblox(project);
        showToast('Downloaded Roblox Pack', 'ArrowFarCursor.png + Roblox instructions', 'download');
      } else if (type === 'zip') {
        await exportAsZip(project);
        showToast('Downloaded Complete ZIP', 'All formats + README', 'download');
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Live CSS cursor testing values
  const cursorCss = getCursorCssUrl(project.layers, project.hotspot, 32);
  const pointerCss = getCursorCssUrl(pointerLayers, pointerHotspot, 32);

  // Helper to get vibrant 3D colored edge classes based on category
  const getCategory3DStyle = (cat: string = '') => {
    switch (cat) {
      case 'Games':
      case 'Minecraft':
      case 'Roblox':
        return {
          cardBorder: 'border-emerald-500/40 border-b-4 border-b-emerald-600 hover:border-b-[6px] hover:border-b-emerald-500',
          cardShadow: 'shadow-[0_6px_0_rgba(16,185,129,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(16,185,129,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-emerald-700 bg-emerald-600 text-white',
          pedestalHover: 'group-hover:border-b-emerald-500 group-hover:border-emerald-400/60',
        };
      case 'Anime':
        return {
          cardBorder: 'border-purple-500/40 border-b-4 border-b-purple-600 hover:border-b-[6px] hover:border-b-purple-500',
          cardShadow: 'shadow-[0_6px_0_rgba(168,85,247,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(168,85,247,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-purple-700 bg-purple-600 text-white',
          pedestalHover: 'group-hover:border-b-purple-500 group-hover:border-purple-400/60',
        };
      case 'Cute':
        return {
          cardBorder: 'border-pink-500/40 border-b-4 border-b-pink-500 hover:border-b-[6px] hover:border-b-pink-400',
          cardShadow: 'shadow-[0_6px_0_rgba(236,72,153,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(236,72,153,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-pink-700 bg-pink-500 text-white',
          pedestalHover: 'group-hover:border-b-pink-500 group-hover:border-pink-400/60',
        };
      case 'Cyber & Sci-Fi':
        return {
          cardBorder: 'border-cyan-500/40 border-b-4 border-b-cyan-600 hover:border-b-[6px] hover:border-b-cyan-400',
          cardShadow: 'shadow-[0_6px_0_rgba(6,182,212,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(6,182,212,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-cyan-700 bg-cyan-600 text-white',
          pedestalHover: 'group-hover:border-b-cyan-500 group-hover:border-cyan-400/60',
        };
      case 'Memes':
        return {
          cardBorder: 'border-amber-500/40 border-b-4 border-b-amber-600 hover:border-b-[6px] hover:border-b-amber-500',
          cardShadow: 'shadow-[0_6px_0_rgba(245,158,11,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(245,158,11,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-amber-700 bg-amber-500 text-slate-950 font-black',
          pedestalHover: 'group-hover:border-b-amber-500 group-hover:border-amber-400/60',
        };
      default:
        return {
          cardBorder: 'border-[var(--accent)]/40 border-b-4 border-b-[var(--accent)] hover:border-b-[6px] hover:border-b-[var(--accent)]',
          cardShadow: 'shadow-[0_6px_0_rgba(99,102,241,0.18),0_12px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_0_rgba(99,102,241,0.25),0_18px_30px_rgba(0,0,0,0.12)]',
          badgeEdge: 'border-b-2 border-b-indigo-800 bg-indigo-600 text-white',
          pedestalHover: 'group-hover:border-b-[var(--accent)] group-hover:border-[var(--accent)]/60',
        };
    }
  };

  const style3D = getCategory3DStyle(project.category);

  return (
    <div
      id={`cursor-card-${project.id}`}
      onClick={() => onSelect?.(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowExportMenu(false);
      }}
      style={{ cursor: cursorCss }}
      className={`group relative flex flex-col rounded-2xl bg-[var(--card-bg)] border-2 ${style3D.cardBorder} ${style3D.cardShadow} hover:-translate-y-1.5 transition-all duration-200 overflow-hidden select-none cursor-pointer`}
    >
      {/* Top 176px Dual Stage Area with White Gradient & 3D Inset Bevel */}
      <div
        onClick={handleStageClick}
        className="relative h-44 w-full bg-gradient-to-b from-white via-[#f8fafc] to-[#eef2f6] flex items-center justify-center border-b-2 border-slate-200/80 shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        {/* Subtle radial ambient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 65%)`,
          }}
        />

        {/* Dynamic Sparkle Bursts on Click */}
        {sparkles.map(s => (
          <span
            key={s.id}
            className="absolute pointer-events-none text-base z-30 select-none"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              animation: 'sparkle-burst 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              ['--tx' as any]: `${s.tx}px`,
              ['--ty' as any]: `${s.ty}px`,
            }}
          >
            {s.char}
          </span>
        ))}

        {/* Dual Side-by-Side 3D Canvas Pedestals with Sweezy Live Animation */}
        <div className="relative z-10 flex items-center justify-center gap-6 transition-transform duration-200 group-hover:scale-105">
          {/* Main Arrow Cursor 3D Pedestal */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`relative p-3 rounded-2xl bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200/90 border-b-[4px] border-b-slate-400/80 shadow-[0_4px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] ${style3D.pedestalHover} ${animClass} transition-all duration-200 group-hover:-translate-y-1`}
            >
              <canvas
                ref={cursorCanvasRef}
                width={128}
                height={128}
                className="w-12 h-12 smooth-render drop-shadow-md"
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs">
              Arrow
            </span>
          </div>

          {/* Pointer / Hand Cursor 3D Pedestal */}
          <div
            className="flex flex-col items-center gap-2"
            style={{ cursor: pointerCss }}
            title="Hover here to test pointer state!"
          >
            <div
              className={`relative p-3 rounded-2xl bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200/90 border-b-[4px] border-b-slate-400/80 shadow-[0_4px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] ${style3D.pedestalHover} ${animClass} transition-all duration-200 group-hover:-translate-y-1 hover:scale-110 hover:border-b-[5px]`}
            >
              <canvas
                ref={pointerCanvasRef}
                width={128}
                height={128}
                className="w-12 h-12 smooth-render drop-shadow-md"
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 border-b-2 border-b-slate-400 shadow-2xs">
              Pointer
            </span>
          </div>
        </div>

        {/* Category 3D Pill Tag (Top-Left) */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${style3D.badgeEdge}`}>
          {project.category || 'General'}
        </div>

        {/* Animated & Animation Type Badge (Top-Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 border-b-2 border-b-amber-700 text-[9px] font-black text-slate-950 shadow-sm uppercase">
            <Flame className="w-2.5 h-2.5 fill-current" /> {project.animationType ? `${project.animationType}` : 'ANIMATED'}
          </span>
          {project.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent)] border-b-2 border-b-[var(--accent-contrast)]/40 text-[9px] font-black text-[var(--accent-contrast)] uppercase shadow-sm">
              POPULAR
            </span>
          )}
        </div>

        {/* Live Hover Prompt Ribbon */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 border-b-2 border-b-black text-[var(--accent)] shadow-md">
            Click to Burst Sparkles ✨
          </span>
        </div>
      </div>

      {/* Card Info & Action Bar */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-[var(--text)] tracking-tight line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
              {project.title}
            </h3>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1 leading-relaxed">
            {project.description || project.tags.map(t => `#${t}`).join(' ')}
          </p>

          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mt-2.5 pt-2 border-t border-[var(--border)]/40">
            <span>{project.downloadsCount?.toLocaleString() || '12.8k'} downloads</span>
            <span>{project.layers.length} layers</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
          {/* Add to Collection Button */}
          <button
            onClick={() => toggleCollection(project)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              inCollection
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)]'
            }`}
          >
            {inCollection ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Add Cursor</span>
              </>
            )}
          </button>

          {/* Quick Remix Button */}
          <button
            onClick={() => onRemix(project)}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title="Remix in Constructor"
          >
            <Wand2 className="w-3.5 h-3.5" />
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1 p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-muted)] transition-all cursor-pointer"
              title="Download Cursor Formats"
            >
              <Download className="w-3.5 h-3.5" />
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-1 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={e => handleExport(e, 'cur')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Windows (.CUR)</span>
                </button>
                <button
                  onClick={e => handleExport(e, 'roblox')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Roblox Asset</span>
                </button>
                <button
                  onClick={e => handleExport(e, 'png')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Raw PNG (32×32)</span>
                </button>
                <button
                  onClick={e => handleExport(e, 'zip')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors cursor-pointer border-t border-[var(--border)] mt-1 pt-1"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Complete ZIP</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
