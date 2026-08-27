import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  Flame,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  X,
  Wand2,
  ArrowLeft,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { FEATURED_CURSORS } from '../data/featuredCursors';
import { CursorCard } from '../components/CursorCard';

interface BrowseProps {
  initialCategory?: string;
  onSelectCursor: (cursor: CursorProject) => void;
  onRemixCursor: (cursor: CursorProject) => void;
  onNavigateConstructor: () => void;
  onNavigateHome?: () => void;
}

export const Browse: React.FC<BrowseProps> = ({
  initialCategory,
  onSelectCursor,
  onRemixCursor,
  onNavigateConstructor,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAnimated, setOnlyAnimated] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'likes' | 'name'>('popular');

  const categories = [
    'All',
    'Games',
    'Anime',
    'Cute',
    'Memes',
    'Cyber & Sci-Fi',
    'Aesthetics',
    'Tech & OS',
  ];

  const popularTags = [
    'minecraft',
    'roblox',
    'cyber',
    'neon',
    'cat',
    'blade',
    'cursed',
    'hacker',
    'gold',
    'anime',
    'sweet',
  ];

  const filteredCursors = useMemo(() => {
    return FEATURED_CURSORS.filter(cursor => {
      // Category filter (normalized match)
      if (selectedCategory !== 'All') {
        const selNorm = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
        const curNorm = (cursor.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (selNorm !== curNorm && !curNorm.includes(selNorm) && !selNorm.includes(curNorm)) {
          return false;
        }
      }
      // Animated filter
      if (onlyAnimated && !cursor.isAnimated) {
        return false;
      }
      // Tag filter
      if (selectedTag && !cursor.tags.includes(selectedTag)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = cursor.title.toLowerCase().includes(q);
        const matchesTags = cursor.tags.some(t => t.toLowerCase().includes(q));
        const matchesCategory = cursor.category?.toLowerCase().includes(q);
        const matchesDesc = cursor.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTags && !matchesCategory && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.downloadsCount || 0) - (a.downloadsCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [selectedCategory, selectedTag, searchQuery, onlyAnimated, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Options Hub</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
            <Compass className="w-4 h-4" />
            <span>Cursor Gallery & Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)]">Cursor Gallery & Suites</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Explore {filteredCursors.length} handcrafted cursor suites with live dual-pair hover previews and 1-click Windows & Roblox export
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search catalog by title or tag..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Filter Sidebar / Top Bar + Cards Grid */}
      <div className="space-y-6">
        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)]">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right Filters: Animated Toggle + Sort Select */}
          <div className="flex items-center gap-3">
            {/* Animated Toggle */}
            <button
              onClick={() => setOnlyAnimated(!onlyAnimated)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                onlyAnimated
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Animated Only</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--accent)]" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[var(--text)] focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-[var(--surface)]">Most Popular</option>
                <option value="newest" className="bg-[var(--surface)]">Newest</option>
                <option value="likes" className="bg-[var(--surface)]">Most Liked</option>
                <option value="name" className="bg-[var(--surface)]">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags Sub-Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0">
            Tags:
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag('')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] text-[11px] font-bold cursor-pointer"
            >
              <span>#{selectedTag}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {popularTags.map(tag => {
            if (tag === selectedTag) return null;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className="px-2.5 py-0.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] whitespace-nowrap transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Cursors Grid */}
        {filteredCursors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCursors.map(cursor => (
              <CursorCard
                key={cursor.id}
                project={cursor}
                onSelect={onSelectCursor}
                onRemix={onRemixCursor}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
            <Layers className="w-12 h-12 mx-auto text-[var(--accent)] opacity-40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--text)]">No cursors match your filter criteria</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Try clearing active filters or create your own custom cursor suite in the constructor!
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTag('');
                  setSearchQuery('');
                  setOnlyAnimated(false);
                }}
                className="px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>

              <button
                onClick={onNavigateConstructor}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Open Constructor</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
