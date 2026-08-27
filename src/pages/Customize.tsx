import React, { useState, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Save,
  Download,
  Tag as TagIcon,
  X,
  Layers as LayersIcon,
  Sliders,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  MousePointer2,
  Hand,
  Upload,
  Bookmark,
  ExternalLink,
  ChevronDown,
  FileCode,
  Gamepad2,
} from 'lucide-react';
import { CursorProject, Layer, Point, CursorType } from '../types/cursor';
import { useHistory } from '../hooks/useHistory';
import { AIGenerateBar } from '../components/AIGenerateBar';
import { LayerList } from '../components/LayerList';
import { CursorCanvas } from '../components/CursorCanvas';
import { LayerEditor } from '../components/LayerEditor';
import { ExportDialog } from '../components/ExportDialog';
import { useCollection } from '../context/CollectionContext';
import { getCursorCssUrl } from '../utils/cursorRenderer';
import { exportAsCur, exportAsPng, exportAsRoblox, exportAsZip } from '../utils/exportCursor';
import { ArrowLeft } from 'lucide-react';

interface CustomizeProps {
  project: CursorProject;
  onSave: (project: CursorProject) => Promise<{ success: boolean; project?: CursorProject; error?: string }>;
  onNavigateHome?: () => void;
}

type EditTarget = 'cursor' | 'pointer';
type MobileTab = 'layers' | 'canvas' | 'properties';

export const Customize: React.FC<CustomizeProps> = ({ project, onSave, onNavigateHome }) => {
  // Target: Are we editing the primary Cursor (Arrow) or the Hover Pointer (Hand/Link)?
  const [editTarget, setEditTarget] = useState<EditTarget>('cursor');

  // Project Info State
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category || 'Custom');
  const [tags, setTags] = useState<string[]>(project.tags || ['custom']);
  const [tagInput, setTagInput] = useState('');
  const [hotspot, setHotspot] = useState<Point>(project.hotspot || { x: 2, y: 2 });
  const [pointerHotspot, setPointerHotspot] = useState<Point>(project.pointerHotspot || { x: 4, y: 2 });
  const [cursorType, setCursorType] = useState<CursorType>(project.cursorType || 'normal');

  // Cursor layers history
  const {
    state: cursorLayers,
    set: setCursorLayers,
    undo: undoCursor,
    redo: redoCursor,
    reset: resetCursorLayers,
    canUndo: canUndoCursor,
    canRedo: canRedoCursor,
  } = useHistory<Layer[]>(project.layers || []);

  // Pointer layers history
  const defaultPointerLayers =
    project.pointerLayers && project.pointerLayers.length > 0
      ? project.pointerLayers
      : project.layers || [];
  const {
    state: pointerLayers,
    set: setPointerLayers,
    undo: undoPointer,
    redo: redoPointer,
    reset: resetPointerLayers,
    canUndo: canUndoPointer,
    canRedo: canRedoPointer,
  } = useHistory<Layer[]>(defaultPointerLayers);

  // Active layers and setters based on editTarget
  const activeLayers = editTarget === 'cursor' ? cursorLayers : pointerLayers;
  const setActiveLayers = editTarget === 'cursor' ? setCursorLayers : setPointerLayers;
  const activeHotspot = editTarget === 'cursor' ? hotspot : pointerHotspot;
  const setActiveHotspot = editTarget === 'cursor' ? setHotspot : setPointerHotspot;
  const canUndo = editTarget === 'cursor' ? canUndoCursor : canUndoPointer;
  const canRedo = editTarget === 'cursor' ? canRedoCursor : canRedoPointer;
  const undo = editTarget === 'cursor' ? undoCursor : undoPointer;
  const redo = editTarget === 'cursor' ? redoCursor : redoPointer;

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    activeLayers.length > 0 ? activeLayers[activeLayers.length - 1].id : null
  );

  // UI state
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testInputVal, setTestInputVal] = useState('');
  const [testToggle, setTestToggle] = useState(false);
  const [downloadDropdown, setDownloadDropdown] = useState(false);

  const { isCollected, toggleCollection, showToast } = useCollection();

  // Sync when active project changes
  useEffect(() => {
    setProjectTitle(project.title);
    setCategory(project.category || 'Custom');
    setTags(project.tags || ['custom']);
    setHotspot(project.hotspot || { x: 2, y: 2 });
    setPointerHotspot(project.pointerHotspot || { x: 4, y: 2 });
    setCursorType(project.cursorType || 'normal');
    resetCursorLayers(project.layers || []);
    resetPointerLayers(
      project.pointerLayers && project.pointerLayers.length > 0 ? project.pointerLayers : project.layers || []
    );
    if (project.layers && project.layers.length > 0) {
      setSelectedLayerId(project.layers[project.layers.length - 1].id);
    }
  }, [project.id]);

  // Handle Layer selection & updates
  const handleSelectLayer = (id: string | null) => setSelectedLayerId(id);

  const handleUpdateLayer = (updated: Layer) => {
    setActiveLayers(activeLayers.map(l => (l.id === updated.id ? updated : l)));
  };

  const handleAddLayer = (newLayer: Layer) => {
    setActiveLayers([...activeLayers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (id: string) => {
    const next = activeLayers.filter(l => l.id !== id);
    setActiveLayers(next);
    if (selectedLayerId === id) {
      setSelectedLayerId(next.length > 0 ? next[next.length - 1].id : null);
    }
  };

  const handleDuplicateLayer = (layer: Layer) => {
    const duplicated: Layer = {
      ...layer,
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${layer.name} (Copy)`,
      x: Math.min(28, layer.x + 2),
      y: Math.min(28, layer.y + 2),
    };
    setActiveLayers([...activeLayers, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  const handleReorderLayers = (reordered: Layer[]) => {
    setActiveLayers(reordered);
  };

  const handleApplyAILayers = (aiLayers: Layer[], prompt: string) => {
    setActiveLayers(aiLayers);
    if (aiLayers.length > 0) {
      setSelectedLayerId(aiLayers[aiLayers.length - 1].id);
    }
    const cleanTag = prompt.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    showToast('AI Synthesized', 'Generated vector layers applied to canvas', 'success');
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Compile current project object
  const getCurrentProjectObject = (): CursorProject => ({
    ...project,
    title: projectTitle,
    category,
    tags,
    hotspot,
    pointerHotspot,
    cursorType,
    layers: cursorLayers,
    pointerLayers,
    updatedAt: new Date().toISOString(),
  });

  const handleSave = async () => {
    setIsSaving(true);
    const updated = getCurrentProjectObject();
    try {
      const res = await onSave(updated);
      if (res.success) {
        showToast('Saved to Workspace', 'Your custom cursor is saved', 'success');
      } else {
        showToast('Save error', res.error || 'Failed to save', 'info');
      }
    } catch {
      showToast('Save error', 'Unexpected error occurred', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const newLayer: Layer = {
          id: `layer-img-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'image',
          visible: true,
          locked: false,
          opacity: 1,
          x: 2,
          y: 2,
          width: 28,
          height: 28,
          rotation: 0,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          imageData: { src, width: 28, height: 28 },
        };
        handleAddLayer(newLayer);
        showToast('Image Layer Added', file.name, 'success');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Live CSS cursor testing values
  const currentProj = getCurrentProjectObject();
  const cursorCss = getCursorCssUrl(cursorLayers, hotspot, 32);
  const pointerCss = getCursorCssUrl(pointerLayers, pointerHotspot, 32);
  const inCollection = isCollected(project.id);

  return (
    <div className="space-y-4 pb-16">
      {/* Top Studio Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
        {/* Title & Category Input */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="p-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer mr-1"
              title="Back to Options Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <input
            type="text"
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            className="text-base font-bold text-[var(--text)] bg-transparent hover:bg-[var(--surface)] focus:bg-[var(--surface)] px-2 py-1 rounded-lg border border-transparent focus:border-[var(--accent)] transition-colors focus:outline-none"
            placeholder="Cursor Project Name..."
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-xs font-semibold px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] focus:outline-none cursor-pointer"
          >
            <option value="Games">Games</option>
            <option value="Anime">Anime</option>
            <option value="Cute">Cute</option>
            <option value="Cyber & Sci-Fi">Cyber & Sci-Fi</option>
            <option value="Memes">Memes</option>
            <option value="Aesthetics">Aesthetics</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Dual Pair Target Switcher: Arrow vs Pointer */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <button
            onClick={() => {
              setEditTarget('cursor');
              if (cursorLayers.length > 0) setSelectedLayerId(cursorLayers[cursorLayers.length - 1].id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              editTarget === 'cursor'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            <span>Edit Arrow ({cursorLayers.length})</span>
          </button>

          <button
            onClick={() => {
              setEditTarget('pointer');
              if (pointerLayers.length > 0) setSelectedLayerId(pointerLayers[pointerLayers.length - 1].id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              editTarget === 'pointer'
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Edit Pointer ({pointerLayers.length})</span>
          </button>
        </div>

        {/* Action Buttons: Undo/Redo, Upload, Save, Download */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 bg-[var(--surface)] p-0.5 rounded-xl border border-[var(--border)]">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Image / SVG Button */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">Upload Image</span>
            <input type="file" accept="image/*,.svg" onChange={handleImageUpload} className="hidden" />
          </label>

          {/* Save to Collection */}
          <button
            onClick={() => toggleCollection(currentProj)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              inCollection
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{inCollection ? 'Collected' : 'Add to Collection'}</span>
          </button>

          {/* Save Workspace */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-bold text-[var(--text)] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Save</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadDropdown(!downloadDropdown)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {downloadDropdown && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in duration-100">
                <button
                  onClick={async () => {
                    setDownloadDropdown(false);
                    await exportAsCur(currentProj, editTarget);
                    showToast('Exported .CUR', 'Windows mouse binary with hotspot', 'download');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Windows (.CUR)</span>
                </button>
                <button
                  onClick={async () => {
                    setDownloadDropdown(false);
                    await exportAsRoblox(currentProj);
                    showToast('Exported Roblox Pack', 'ArrowFarCursor.png', 'download');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] cursor-pointer"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Roblox Asset Pack</span>
                </button>
                <button
                  onClick={async () => {
                    setDownloadDropdown(false);
                    await exportAsPng(currentProj, editTarget);
                    showToast('Exported PNG', '32x32 transparent PNG', 'download');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] cursor-pointer"
                >
                  <LayersIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Raw PNG (32×32)</span>
                </button>
                <button
                  onClick={async () => {
                    setDownloadDropdown(false);
                    await exportAsZip(currentProj);
                    showToast('Exported ZIP', 'Complete bundle + README', 'download');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent)] border-t border-[var(--border)] mt-1 pt-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Complete ZIP</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Synthesis Prompt Bar */}
      <AIGenerateBar
        currentLayers={activeLayers}
        cursorType={cursorType}
        onApplyLayers={handleApplyAILayers}
      />

      {/* Mobile Tab Selector */}
      <div className="lg:hidden flex items-center rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-1">
        <button
          onClick={() => setMobileTab('layers')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
            mobileTab === 'layers' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'
          }`}
        >
          Layers ({activeLayers.length})
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
            mobileTab === 'canvas' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'
          }`}
        >
          Canvas
        </button>
        <button
          onClick={() => setMobileTab('properties')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
            mobileTab === 'properties' ? 'bg-[var(--accent)] text-[var(--accent-contrast)]' : 'text-[var(--text-muted)]'
          }`}
        >
          Properties
        </button>
      </div>

      {/* Three-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Layer Manager (3 Cols) */}
        <div className={`lg:col-span-3 ${mobileTab !== 'layers' ? 'hidden lg:block' : ''}`}>
          <LayerList
            layers={activeLayers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={handleSelectLayer}
            onAddLayer={handleAddLayer}
            onDeleteLayer={handleDeleteLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onReorderLayers={handleReorderLayers}
            onToggleVisible={id => {
              setActiveLayers(
                activeLayers.map(l => (l.id === id ? { ...l, visible: !l.visible } : l))
              );
            }}
            onToggleLock={id => {
              setActiveLayers(activeLayers.map(l => (l.id === id ? { ...l, locked: !l.locked } : l)));
            }}
          />
        </div>

        {/* Center Column: Interactive Canvas Stage (6 Cols) */}
        <div className={`lg:col-span-6 space-y-4 ${mobileTab !== 'canvas' ? 'hidden lg:block' : ''}`}>
          <CursorCanvas
            layers={activeLayers}
            selectedLayerId={selectedLayerId}
            hotspot={activeHotspot}
            onSelectLayer={handleSelectLayer}
            onUpdateLayer={handleUpdateLayer}
            onUpdateHotspot={setActiveHotspot}
          />

          {/* Real-time Interactive Testing Sandbox at Bottom */}
          <div
            className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4"
            style={{ cursor: cursorCss }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                  Live Interactive Testing Arena
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LIVE HOVER ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                style={{ cursor: pointerCss }}
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold shadow-sm hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Test Pointer Target</span>
              </button>

              <button
                style={{ cursor: pointerCss }}
                className="px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Link Button Test</span>
              </button>

              <input
                type="text"
                value={testInputVal}
                onChange={e => setTestInputVal(e.target.value)}
                placeholder="Test text input focus..."
                style={{ cursor: pointerCss }}
                className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Layer Property Inspector (3 Cols) */}
        <div className={`lg:col-span-3 ${mobileTab !== 'properties' ? 'hidden lg:block' : ''}`}>
          <LayerEditor
            selectedLayer={activeLayers.find(l => l.id === selectedLayerId) || null}
            onUpdateLayer={handleUpdateLayer}
          />
        </div>
      </div>
    </div>
  );
};
