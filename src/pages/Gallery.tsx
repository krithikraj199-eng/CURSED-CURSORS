import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Sparkles,
  FolderHeart,
  Search,
  PlusCircle,
  X,
  Layers,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { CursorCard } from '../components/CursorCard';
import { TagCloud } from '../components/TagCloud';

interface GalleryProps {
  featuredProjects: CursorProject[];
  savedProjects: CursorProject[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRemix: (project: CursorProject) => void;
  onNewProject: () => void;
  setActivePage: (page: 'home' | 'gallery' | 'customize') => void;
}

type GalleryTab = 'all' | 'featured' | 'saved';

export const Gallery: React.FC<GalleryProps> = ({
  featuredProjects,
  savedProjects,
  searchQuery,
  setSearchQuery,
  onRemix,
  onNewProject,
  setActivePage,
}) => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Aggregate all unique projects
  const allProjects = useMemo(() => {
    const map = new Map<string, CursorProject>();
    savedProjects.forEach(p => map.set(p.id, p));
    featuredProjects.forEach(p => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [featuredProjects, savedProjects]);

  // Compute tag counts from all available projects
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProjects.forEach(p => {
      p.tags?.forEach(tag => {
        const normalized = tag.toLowerCase().trim();
        if (normalized) {
          counts[normalized] = (counts[normalized] || 0) + 1;
        }
      });
    });
    return counts;
  }, [allProjects]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Filter projects by Tab, Search, and Selected Tags
  const filteredProjects = useMemo(() => {
    let list: CursorProject[] = [];
    if (activeTab === 'featured') {
      list = featuredProjects;
    } else if (activeTab === 'saved') {
      list = savedProjects;
    } else {
      list = allProjects;
    }

    const q = searchQuery.toLowerCase().trim();

    return list.filter(project => {
      // 1. Search Query filter
      if (q) {
        const titleMatch = project.title.toLowerCase().includes(q);
        const descMatch = project.description?.toLowerCase().includes(q);
        const promptMatch = project.prompt?.toLowerCase().includes(q);
        const tagMatch = project.tags?.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !promptMatch && !tagMatch) {
          return false;
        }
      }

      // 2. Tag filter (AND condition: project must contain all selected tags)
      if (selectedTags.length > 0) {
        const projectTags = project.tags?.map(t => t.toLowerCase()) || [];
        const hasAllTags = selectedTags.every(st => projectTags.includes(st.toLowerCase()));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [activeTab, allProjects, featuredProjects, savedProjects, searchQuery, selectedTags]);

  return (
    <div id="gallery-page-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Showcase & Community Creations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
          Cursor Gallery
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl">
          Explore curated design styles or remix community compositions directly in the studio.
        </p>
      </div>

      {/* Toolbar: Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] self-start">
          <button
            id="tab-all-designs"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--surface-hover)] text-[var(--text)] font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Designs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--bg)] text-[var(--text-muted)] font-mono">
              {allProjects.length}
            </span>
          </button>

          <button
            id="tab-featured-designs"
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'featured'
                ? 'bg-[var(--surface-hover)] text-[var(--text)] font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Featured</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--bg)] text-[var(--text-muted)] font-mono">
              {featuredProjects.length}
            </span>
          </button>

          <button
            id="tab-saved-designs"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[var(--surface-hover)] text-[var(--text)] font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Recently Made</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--bg)] text-[var(--text-muted)] font-mono">
              {savedProjects.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[var(--text-muted)]" />
          <input
            id="gallery-filter-input"
            type="text"
            placeholder="Filter by title, tags (e.g. glow, pixel, cyberpunk, minimal)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text)] text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tag Cloud Filter */}
      <TagCloud
        tagCounts={tagCounts}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onClearTags={handleClearTags}
      />

      {/* Grid or Empty States */}
      {filteredProjects.length === 0 ? (
        <div
          id="gallery-empty-state"
          className="p-12 rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] text-center space-y-4 max-w-lg mx-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mx-auto">
            {activeTab === 'saved' ? <FolderHeart className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base text-[var(--text)]">
              {activeTab === 'saved' ? 'No saved projects yet.' : 'No cursor compositions match your criteria.'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {activeTab === 'saved'
                ? 'Design custom cursors in the studio and click Save to store them in your workspace.'
                : 'Try adjusting your search terms or clearing selected tags to view all available designs.'}
            </p>
          </div>

          <div className="pt-2">
            {activeTab === 'saved' ? (
              <button
                id="open-studio-empty-btn"
                onClick={() => setActivePage('customize')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-xs hover:brightness-110 shadow-md shadow-[var(--accent)]/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Cursor Studio</span>
              </button>
            ) : (
              <button
                id="clear-filters-empty-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                  setActiveTab('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <CursorCard
              key={project.id}
              project={project}
              onRemix={onRemix}
            />
          ))}
        </div>
      )}
    </div>
  );
};
