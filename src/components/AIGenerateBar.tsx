import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, AlertCircle } from 'lucide-react';
import { CursorType, Layer, Point } from '../types/cursor';

interface AIGenerateBarProps {
  onGenerated: (result: {
    title: string;
    description: string;
    cursorType: CursorType;
    hotspot: Point;
    tags: string[];
    layers: Layer[];
  }) => void;
}

const CURSOR_TYPES: { id: CursorType; label: string }[] = [
  { id: 'normal', label: 'Normal Arrow' },
  { id: 'pointer', label: 'Pointer Hand' },
  { id: 'text', label: 'Text I-Beam' },
  { id: 'crosshair', label: 'Precision Crosshair' },
  { id: 'grab', label: 'Grab Move' },
  { id: 'help', label: 'Help Indicator' },
  { id: 'custom', label: 'Custom Art' },
];

export const AIGenerateBar: React.FC<AIGenerateBarProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [cursorType, setCursorType] = useState<CursorType>('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate-cursor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          cursorType,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (!data.layers || data.layers.length === 0) {
        throw new Error('AI returned no valid layers');
      }

      onGenerated({
        title: data.title || prompt.trim().slice(0, 24) || 'AI Cursor',
        description: data.description || `Generated with prompt: "${prompt}"`,
        cursorType: data.cursorType || cursorType,
        hotspot: data.hotspot || { x: 2, y: 2 },
        tags: data.tags || ['ai', 'custom'],
        layers: data.layers,
      });

      setPrompt('');
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err.message || 'Failed to synthesize cursor. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="ai-generate-bar-container" className="w-full bg-[var(--surface)] border-b border-[var(--border)] p-3 lg:px-6">
      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Badge / Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--accent)] font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Studio</span>
        </div>

        {/* Prompt Input */}
        <div className="relative flex-1">
          <input
            id="ai-prompt-input"
            type="text"
            placeholder="Describe the cursor you want (e.g., 'cyberpunk glowing violet dagger with star core')..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all disabled:opacity-50"
          />
        </div>

        {/* Cursor Type Selector */}
        <div className="shrink-0">
          <select
            id="ai-cursor-type-select"
            value={cursorType}
            onChange={e => setCursorType(e.target.value as CursorType)}
            disabled={isGenerating}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer disabled:opacity-50"
          >
            {CURSOR_TYPES.map(ct => (
              <option key={ct.id} value={ct.id}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          id="ai-generate-submit-btn"
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold hover:brightness-110 hover:shadow-md hover:shadow-[var(--accent)]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-2.5 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
