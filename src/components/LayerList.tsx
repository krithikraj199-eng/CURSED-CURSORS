import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Square,
  Circle,
  Triangle,
  Star,
  Type,
  Smile,
  Hexagon,
  Grid3X3,
  Minus,
} from 'lucide-react';
import { Layer, LayerShapeType } from '../types/cursor';

interface LayerListProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: (type: LayerShapeType) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

const LAYER_CREATION_OPTIONS: {
  type: LayerShapeType;
  label: string;
  icon: React.ElementType;
}[] = [
  { type: 'polygon', label: 'Polygon / Arrow', icon: Hexagon },
  { type: 'rect', label: 'Rectangle', icon: Square },
  { type: 'circle', label: 'Circle / Dot', icon: Circle },
  { type: 'triangle', label: 'Triangle', icon: Triangle },
  { type: 'star', label: 'Star / Sparkle', icon: Star },
  { type: 'text', label: 'Text Character', icon: Type },
  { type: 'emoji', label: 'Emoji Glyph', icon: Smile },
  { type: 'pixel', label: 'Pixel Grid', icon: Grid3X3 },
  { type: 'line', label: 'Line Segment', icon: Minus },
];

export const LayerList: React.FC<LayerListProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const getLayerIcon = (type: LayerShapeType) => {
    switch (type) {
      case 'rect':
        return Square;
      case 'circle':
        return Circle;
      case 'triangle':
        return Triangle;
      case 'star':
        return Star;
      case 'text':
        return Type;
      case 'emoji':
        return Smile;
      case 'pixel':
        return Grid3X3;
      case 'line':
        return Minus;
      case 'polygon':
      default:
        return Hexagon;
    }
  };

  // Note: Layers in the array are rendered bottom-to-top (index 0 is bottom).
  // In the UI list, top-most visible layer is at the top of the list for intuitive layering.
  const reversedLayers = [...layers].reverse();

  return (
    <div id="layer-list-panel" className="w-full flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Layers</h2>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] font-mono">
            {layers.length}
          </span>
        </div>

        {/* Add Layer Menu Button */}
        <div className="relative">
          <button
            id="add-layer-dropdown-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] text-[var(--text)] border border-[var(--border)] text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          {showAddMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-1.5 z-40 space-y-0.5"
              onMouseLeave={() => setShowAddMenu(false)}
            >
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Add Shape Layer
              </p>
              {LAYER_CREATION_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      onAddLayer(opt.type);
                      setShowAddMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] transition-colors text-left cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Layers Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--text-muted)] space-y-2">
            <p>No layers in this composition.</p>
            <button
              onClick={() => onAddLayer('polygon')}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--border)] text-xs font-medium"
            >
              Add First Layer
            </button>
          </div>
        ) : (
          reversedLayers.map((layer, displayIndex) => {
            const actualIndex = layers.length - 1 - displayIndex;
            const isSelected = selectedLayerId === layer.id;
            const Icon = getLayerIcon(layer.type);
            const canMoveUp = actualIndex < layers.length - 1;
            const canMoveDown = actualIndex > 0;

            return (
              <div
                key={layer.id}
                id={`layer-item-${layer.id}`}
                onClick={() => onSelectLayer(layer.id)}
                className={`group flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[var(--surface-hover)] border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--card-bg)]/60 border-[var(--border)] hover:bg-[var(--surface-hover)]/70'
                }`}
              >
                {/* Left: Icon and Name */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span
                      className={`font-medium text-xs truncate block ${
                        isSelected ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                      }`}
                    >
                      {layer.name}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                  {/* Move Up */}
                  <button
                    onClick={() => onMoveLayer(layer.id, 'up')}
                    disabled={!canMoveUp}
                    title="Move Layer Up"
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => onMoveLayer(layer.id, 'down')}
                    disabled={!canMoveDown}
                    title="Move Layer Down"
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>

                  {/* Lock */}
                  <button
                    onClick={() => onToggleLock(layer.id)}
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                    className={`p-1 rounded transition-colors ${
                      layer.locked
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>

                  {/* Visibility */}
                  <button
                    onClick={() => onToggleVisibility(layer.id)}
                    title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                    className={`p-1 rounded transition-colors ${
                      !layer.visible
                        ? 'text-[var(--text-muted)]/40 bg-black/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => onDuplicateLayer(layer.id)}
                    title="Duplicate Layer"
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)]"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteLayer(layer.id)}
                    title="Delete Layer"
                    className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
