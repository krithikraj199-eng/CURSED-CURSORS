import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid,
  Crosshair,
  Move,
  Eye,
  Info,
} from 'lucide-react';
import { Layer, Point } from '../types/cursor';
import { renderCursorToCanvas, createCursorDataUrl } from '../utils/cursorRenderer';
import { LivePreviewBadge } from './LivePreviewBadge';

interface CursorCanvasProps {
  layers: Layer[];
  selectedLayerId: string | null;
  hotspot: Point;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (updated: Layer) => void;
  onUpdateHotspot: (hotspot: Point) => void;
}

export const CursorCanvas: React.FC<CursorCanvasProps> = ({
  layers,
  selectedLayerId,
  hotspot,
  onSelectLayer,
  onUpdateLayer,
  onUpdateHotspot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preview1xRef = useRef<HTMLCanvasElement | null>(null);
  const preview2xRef = useRef<HTMLCanvasElement | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(10); // 10x zoom => 320x320
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isSettingHotspot, setIsSettingHotspot] = useState<boolean>(false);
  const [isDraggingLayer, setIsDraggingLayer] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; layerX: number; layerY: number } | null>(null);

  const canvasPixelSize = 32 * zoomLevel;

  // Selected layer reference
  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;

  // Render Master Editor Canvas
  const redrawMasterCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Render all vector layers scaled to zoomLevel
    renderCursorToCanvas(ctx, layers, canvasPixelSize, canvasPixelSize, true);

    const scale = zoomLevel;

    // 2. Draw Pixel Grid if enabled
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 32; x++) {
        ctx.beginPath();
        ctx.moveTo(x * scale, 0);
        ctx.lineTo(x * scale, 32 * scale);
        ctx.stroke();
      }
      for (let y = 0; y <= 32; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * scale);
        ctx.lineTo(32 * scale, y * scale);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Draw Selected Layer Bounding Box
    if (selectedLayer && selectedLayer.visible) {
      ctx.save();
      const sx = selectedLayer.x * scale;
      const sy = selectedLayer.y * scale;
      const sw = selectedLayer.width * scale;
      const sh = selectedLayer.height * scale;
      const cx = sx + sw / 2;
      const cy = sy + sh / 2;

      if (selectedLayer.rotation) {
        ctx.translate(cx, cy);
        ctx.rotate((selectedLayer.rotation * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(sx, sy, sw, sh);

      // Draw corner handles
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00f0ff';
      ctx.setLineDash([]);
      const handleSize = 5;
      const corners = [
        { x: sx, y: sy },
        { x: sx + sw, y: sy },
        { x: sx + sw, y: sy + sh },
        { x: sx, y: sy + sh },
      ];
      corners.forEach(c => {
        ctx.fillRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
      });

      ctx.restore();
    }

    // 4. Draw Hotspot Target
    ctx.save();
    const hx = hotspot.x * scale + scale / 2;
    const hy = hotspot.y * scale + scale / 2;

    // Hotspot pulse circle
    ctx.beginPath();
    ctx.arc(hx, hy, 6, 0, Math.PI * 2);
    ctx.fillStyle = isSettingHotspot ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)';
    ctx.fill();
    ctx.strokeStyle = isSettingHotspot ? '#ef4444' : '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Crosshair lines
    ctx.strokeStyle = isSettingHotspot ? '#ef4444' : '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx - 10, hy);
    ctx.lineTo(hx + 10, hy);
    ctx.moveTo(hx, hy - 10);
    ctx.lineTo(hx, hy + 10);
    ctx.stroke();

    // Hotspot center point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [layers, selectedLayer, hotspot, zoomLevel, showGrid, isSettingHotspot, canvasPixelSize]);

  // Redraw 1x and 2x real-scale thumbnails
  const redrawPreviews = useCallback(() => {
    if (preview1xRef.current) {
      const ctx = preview1xRef.current.getContext('2d');
      if (ctx) renderCursorToCanvas(ctx, layers, 32, 32, true);
    }
    if (preview2xRef.current) {
      const ctx = preview2xRef.current.getContext('2d');
      if (ctx) renderCursorToCanvas(ctx, layers, 64, 64, true);
    }
  }, [layers]);

  useEffect(() => {
    redrawMasterCanvas();
    redrawPreviews();
  }, [redrawMasterCanvas, redrawPreviews]);

  // Handle Canvas Mouse Events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 32;
    const clickY = ((e.clientY - rect.top) / rect.height) * 32;

    if (isSettingHotspot) {
      const newHx = Math.max(0, Math.min(31, Math.round(clickX)));
      const newHy = Math.max(0, Math.min(31, Math.round(clickY)));
      onUpdateHotspot({ x: newHx, y: newHy });
      setIsSettingHotspot(false);
      return;
    }

    // Check if clicked inside selected layer to initiate drag
    if (
      selectedLayer &&
      !selectedLayer.locked &&
      clickX >= selectedLayer.x &&
      clickX <= selectedLayer.x + selectedLayer.width &&
      clickY >= selectedLayer.y &&
      clickY <= selectedLayer.y + selectedLayer.height
    ) {
      setIsDraggingLayer(true);
      setDragStart({
        mouseX: clickX,
        mouseY: clickY,
        layerX: selectedLayer.x,
        layerY: selectedLayer.y,
      });
      return;
    }

    // Otherwise test hit from top-to-bottom
    const reversed = [...layers].reverse();
    for (const l of reversed) {
      if (!l.visible || l.locked) continue;
      if (
        clickX >= l.x &&
        clickX <= l.x + l.width &&
        clickY >= l.y &&
        clickY <= l.y + l.height
      ) {
        onSelectLayer(l.id);
        setIsDraggingLayer(true);
        setDragStart({
          mouseX: clickX,
          mouseY: clickY,
          layerX: l.x,
          layerY: l.y,
        });
        return;
      }
    }

    // Clicked empty area
    onSelectLayer(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingLayer || !dragStart || !selectedLayer || selectedLayer.locked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 32;
    const currentY = ((e.clientY - rect.top) / rect.height) * 32;

    const deltaX = currentX - dragStart.mouseX;
    const deltaY = currentY - dragStart.mouseY;

    // Snap to 0.5 grid step
    const newX = Math.round((dragStart.layerX + deltaX) * 2) / 2;
    const newY = Math.round((dragStart.layerY + deltaY) * 2) / 2;

    onUpdateLayer({
      ...selectedLayer,
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setIsDraggingLayer(false);
    setDragStart(null);
  };

  return (
    <div id="cursor-canvas-viewport" className="w-full flex-1 flex flex-col items-center justify-between p-4 bg-[var(--bg)] overflow-auto select-none">
      {/* Top Canvas Toolbar */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-3 shadow-sm">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            id="zoom-out-btn"
            onClick={() => setZoomLevel(prev => Math.max(6, prev - 2))}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono text-[var(--text)] px-1.5 font-medium">
            {zoomLevel}x
          </span>

          <button
            id="zoom-in-btn"
            onClick={() => setZoomLevel(prev => Math.min(16, prev + 2))}
            title="Zoom In"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            id="zoom-reset-btn"
            onClick={() => setZoomLevel(10)}
            title="Reset Zoom to 10x"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-1">
          <button
            id="toggle-grid-btn"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Pixel Grid"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              showGrid
                ? 'bg-[var(--surface-hover)] text-[var(--text)] border-[var(--accent)]'
                : 'text-[var(--text-muted)] border-transparent hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          {/* Hotspot Toggle */}
          <button
            id="toggle-hotspot-btn"
            onClick={() => setIsSettingHotspot(!isSettingHotspot)}
            title="Set Cursor Click Target"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              isSettingHotspot
                ? 'bg-red-500/20 text-red-400 border-red-500 ring-1 ring-red-500'
                : 'text-[var(--text-muted)] border-transparent hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Set Hotspot</span>
            <span className="font-mono text-[10px] ml-0.5 font-bold">
              ({hotspot.x},{hotspot.y})
            </span>
          </button>
        </div>
      </div>

      {/* Main Canvas Stage (Checkerboard + Border) */}
      <div className="relative flex items-center justify-center my-auto p-4">
        {isSettingHotspot && (
          <div className="absolute -top-3 z-20 px-3 py-1 rounded-full bg-red-500 text-white text-[11px] font-semibold shadow-lg animate-bounce">
            Click anywhere on canvas to set click hotspot ({hotspot.x}, {hotspot.y})
          </div>
        )}

        <div
          className="relative rounded-2xl p-2.5 bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden"
          style={{ width: canvasPixelSize + 24, height: canvasPixelSize + 24 }}
        >
          <div
            className="w-full h-full rounded-xl checkerboard-pattern overflow-hidden relative cursor-crosshair"
            style={{ width: canvasPixelSize, height: canvasPixelSize }}
          >
            <canvas
              ref={canvasRef}
              id="master-cursor-canvas"
              width={canvasPixelSize}
              height={canvasPixelSize}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-full block pixelated-render"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Real-Scale Preview & Live Test Zone */}
      <div className="w-full max-w-xl mt-4 space-y-3">
        {/* Real-Scale Previews */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Real-Scale Master
            </div>

            {/* 1x Native 32x32 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg checkerboard-pattern border border-[var(--border)] flex items-center justify-center overflow-hidden">
                <canvas ref={preview1xRef} width={32} height={32} className="w-8 h-8 pixelated-render" />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">1× (32px)</span>
            </div>

            {/* 2x 64x64 */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg checkerboard-pattern border border-[var(--border)] flex items-center justify-center overflow-hidden">
                <canvas ref={preview2xRef} width={64} height={64} className="w-12 h-12 pixelated-render" />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">2× (64px)</span>
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
            <span>Layers:</span>
            <span className="text-[var(--accent)] font-semibold">{layers.length}</span>
          </div>
        </div>

        {/* Interactive Live Cursor Hover Area */}
        <LivePreviewBadge layers={layers} hotspot={hotspot} />
      </div>
    </div>
  );
};
