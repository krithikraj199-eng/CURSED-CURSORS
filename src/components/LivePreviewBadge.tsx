import React, { useRef, useEffect, useState } from 'react';
import { MousePointer2, Move, Sparkles } from 'lucide-react';
import { Layer, Point } from '../types/cursor';
import { createCursorDataUrl } from '../utils/cursorRenderer';

interface LivePreviewBadgeProps {
  layers: Layer[];
  hotspot: Point;
}

export const LivePreviewBadge: React.FC<LivePreviewBadgeProps> = ({ layers, hotspot }) => {
  const [cursorUri, setCursorUri] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    try {
      const uri = createCursorDataUrl(layers, 32);
      setCursorUri(uri);
    } catch {
      // ignore
    }
  }, [layers]);

  const customCursorStyle = cursorUri
    ? { cursor: `url("${cursorUri}") ${Math.round(hotspot.x)} ${Math.round(hotspot.y)}, auto` }
    : undefined;

  return (
    <div
      id="live-cursor-test-bed"
      style={customCursorStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-4 py-3 rounded-xl border transition-all duration-200 select-none overflow-hidden ${
        isHovered
          ? 'bg-[var(--surface-hover)] border-[var(--accent)] shadow-md shadow-[var(--accent)]/10'
          : 'bg-[var(--surface)] border-[var(--border)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
            <MousePointer2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text)]">Live Cursor Test Area</p>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHovered ? 'Tracking custom vector cursor in real-time' : 'Hover over this box to test cursor feel'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-muted)]">
          <span>Hotspot:</span>
          <span className="text-[var(--accent)] font-semibold">({hotspot.x}, {hotspot.y})</span>
        </div>
      </div>
    </div>
  );
};
