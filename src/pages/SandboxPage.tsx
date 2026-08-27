import React, { useState } from 'react';
import {
  Zap,
  Hand,
  ExternalLink,
  Sliders,
  CheckCircle2,
  MousePointer2,
  Crosshair,
  Target,
  Sparkles,
  ArrowLeft,
  Volume2,
  Flame,
  Shield,
  Layers3,
  RefreshCw,
} from 'lucide-react';
import { FEATURED_CURSORS } from '../data/featuredCursors';
import { getCursorCssUrl } from '../utils/cursorRenderer';
import { NavigationPage } from '../components/Header';

interface SandboxPageProps {
  onNavigateHome: () => void;
  onNavigateGallery: () => void;
}

export const SandboxPage: React.FC<SandboxPageProps> = ({
  onNavigateHome,
  onNavigateGallery,
}) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [testInputVal, setTestInputVal] = useState('');
  const [testSliderVal, setTestSliderVal] = useState(65);
  const [testToggleState, setTestToggleState] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; hit: boolean }[]>([
    { id: 1, x: 20, y: 30, hit: false },
    { id: 2, x: 75, y: 25, hit: false },
    { id: 3, x: 45, y: 65, hit: false },
    { id: 4, x: 80, y: 70, hit: false },
    { id: 5, x: 15, y: 75, hit: false },
  ]);

  const demoCursors = [
    FEATURED_CURSORS[0], // Cyber Neon Katana / Plasma Reticle
    FEATURED_CURSORS[1], // Netherite Pickaxe / Diamond Sword
    FEATURED_CURSORS[2], // Neon Void Laser
    FEATURED_CURSORS[3], // Pink Kitty Paw
    FEATURED_CURSORS[7], // Inverted Spear of Heaven
    FEATURED_CURSORS[8], // Doge Meme Pointer
  ].filter(Boolean);

  const activeDemo = demoCursors[selectedDemoIndex] || FEATURED_CURSORS[0];

  const arrowCss = getCursorCssUrl(activeDemo.layers, activeDemo.hotspot || { x: 2, y: 2 }, 32);
  const pointerLayers =
    activeDemo.pointerLayers && activeDemo.pointerLayers.length > 0
      ? activeDemo.pointerLayers
      : activeDemo.layers;
  const pointerCss = getCursorCssUrl(
    pointerLayers,
    activeDemo.pointerHotspot || { x: 4, y: 2 },
    32
  );

  const handleHitTarget = (id: number) => {
    setTargets(prev =>
      prev.map(t => (t.id === id ? { ...t, hit: true } : t))
    );
    setScore(s => s + 100);
  };

  const handleResetTargets = () => {
    setTargets([
      { id: 1, x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 60) + 20, hit: false },
      { id: 2, x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 60) + 20, hit: false },
      { id: 3, x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 60) + 20, hit: false },
      { id: 4, x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 60) + 20, hit: false },
      { id: 5, x: Math.floor(Math.random() * 70) + 15, y: Math.floor(Math.random() * 60) + 20, hit: false },
    ]);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>
            <span className="text-xs text-[var(--text-muted)]">•</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">Live Physical Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-cyan-400" />
            <span>Hover Physics & Calibration Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Test precision click hotspots, dynamic arrow-to-pointer transitions, and UI responsiveness with dual-pair vector cursors.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onNavigateGallery}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          <MousePointer2 className="w-3.5 h-3.5 -rotate-45" />
          <span>Browse All Cursors</span>
        </button>
      </div>

      {/* Choose Sample Cursor Suite */}
      <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Select Active Suite to Test:
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] font-bold">
            Hotspot: ({activeDemo.hotspot?.x || 2}, {activeDemo.hotspot?.y || 2})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {demoCursors.map((cursor, idx) => (
            <button
              key={cursor.id}
              onClick={() => setSelectedDemoIndex(idx)}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedDemoIndex === idx
                  ? 'border-[var(--accent)] bg-[var(--surface)] shadow-md border-b-4'
                  : 'border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--surface)] text-[var(--text-muted)]'
              }`}
            >
              <div className="text-xs font-bold text-[var(--text)] truncate">{cursor.title}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-1">{cursor.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Arena (Arrow Cursor Canvas) */}
      <div
        id="sandbox-arena"
        style={{ cursor: arrowCss }}
        className="p-6 sm:p-10 rounded-3xl bg-[var(--card-bg)] border-2 border-slate-200 border-b-4 border-b-cyan-500 shadow-[0_6px_0_rgba(6,182,212,0.18),0_12px_24px_rgba(0,0,0,0.06)] space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-base font-extrabold text-[var(--text)]">
                Active Test Zone: <span className="text-cyan-400">{activeDemo.title}</span>
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Notice the exact instantaneous swap between Arrow and Pointer when hovering interactive controls below.
            </p>
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] bg-[var(--surface)] px-3 py-1.5 rounded-xl border border-[var(--border)]">
            Total Clicks Registered: <span className="text-[var(--accent)] font-mono">{clickCount}</span>
          </div>
        </div>

        {/* Interactive Controls Testing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Button Target */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              1. Button Hover & Click Target
            </span>
            <button
              style={{ cursor: pointerCss }}
              onClick={() => setClickCount(c => c + 1)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-extrabold shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Hand className="w-4 h-4" />
              <span>Click Me (Pointer Hand)</span>
            </button>
            <p className="text-[10px] text-[var(--text-muted)]">Hotspot calibration test</p>
          </div>

          {/* Anchor / Card Target */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              2. Anchor / Hyperlink State
            </span>
            <div
              style={{ cursor: pointerCss }}
              onClick={() => setClickCount(c => c + 1)}
              className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text)] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Interactive Navigation Link</span>
              <ExternalLink className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Simulates web link hover</p>
          </div>

          {/* Toggle Switch Target */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              3. Interactive Toggle Switch
            </span>
            <div
              style={{ cursor: pointerCss }}
              onClick={() => {
                setTestToggleState(!testToggleState);
                setClickCount(c => c + 1);
              }}
              className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-between cursor-pointer"
            >
              <span className="text-xs font-semibold text-[var(--text)]">Gaming High Refresh Rate</span>
              <div
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  testToggleState ? 'bg-[var(--accent)]' : 'bg-zinc-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    testToggleState ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">State: {testToggleState ? 'ENABLED' : 'DISABLED'}</p>
          </div>

          {/* Text Input Focus Target */}
          <div className="sm:col-span-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              4. Text Input Focus & Select Precision
            </span>
            <input
              type="text"
              value={testInputVal}
              onChange={e => setTestInputVal(e.target.value)}
              placeholder="Click here and test text insertion pointer..."
              style={{ cursor: pointerCss }}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <p className="text-[10px] text-[var(--text-muted)]">Verify click focus hotspot</p>
          </div>

          {/* Range Slider Target */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase">
              <span>5. Slider Interaction</span>
              <span className="text-[var(--accent)] font-mono">{testSliderVal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={testSliderVal}
              onChange={e => setTestSliderVal(Number(e.target.value))}
              style={{ cursor: pointerCss }}
              className="w-full accent-[var(--accent)] h-2.5 bg-[var(--card-bg)] rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-[var(--text-muted)]">Drag test with precision pointer</p>
          </div>
        </div>

        {/* Target Reflex Mini-Game */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-extrabold text-[var(--text)]">Precision Aim & Click Minigame</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--text)]">Score: <strong className="text-rose-400 font-mono text-sm">{score}</strong></span>
              <button
                onClick={handleResetTargets}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-xs font-bold text-[var(--accent)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Respawn</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Click on all the targets below to test pointer tip alignment and click registration accuracy:
          </p>

          <div
            className="relative h-48 w-full rounded-xl bg-[var(--card-bg)] border border-[var(--border)] overflow-hidden"
            style={{ cursor: arrowCss }}
          >
            {targets.map(t => (
              <button
                key={t.id}
                onClick={() => handleHitTarget(t.id)}
                disabled={t.hit}
                style={{
                  top: `${t.y}%`,
                  left: `${t.x}%`,
                  cursor: t.hit ? 'default' : pointerCss,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all cursor-pointer ${
                  t.hit
                    ? 'opacity-20 scale-75 bg-slate-500'
                    : 'bg-rose-500 text-white shadow-lg hover:scale-125 active:scale-95 animate-bounce'
                }`}
              >
                <Target className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
