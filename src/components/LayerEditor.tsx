import React from 'react';
import {
  Sliders,
  Sparkles,
  Sun,
  Type,
  Smile,
  Maximize2,
  RotateCw,
  Palette,
  Eye,
  Lock,
} from 'lucide-react';
import { Layer } from '../types/cursor';

interface LayerEditorProps {
  layer: Layer | null;
  onChange: (updated: Layer) => void;
}

export const LayerEditor: React.FC<LayerEditorProps> = ({ layer, onChange }) => {
  if (!layer) {
    return (
      <div id="layer-editor-empty" className="w-full h-full p-6 flex flex-col items-center justify-center text-center text-[var(--text-muted)] bg-[var(--surface)] border-l border-[var(--border)] select-none">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1">No Layer Selected</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
          Select a layer from the list or canvas to modify its properties, dimensions, glows, and effects.
        </p>
      </div>
    );
  }

  const updateProp = <K extends keyof Layer>(key: K, value: Layer[K]) => {
    onChange({
      ...layer,
      [key]: value,
    });
  };

  const updateGlow = (glowProp: Partial<NonNullable<Layer['glow']>>) => {
    const current = layer.glow || { enabled: false, color: '#00f0ff', blur: 6, intensity: 1 };
    onChange({
      ...layer,
      glow: {
        ...current,
        ...glowProp,
      },
    });
  };

  const updateShadow = (shadowProp: Partial<NonNullable<Layer['shadow']>>) => {
    const current = layer.shadow || { enabled: false, color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 1, offsetY: 1 };
    onChange({
      ...layer,
      shadow: {
        ...current,
        ...shadowProp,
      },
    });
  };

  return (
    <div id="layer-editor-panel" className="w-full flex flex-col h-full bg-[var(--surface)] border-l border-[var(--border)] text-xs overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Layer Properties</h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--accent)] font-mono uppercase">
          {layer.type}
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* Layer Name Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Layer Name
          </label>
          <input
            id="layer-name-input"
            type="text"
            value={layer.name}
            onChange={e => updateProp('name', e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Transform: X, Y, W, H, Rotation */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <Maximize2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Transform (32×32 Space)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">X Position</label>
              <input
                id="prop-x-input"
                type="number"
                step="0.5"
                value={layer.x}
                onChange={e => updateProp('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Y Position</label>
              <input
                id="prop-y-input"
                type="number"
                step="0.5"
                value={layer.y}
                onChange={e => updateProp('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Width</label>
              <input
                id="prop-w-input"
                type="number"
                step="0.5"
                min="0.5"
                value={layer.width}
                onChange={e => updateProp('width', Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Height</label>
              <input
                id="prop-h-input"
                type="number"
                step="0.5"
                min="0.5"
                value={layer.height}
                onChange={e => updateProp('height', Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>Rotation</span>
              <span className="font-mono text-[var(--text)]">{layer.rotation || 0}°</span>
            </div>
            <input
              id="prop-rotation-slider"
              type="range"
              min="-180"
              max="180"
              value={layer.rotation || 0}
              onChange={e => updateProp('rotation', parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>
        </div>

        {/* Shape Specific: Rect Border Radius */}
        {layer.type === 'rect' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>Corner Radius</span>
              <span className="font-mono text-[var(--text)]">{layer.borderRadius || 0}px</span>
            </div>
            <input
              id="prop-radius-slider"
              type="range"
              min="0"
              max="16"
              step="0.5"
              value={layer.borderRadius || 0}
              onChange={e => updateProp('borderRadius', parseFloat(e.target.value) || 0)}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>
        )}

        {/* Text Specific Controls */}
        {layer.type === 'text' && (
          <div className="space-y-2 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase">
              <Type className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Text Settings</span>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Glyph Text</label>
              <input
                id="prop-text-char"
                type="text"
                maxLength={4}
                value={layer.textData?.text || 'A'}
                onChange={e =>
                  updateProp('textData', {
                    text: e.target.value,
                    fontSize: layer.textData?.fontSize || 16,
                    fontFamily: layer.textData?.fontFamily || 'sans-serif',
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Font Size</label>
              <input
                id="prop-text-size"
                type="number"
                min="4"
                max="32"
                value={layer.textData?.fontSize || 16}
                onChange={e =>
                  updateProp('textData', {
                    text: layer.textData?.text || 'A',
                    fontSize: parseInt(e.target.value, 10) || 16,
                    fontFamily: layer.textData?.fontFamily || 'sans-serif',
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono"
              />
            </div>
          </div>
        )}

        {/* Emoji Specific Controls */}
        {layer.type === 'emoji' && (
          <div className="space-y-2 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase">
              <Smile className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Emoji Settings</span>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Emoji Character</label>
              <input
                id="prop-emoji-char"
                type="text"
                value={layer.emojiData?.char || '✨'}
                onChange={e =>
                  updateProp('emojiData', {
                    char: e.target.value,
                    size: layer.emojiData?.size || 16,
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Emoji Size</label>
              <input
                id="prop-emoji-size"
                type="number"
                min="6"
                max="32"
                value={layer.emojiData?.size || 16}
                onChange={e =>
                  updateProp('emojiData', {
                    char: layer.emojiData?.char || '✨',
                    size: parseInt(e.target.value, 10) || 16,
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono"
              />
            </div>
          </div>
        )}

        {/* Appearance: Fill, Stroke, Opacity */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Appearance</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fill Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  id="prop-fill-picker"
                  type="color"
                  value={layer.fill.startsWith('#') ? layer.fill.slice(0, 7) : '#00f0ff'}
                  onChange={e => updateProp('fill', e.target.value)}
                  className="w-7 h-7 rounded border border-[var(--border)] bg-transparent cursor-pointer shrink-0"
                />
                <input
                  id="prop-fill-text"
                  type="text"
                  value={layer.fill}
                  onChange={e => updateProp('fill', e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[11px] text-[var(--text)] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Stroke Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  id="prop-stroke-picker"
                  type="color"
                  value={layer.stroke.startsWith('#') ? layer.stroke.slice(0, 7) : '#ffffff'}
                  onChange={e => updateProp('stroke', e.target.value)}
                  className="w-7 h-7 rounded border border-[var(--border)] bg-transparent cursor-pointer shrink-0"
                />
                <input
                  id="prop-stroke-text"
                  type="text"
                  value={layer.stroke}
                  onChange={e => updateProp('stroke', e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[11px] text-[var(--text)] font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>Stroke Width</span>
              <span className="font-mono text-[var(--text)]">{layer.strokeWidth ?? 1}px</span>
            </div>
            <input
              id="prop-stroke-width-slider"
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={layer.strokeWidth ?? 1}
              onChange={e => updateProp('strokeWidth', parseFloat(e.target.value) || 0)}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
              <span>Opacity</span>
              <span className="font-mono text-[var(--text)]">{Math.round((layer.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              id="prop-opacity-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layer.opacity ?? 1}
              onChange={e => updateProp('opacity', parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>
        </div>

        {/* Glow Controls */}
        <div className="space-y-2.5 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Glow Aura</span>
            </div>
            <input
              id="prop-glow-toggle"
              type="checkbox"
              checked={layer.glow?.enabled ?? false}
              onChange={e => updateGlow({ enabled: e.target.checked })}
              className="accent-[var(--accent)] cursor-pointer"
            />
          </div>

          {layer.glow?.enabled && (
            <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[var(--text-muted)] w-16">Color</label>
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    id="prop-glow-color-picker"
                    type="color"
                    value={layer.glow?.color?.startsWith('#') ? layer.glow.color.slice(0, 7) : '#00f0ff'}
                    onChange={e => updateGlow({ color: e.target.value })}
                    className="w-6 h-6 rounded border border-[var(--border)] bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    id="prop-glow-color-text"
                    type="text"
                    value={layer.glow?.color || '#00f0ff'}
                    onChange={e => updateGlow({ color: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] text-[var(--text)] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                  <span>Glow Blur</span>
                  <span className="font-mono text-[var(--text)]">{layer.glow?.blur ?? 6}px</span>
                </div>
                <input
                  id="prop-glow-blur-slider"
                  type="range"
                  min="1"
                  max="16"
                  value={layer.glow?.blur ?? 6}
                  onChange={e => updateGlow({ blur: parseInt(e.target.value, 10) })}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Shadow Controls */}
        <div className="space-y-2.5 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text)]">
              <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Drop Shadow</span>
            </div>
            <input
              id="prop-shadow-toggle"
              type="checkbox"
              checked={layer.shadow?.enabled ?? false}
              onChange={e => updateShadow({ enabled: e.target.checked })}
              className="accent-[var(--accent)] cursor-pointer"
            />
          </div>

          {layer.shadow?.enabled && (
            <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Offset X</label>
                  <input
                    id="prop-shadow-offset-x"
                    type="number"
                    value={layer.shadow?.offsetX ?? 1}
                    onChange={e => updateShadow({ offsetX: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] text-[var(--text)] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Offset Y</label>
                  <input
                    id="prop-shadow-offset-y"
                    type="number"
                    value={layer.shadow?.offsetY ?? 1}
                    onChange={e => updateShadow({ offsetY: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] text-[var(--text)] font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                  <span>Shadow Blur</span>
                  <span className="font-mono text-[var(--text)]">{layer.shadow?.blur ?? 3}px</span>
                </div>
                <input
                  id="prop-shadow-blur-slider"
                  type="range"
                  min="0"
                  max="12"
                  value={layer.shadow?.blur ?? 3}
                  onChange={e => updateShadow({ blur: parseInt(e.target.value, 10) })}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
