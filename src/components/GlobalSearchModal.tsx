import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Wand2, Compass, Bookmark, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { FEATURED_CURSORS } from '../data/featuredCursors';
import { renderCursorToCanvas } from '../utils/cursorRenderer';
import { useCollection } from '../context/CollectionContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCursor: (cursor: CursorProject) => void;
  onNavigate: (page: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCursor,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isCollected, toggleCollection } = useCollection();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCursors = query.trim()
    ? FEATURED_CURSORS.filter(
        c =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
          (c.category && c.category.toLowerCase().includes(query.toLowerCase())) ||
          (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
      )
    : FEATURED_CURSORS.slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCursors.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCursors.length) % (filteredCursors.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCursors[selectedIndex]) {
        onSelectCursor(filteredCursors[selectedIndex]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--card-bg)]">
          <Search className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search cursors by name, category, or tag (#Minecraft, #Anime, #Cute)..."
            className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)] rounded border border-[var(--border)]">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[var(--bg)]/50 border-b border-[var(--border)] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] shrink-0">Tags:</span>
          {['#Minecraft', '#Roblox', '#Anime', '#Cyber', '#Cute', '#Memes', '#Pixel', '#Gothic'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag.replace('#', ''))}
              className="px-2 py-0.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] whitespace-nowrap cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[var(--border)]/40">
          {filteredCursors.length > 0 ? (
            filteredCursors.map((cursor, idx) => {
              const isSelected = idx === selectedIndex;
              const inCollection = isCollected(cursor.id);

              return (
                <div
                  key={cursor.id}
                  onClick={() => {
                    onSelectCursor(cursor);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)]/10 text-[var(--text)] ring-1 ring-[var(--accent)]/30'
                      : 'hover:bg-[var(--surface-hover)] text-[var(--text)]'
                  }`}
                >
                  {/* Mini Preview Box */}
                  <MiniCanvas layers={cursor.layers} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold truncate">{cursor.title}</h4>
                      {cursor.category && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] shrink-0">
                          {cursor.category}
                        </span>
                      )}
                      {cursor.isAnimated && (
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          ANIMATED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                      {cursor.description || cursor.tags.map(t => `#${t}`).join(' ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleCollection(cursor)}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        inCollection
                          ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                      title={inCollection ? 'In Collection' : 'Add to Collection'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectCursor(cursor);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] text-xs cursor-pointer"
                      title="Inspect & Test"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-[var(--text-muted)] space-y-2">
              <Layers className="w-8 h-8 mx-auto opacity-40 text-[var(--accent)]" />
              <p>No cursors found matching "{query}"</p>
              <button
                onClick={() => {
                  onNavigate('constructor');
                  onClose();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-110 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Build this cursor in Constructor
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Quick Links */}
        <div className="px-4 py-2.5 bg-[var(--card-bg)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate('gallery');
                onClose();
              }}
              className="hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" /> Cursor Gallery
            </button>
            <button
              onClick={() => {
                onNavigate('constructor');
                onClose();
              }}
              className="hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" /> Constructor
            </button>
            <button
              onClick={() => {
                onNavigate('guides');
                onClose();
              }}
              className="hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Install Guides
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[9px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[9px]">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[9px]">↵</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniCanvas: React.FC<{ layers: CursorProject['layers'] }> = ({ layers }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderCursorToCanvas(ctx, layers, 32, 32);
  }, [layers]);

  return (
    <div className="w-9 h-9 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center p-1 shrink-0 checkerboard-pattern">
      <canvas ref={canvasRef} width={32} height={32} className="w-7 h-7 drop-shadow-sm" />
    </div>
  );
};
