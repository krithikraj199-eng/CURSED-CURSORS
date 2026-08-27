import React from 'react';
import { Tag as TagIcon, X } from 'lucide-react';

interface TagCloudProps {
  tagCounts: Record<string, number>;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tagCounts,
  selectedTags,
  onToggleTag,
  onClearTags,
}) => {
  const sortedTags = (Object.entries(tagCounts) as [string, number][]).sort((a, b) => b[1] - a[1]);

  if (sortedTags.length === 0) return null;

  return (
    <div id="gallery-tag-cloud" className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mr-1 font-medium">
        <TagIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span>Tags:</span>
      </div>

      {sortedTags.map(([tag, count]) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            id={`tag-filter-${tag}`}
            onClick={() => onToggleTag(tag)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border border-[var(--accent)] shadow-sm'
                : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]'
            }`}
          >
            <span>#{tag}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected
                  ? 'bg-black/20 text-[var(--accent-contrast)]'
                  : 'bg-[var(--surface-hover)] text-[var(--text-muted)]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}

      {selectedTags.length > 0 && (
        <button
          id="clear-tag-filters-btn"
          onClick={onClearTags}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border border-dashed border-[var(--border)]"
        >
          <X className="w-3 h-3" />
          <span>Clear ({selectedTags.length})</span>
        </button>
      )}
    </div>
  );
};
