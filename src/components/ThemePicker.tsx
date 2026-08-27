import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeName } from '../types/cursor';
import { Palette, ChevronDown, Check } from 'lucide-react';

interface ThemePickerProps {
  compact?: boolean;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ compact = false }) => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Selector Trigger Button */}
      <button
        id="theme-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text)] transition-colors cursor-pointer"
        title="Change Visual Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full overflow-hidden border border-[var(--border)] shrink-0"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primaryColor} 50%, ${currentTheme.accentColor} 50%)`,
          }}
        />
        {!compact && <span className="font-medium text-xs">{currentTheme.name}</span>}
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
      </button>

      {/* Theme Dropdown Menu (10 Themes) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] mb-1 flex items-center justify-between">
            <span>Color Theme</span>
            <Palette className="w-3 h-3 text-[var(--accent)]" />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5 no-scrollbar">
            {themes.map(t => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as ThemeName);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                      : 'text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-[var(--border)] shrink-0 shadow-xs"
                      style={{
                        background: `linear-gradient(135deg, ${t.primaryColor} 50%, ${t.accentColor} 50%)`,
                      }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
